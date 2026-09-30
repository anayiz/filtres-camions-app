const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '213500000000';
const DATA_DIR = path.resolve(process.env.DATA_DIR || __dirname);
const DB_FILE = path.join(DATA_DIR, 'data.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const TRUST_PROXY = Number(process.env.TRUST_PROXY || 1);
const ADMIN_SESSION_TTL_MS = Number(process.env.ADMIN_SESSION_TTL_MS || 12 * 60 * 60 * 1000);
const ORDER_AUTO_CANCEL_MINUTES = Number(process.env.ORDER_AUTO_CANCEL_MINUTES || 720);
const REQUEST_LIMIT_BYTES = 10000;

if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'changeme')) {
  throw new Error('ADMIN_PASSWORD must be set to a strong value in production. TODO_OWNER: set ADMIN_PASSWORD in your hosting config or .env file.');
}

const seedProducts = [
  { id: 'p-1', name: 'فلتر هواء — مان TGX', cat: 'فلاتر هواء', desc: 'مطابق للمواصفات الأصلية، كفاءة تنقية عالية.', price: 3800, stock: 14, oem: 'MAN TGX 2019', brand: 'MAN', model: 'TGX', image: 'https://images.unsplash.com/...', category: 'هواء' },
  { id: 'p-2', name: 'فلتر هواء — مرسيدس أكتروس', cat: 'فلاتر هواء', desc: 'مقاوم للغبار، عمر استعمال طويل.', price: 4200, stock: 6, oem: 'Mercedes Actros', brand: 'Mercedes', model: 'Actros', image: '', category: 'هواء' },
  { id: 'p-3', name: 'فلتر هواء — رونو T-Series', cat: 'فلاتر هواء', desc: 'تركيب سهل، ضمان الجودة.', price: 3500, stock: 0, oem: 'Renault T-Series', brand: 'Renault', model: 'T-Series', image: '', category: 'هواء' },
  { id: 'p-4', name: 'فلتر هواء — فولفو FH', cat: 'فلاتر هواء', desc: 'يحمي المحرك من الأتربة الدقيقة.', price: 4500, stock: 9, oem: 'Volvo FH', brand: 'Volvo', model: 'FH', image: '', category: 'هواء' },
  { id: 'p-5', name: 'فلتر زيت مرافق', cat: 'إكسسوارات', desc: 'يُنصح بتغييره مع كل صيانة.', price: 1200, stock: 20, oem: 'Oil Filter', brand: 'Universal', model: 'Heavy Duty', image: '', category: 'زيت' },
  { id: 'p-6', name: 'فلتر وقود مرافق', cat: 'إكسسوارات', desc: 'يحمي حاقن الوقود من الشوائب.', price: 1600, stock: 11, oem: 'Fuel Filter', brand: 'Universal', model: 'Premium', image: '', category: 'وقود' }
];

const clean = (value, maxLength = 200) => String(value ?? '').trim().slice(0, maxLength);
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const createId = (prefix = 'id') => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')}`;

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  return req.ip || 'unknown';
};

const normalizePhone = (value) => {
  const digits = String(value ?? '').replace(/[^\d+]/g, '').replace(/^\+/, '');
  if (!digits) return null;
  if (/^0[567]\d{8}$/.test(digits)) return `213${digits.slice(1)}`;
  if (/^213[567]\d{8}$/.test(digits)) return digits;
  if (/^\+213[567]\d{8}$/.test(`+${digits}`)) return digits;
  return null;
};

const createOrderNumber = () => `FTC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const readDb = () => {
  ensureDir(DATA_DIR);
  if (!fs.existsSync(DB_FILE)) {
    const initial = { products: seedProducts, orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    if (!raw.trim()) return { products: seedProducts, orders: [] };
    const parsed = JSON.parse(raw);
    return {
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : seedProducts,
      orders: Array.isArray(parsed.orders) ? parsed.orders : []
    };
  } catch (error) {
    console.warn('DB read error; using seed data. TODO_OWNER: recover data.json from backup if needed.');
    return { products: seedProducts, orders: [] };
  }
};

let db = readDb();

const backupData = () => {
  if (!fs.existsSync(DB_FILE)) return;
  ensureDir(BACKUP_DIR);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const backupFile = path.join(BACKUP_DIR, `data-${dateStamp}.json`);
  const markerFile = path.join(BACKUP_DIR, 'LAST_BACKUP.txt');
  const marker = fs.existsSync(markerFile) ? fs.readFileSync(markerFile, 'utf8').trim() : '';

  if (marker !== dateStamp) {
    fs.copyFileSync(DB_FILE, backupFile);
    fs.writeFileSync(markerFile, dateStamp);
  }
};

const saveDb = () => {
  ensureDir(DATA_DIR);
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2));
  fs.renameSync(tmpFile, DB_FILE);
  backupData();
};

const tokens = new Map();
const loginFailures = new Map();

const auth = (req, res, next) => {
  const token = String(req.get('x-token') || '');
  if (!token) return res.status(401).json({ error: 'غير مصرح بالدخول' });
  const session = tokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    tokens.delete(token);
    return res.status(401).json({ error: 'انتهت الجلسة. أعد تسجيل الدخول' });
  }
  req.adminSession = session;
  return next();
};

const addStockToProduct = (productId, qty) => {
  const product = db.products.find((item) => String(item.id) === String(productId));
  if (!product) return;
  product.stock = Math.max(0, Number(product.stock || 0) + qty);
};

const drainExpiredPendingOrders = () => {
  const expirationMs = ORDER_AUTO_CANCEL_MINUTES * 60 * 1000;
  const expired = db.orders.filter((order) => {
    if (order.status !== 'pending') return false;
    if (!order.when) return false;
    return Date.now() - new Date(order.when).getTime() > expirationMs;
  });

  expired.forEach((order) => {
    order.status = 'cancelled';
    order.cancelledReason = 'expired';
    order.items.forEach((item) => addStockToProduct(item.id, Number(item.qty || 0)));
  });

  if (expired.length) saveDb();
};

const app = express();
app.set('trust proxy', TRUST_PROXY);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", 'https://wa.me'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'", 'https://wa.me'],
      upgradeInsecureRequests: []
    }
  }
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const orderRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  message: { error: 'تم تجاوز عدد الطلبات المسموح بها. حاول مرة أخرى لاحقًا.' }
});

app.get('/api/health', (_, res) => res.json({ ok: true, uptime: process.uptime(), time: new Date().toISOString() }));
app.get('/api/config', (_, res) => res.json({ whatsapp: WHATSAPP_NUMBER }));
app.get('/api/products', (_, res) => {
  drainExpiredPendingOrders();
  res.json(db.products);
});

app.post('/api/orders', orderRateLimiter, (req, res) => {
  const honeypot = clean(req.body.honeypot, 50);
  if (honeypot) return res.status(400).json({ error: 'طلب غير صالح' });

  const name = clean(req.body.name, 80);
  const rawPhone = clean(req.body.phone, 30);
  const phone = normalizePhone(rawPhone);
  const addr = clean(req.body.addr, 200);
  const note = clean(req.body.note, 300);
  const reqItems = Array.isArray(req.body.items) ? req.body.items.slice(0, 50) : [];

  if (!name || !phone || !addr || !reqItems.length) {
    return res.status(400).json({ error: 'الاسم، رقم الهاتف، العنوان والمنتجات مطلوبة' });
  }

  if (!/^(0|\+?213)[567]\d{8}$/.test(rawPhone.replace(/\s+/g, ''))) {
    return res.status(400).json({ error: 'رقم الهاتف غير صحيح. مثال: 0555 12 34 56 أو +213555123456' });
  }

  const lines = [];
  for (const item of reqItems) {
    const product = db.products.find((entry) => String(entry.id) === String(item.id));
    const qty = Math.max(1, Math.floor(Number(item.qty || 0)));

    if (!product || !(qty >= 1 && qty <= 1000)) {
      return res.status(400).json({ error: 'منتج غير صالح أو كمية غير صحيحة' });
    }
    if (product.stock < qty) {
      return res.status(409).json({ error: `الكمية المتوفرة من "${product.name}" هي ${product.stock} فقط` });
    }
    lines.push({ product, qty });
  }

  const items = lines.map((line) => ({
    id: line.product.id,
    name: line.product.name,
    qty: line.qty,
    price: Number(line.product.price || 0)
  }));

  const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const order = {
    id: createId('order'),
    orderNumber: createOrderNumber(),
    name,
    phone,
    addr,
    note,
    items,
    total,
    status: 'pending',
    when: new Date().toISOString()
  };

  db.orders.unshift(order);
  saveDb();
  res.status(201).json({ ok: true, order });
});

app.post('/api/login', (req, res) => {
  const ip = getClientIp(req);
  const attempts = loginFailures.get(ip) || { count: 0, resetAt: Date.now() };

  if (Date.now() - attempts.resetAt > 10 * 60 * 1000) {
    attempts.count = 0;
    attempts.resetAt = Date.now();
  }

  if (attempts.count >= 5) {
    return res.status(429).json({ error: 'محاولات كثيرة، حاول لاحقًا' });
  }

  const suppliedPassword = Buffer.from(String(req.body.password || ''));
  const expectedPassword = Buffer.from(ADMIN_PASSWORD);
  const passwordMatches = suppliedPassword.length === expectedPassword.length && crypto.timingSafeEqual(suppliedPassword, expectedPassword);

  if (!passwordMatches) {
    attempts.count += 1;
    loginFailures.set(ip, attempts);
    return res.status(401).json({ error: 'كلمة السر غير صحيحة' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  tokens.set(token, { createdAt: Date.now(), expiresAt: Date.now() + ADMIN_SESSION_TTL_MS });
  loginFailures.delete(ip);
  res.json({ token, expiresAt: Date.now() + ADMIN_SESSION_TTL_MS });
});

app.post('/api/admin/logout', auth, (req, res) => {
  const token = String(req.get('x-token') || '');
  tokens.delete(token);
  res.json({ ok: true });
});

app.get('/api/admin/orders', auth, (_, res) => {
  drainExpiredPendingOrders();
  res.json(db.orders);
});

app.patch('/api/admin/orders/:id', auth, (req, res) => {
  const orderIdParam = String(req.params.id);
  const target = db.orders.find((order) => String(order.id) === orderIdParam || String(order.orderNumber) === orderIdParam);
  const nextStatus = String(req.body.status || '').trim();

  if (!target || !['pending', 'confirmed', 'delivered', 'cancelled'].includes(nextStatus)) {
    return res.status(400).json({ error: 'حالة الطلب غير صالحة' });
  }

  if (nextStatus === 'cancelled' && target.status !== 'cancelled') {
    target.items.forEach((item) => addStockToProduct(item.id, Number(item.qty || 0)));
  }

  if (nextStatus === 'confirmed' && target.status !== 'confirmed') {
    for (const item of target.items) {
      const product = db.products.find((entry) => String(entry.id) === String(item.id));
      if (!product) continue;
      const existingQty = Number(product.stock || 0);
      if (existingQty < Number(item.qty || 0)) {
        return res.status(409).json({ error: `المخزون غير كافٍ لـ "${product.name}"` });
      }
      product.stock = existingQty - Number(item.qty || 0);
    }
  }

  if (target.status === 'cancelled' && nextStatus !== 'cancelled' && nextStatus !== 'pending') {
    for (const item of target.items) {
      const product = db.products.find((entry) => String(entry.id) === String(item.id));
      if (!product) continue;
      if (Number(product.stock || 0) < Number(item.qty || 0)) {
        return res.status(409).json({ error: 'المخزون غير كافٍ لإعادة تفعيل الطلبية' });
      }
      product.stock = Number(product.stock || 0) - Number(item.qty || 0);
    }
  }

  target.status = nextStatus;
  target.updatedAt = new Date().toISOString();
  saveDb();
  res.json(target);
});

app.get('/api/admin/products', auth, (_, res) => res.json(db.products));

app.post('/api/admin/products', auth, (req, res) => {
  const name = clean(req.body.name, 100);
  const cat = clean(req.body.cat, 40) || 'إكسسوارات';
  const desc = clean(req.body.desc, 200);
  const price = Math.max(0, toNumber(req.body.price, 0));
  const stock = Math.max(0, Math.floor(toNumber(req.body.stock, 0)));

  if (!name) return res.status(400).json({ error: 'اسم المنتج مطلوب' });
  if (!Number.isFinite(price) || !Number.isFinite(stock)) return res.status(400).json({ error: 'السعر أو المخزون غير صحيح' });

  const product = {
    id: createId('product'),
    name,
    cat,
    desc,
    price,
    stock,
    oem: clean(req.body.oem, 80),
    brand: clean(req.body.brand, 60),
    model: clean(req.body.model, 60),
    image: clean(req.body.image, 300),
    category: clean(req.body.category, 40) || cat
  };

  db.products.push(product);
  saveDb();
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', auth, (req, res) => {
  const product = db.products.find((entry) => String(entry.id) === String(req.params.id));
  if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

  if (req.body.name !== undefined) product.name = clean(req.body.name, 100);
  if (req.body.cat !== undefined) product.cat = clean(req.body.cat, 40) || 'إكسسوارات';
  if (req.body.desc !== undefined) product.desc = clean(req.body.desc, 200);
  if (req.body.price !== undefined) product.price = Math.max(0, toNumber(req.body.price, product.price));
  if (req.body.stock !== undefined) product.stock = Math.max(0, Math.floor(toNumber(req.body.stock, product.stock)));
  if (req.body.oem !== undefined) product.oem = clean(req.body.oem, 80);
  if (req.body.brand !== undefined) product.brand = clean(req.body.brand, 60);
  if (req.body.model !== undefined) product.model = clean(req.body.model, 60);
  if (req.body.image !== undefined) product.image = clean(req.body.image, 300);
  if (req.body.category !== undefined) product.category = clean(req.body.category, 40) || product.cat;

  saveDb();
  res.json(product);
});

app.delete('/api/admin/products/:id', auth, (req, res) => {
  const before = db.products.length;
  db.products = db.products.filter((entry) => String(entry.id) !== String(req.params.id));
  if (db.products.length === before) return res.status(404).json({ error: 'المنتج غير موجود' });
  saveDb();
  res.json({ ok: true });
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'المسار غير موجود' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    const passwordStatus = ADMIN_PASSWORD === 'changeme' ? ' ⚠️ ADMIN_PASSWORD still default' : ' ✅ Admin password configured';
    const whatsappStatus = WHATSAPP_NUMBER === '213500000000' ? ' ⚠️ WHATSAPP_NUMBER still default' : ' ✅ WhatsApp configured';
    console.log(`Server running on http://localhost:${PORT}${passwordStatus}${whatsappStatus}`);
  });
}

module.exports = { app, db, readDb, saveDb, createId, normalizePhone, getClientIp, AUTH_TTL_MS: ADMIN_SESSION_TTL_MS };
