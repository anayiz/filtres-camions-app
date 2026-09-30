@"<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="description" content="متجر فلاتر هواء للشاحنات في الجزائر">
  <title>فلاتر الشاحنات</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #12171b;
      --panel: #1d252c;
      --panel-soft: #2a343d;
      --line: #3a4651;
      --ink: #f4efe8;
      --ink-dim: #a9b3bc;
      --accent: #f4a63d;
      --accent-ink: #1a1a1a;
      --ok: #48b57f;
      --warn: #e15f4a;
      --pending: #d5b348;
      --shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: 'Cairo', sans-serif;
    }

    h1, h2, h3, .brand, .tab, .btn, .badge, .price { font-family: 'Oswald', 'Cairo', sans-serif; }
    button, input, textarea, select { font: inherit; }

    .wrap {
      max-width: 980px;
      margin: 0 auto;
      padding: 0 16px 80px;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(18, 23, 27, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 2px solid var(--accent);
      padding: calc(12px + var(--safe-top)) 16px 12px;
    }

    .headrow {
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: clamp(20px, 3vw, 24px);
      font-weight: 700;
      letter-spacing: 0.4px;
    }

    .brand .dot {
      width: 10px;
      height: 10px;
      display: inline-block;
      background: var(--accent);
      transform: rotate(45deg);
      border-radius: 3px;
    }

    .tabs {
      display: flex;
      gap: 6px;
      padding: 4px;
      border-radius: 12px;
      background: var(--panel);
      border: 1px solid var(--line);
    }

    .tab {
      border: 0;
      background: transparent;
      color: var(--ink-dim);
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .tab.active {
      background: var(--accent);
      color: var(--accent-ink);
    }

    section { display: none; }
    section.active { display: block; }

    .hero {
      padding: 28px 0 10px;
    }

    .hero h1 {
      margin: 0 0 8px;
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.2;
      font-weight: 600;
    }

    .hero p {
      margin: 0;
      color: var(--ink-dim);
      font-size: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 18px;
    }

    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
      .tabs { flex-wrap: wrap; }
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--shadow);
    }

    .card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid var(--line);
      background: rgba(255,255,255,0.02);
    }

    .card .cat {
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
    }

    .card h3 {
      margin: 0;
      font-size: clamp(18px, 2vw, 24px);
      line-height: 1.3;
    }

    .card .desc {
      margin: 0;
      color: var(--ink-dim);
      font-size: 13px;
      line-height: 1.6;
      min-height: 42px;
    }

    .card .foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      border-top: 1px dashed var(--line);
      margin-top: auto;
      padding-top: 10px;
    }

    .price { font-size: 18px; font-weight: 700; }
    .stock { font-size: 12px; font-weight: 600; }
    .stock.ok { color: var(--ok); }
    .stock.low { color: var(--pending); }
    .stock.out { color: var(--warn); }

    .qtybox {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
      align-self: center;
      min-width: 128px;
    }

    .qtybox button {
      width: 40px;
      height: 36px;
      border: 0;
      background: var(--panel-soft);
      color: var(--ink);
      font-size: 24px;
      cursor: pointer;
    }

    .qtybox span {
      display: inline-flex;
      width: 40px;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }

    .addbtn, .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 10px;
      background: var(--accent);
      color: var(--accent-ink);
      cursor: pointer;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.15s ease;
    }

    .btn:hover, .addbtn:hover { transform: translateY(-1px); }
    .btn:disabled, .addbtn:disabled { opacity: .55; cursor: not-allowed; }

    .addbtn {
      width: 100%;
      padding: 10px 12px;
    }

    .btn {
      padding: 10px 18px;
      font-size: 14px;
    }

    .btn.ghost {
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink);
    }

    .btn.block { width: 100%; }

    .cartbar {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: 30;
      background: var(--panel);
      border-top: 2px solid var(--accent);
      display: none;
      padding: 12px 16px calc(12px + var(--safe-bottom));
      box-shadow: 0 -8px 20px rgba(0,0,0,.18);
    }

    .cartbar.show { display: block; }
    .cartbar .row {
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .cartbar .info {
      color: var(--ink-dim);
      font-size: 14px;
    }

    .cartbar .info b {
      color: var(--ink);
      font-size: 18px;
    }

    .modal-bg {
      position: fixed;
      inset: 0;
      z-index: 40;
      background: rgba(0,0,0,.65);
      display: none;
      align-items: flex-end;
      justify-content: center;
    }

    .modal-bg.show { display: flex; }

    .modal {
      width: min(100%, 520px);
      background: var(--panel);
      border-radius: 18px 18px 0 0;
      padding: 18px 18px calc(18px + var(--safe-bottom));
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow);
    }

    .modal h2 { margin: 0 0 14px; font-size: 22px; }

    .line-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--line);
      font-size: 14px;
      color: var(--ink-dim);
    }

    .line-item .rm {
      border: 0;
      background: transparent;
      color: var(--warn);
      cursor: pointer;
      font-size: 12px;
      padding: 4px 8px;
    }

    label {
      display: block;
      margin: 12px 0 6px;
      font-size: 13px;
      color: var(--ink-dim);
    }

    input, textarea, select {
      width: 100%;
      border: 1px solid var(--line);
      background: var(--panel-soft);
      color: var(--ink);
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 14px;
    }

    textarea { min-height: 72px; resize: vertical; }

    .pinbox {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 62vh;
      text-align: center;
      gap: 14px;
      padding: 20px;
    }

    .pinbox h2 { margin: 0; font-size: 28px; }
    .pinbox input { max-width: 220px; text-align: center; letter-spacing: 4px; }

    .admin-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin: 26px 0 12px;
    }

    .admin-head h2 { margin: 0; font-size: 22px; }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .toolbar input, .toolbar select {
      max-width: 220px;
    }

    .orders {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      box-shadow: var(--shadow);
    }

    .order .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    .order .cust { font-weight: 700; }
    .order .when {
      margin-top: 4px;
      color: var(--ink-dim);
      font-size: 12px;
    }

    .badge {
      border-radius: 999px;
      font-size: 11px;
      padding: 4px 9px;
      white-space: nowrap;
      font-weight: 600;
    }

    .badge.pending { background: rgba(213,179,72,.18); color: var(--pending); }
    .badge.confirmed { background: rgba(72,181,127,.16); color: var(--ok); }
    .badge.delivered { background: rgba(169,179,188,.16); color: var(--ink-dim); }
    .badge.cancelled { background: rgba(225,95,74,.18); color: var(--warn); }

    .order .items {
      margin-top: 10px;
      font-size: 13px;
      color: var(--ink-dim);
      line-height: 1.7;
    }

    .order .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .actions button {
      border: 1px solid var(--line);
      background: var(--panel-soft);
      color: var(--ink);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .actions button.wa {
      background: #1ea75a;
      border-color: #1ea75a;
      color: white;
    }

    .actions button.active-state {
      outline: 2px solid var(--accent);
    }

    .stocklist {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .stockrow {
      display: grid;
      grid-template-columns: 1.6fr .8fr .8fr auto;
      gap: 10px;
      align-items: end;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px;
    }

    .stockrow .nm {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.5;
    }

    .stockrow label {
      margin: 0;
      font-size: 11px;
      color: var(--ink-dim);
    }

    .stockrow input {
      margin-top: 4px;
      padding: 8px 10px;
      font-size: 13px;
    }

    .delete-product {
      border: 0;
      background: transparent;
      color: var(--warn);
      font-size: 22px;
      cursor: pointer;
    }

    .empty {
      text-align: center;
      color: var(--ink-dim);
      padding: 30px 10px;
      font-size: 14px;
    }

    .notice {
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--ink-dim);
      font-size: 13px;
      line-height: 1.7;
    }

    .toast {
      position: fixed;
      inset-inline: 50% auto auto;
      bottom: 76px;
      transform: translateX(50%);
      background: var(--panel);
      border: 1px solid var(--line);
      color: var(--ink);
      border-radius: 12px;
      padding: 12px 14px;
      min-width: min(90vw, 300px);
      box-shadow: var(--shadow);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      z-index: 80;
    }

    .toast.show { opacity: 1; }

    .success-sheet {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(0,0,0,.64);
      z-index: 60;
    }

    .success-sheet.show { display: flex; }

    .success-box {
      width: min(100%, 430px);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 20px;
      text-align: center;
      box-shadow: var(--shadow);
    }

    .success-box h3 {
      margin: 0 0 10px;
      font-size: 28px;
    }

    .success-box p {
      margin: 0 0 14px;
      color: var(--ink-dim);
      line-height: 1.7;
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 360px) {
      .stockrow { grid-template-columns: 1fr; }
      .btn { width: 100%; }
      .cartbar .row { flex-direction: column; align-items: stretch; }
    }
  </style>
</head>
<body>
<header>
  <div class="headrow">
    <div class="brand"><span class="dot"></span> فلاتر الشاحنات</div>
    <div class="tabs" aria-label="التنقل بين المتجر والإدارة">
      <button class="tab active" data-view="store">المتجر</button>
      <button class="tab" data-view="admin">الإدارة</button>
    </div>
  </div>
</header>

<div class="wrap">
  <section id="store" class="active">
    <div class="hero">
      <h1>فلاتر هواء أصلية لجميع أنواع الشاحنات</h1>
      <p>اختر القطع التي تحتاجها، ثم أرسل طلبك واستقبل تأكيدًا سريعًا عبر WhatsApp.</p>
    </div>
    <div class="grid" id="productGrid"></div>
  </section>

  <section id="admin">
    <div id="pinScreen" class="pinbox">
      <h2>دخول الإدارة</h2>
      <p style="margin:0;color:var(--ink-dim);font-size:14px;max-width:320px;">أدخل كلمة المرور لإدارة الطلبيات والمخزون</p>
      <label class="sr-only" for="pinInput">كلمة المرور</label>
      <input id="pinInput" type="password" placeholder="••••••••" aria-label="كلمة المرور">
      <button class="btn" id="pinGo">دخول</button>
      <p id="pinErr" style="display:none;margin:0;color:var(--warn);font-size:13px;">كلمة المرور غير صحيحة</p>
    </div>

    <div id="adminBody" style="display:none;">
      <div class="admin-head">
        <h2>الطلبيات</h2>
        <button id="logoutBtn" class="btn ghost">تسجيل الخروج</button>
      </div>
      <div class="toolbar">
        <select id="statusFilter" aria-label="تصفية حسب الحالة">
          <option value="all">كل الحالات</option>
          <option value="pending">بانتظار التأكيد</option>
          <option value="confirmed">مؤكدة</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغاة</option>
        </select>
        <input id="orderSearch" type="search" placeholder="بحث بالاسم أو الهاتف" aria-label="بحث الطلبيات">
        <button id="refreshOrdersBtn" class="btn ghost">تحديث</button>
        <button id="exportCsvBtn" class="btn ghost">تصدير CSV</button>
      </div>
      <div id="ordersList" class="orders"></div>

      <div class="admin-head">
        <h2>المخزون والأسعار</h2>
      </div>
      <div id="stockList" class="stocklist"></div>
      <button class="btn block" id="addProdBtn" style="margin-top:12px;">+ إضافة منتج جديد</button>
      <div id="adminNotice" class="notice"></div>
    </div>
  </section>
</div>

<div class="cartbar" id="cartBar">
  <div class="row">
    <div class="info"><b id="cartCount">0</b> قطعة — <span id="cartTotal">0</span> د.ج</div>
    <button class="btn" id="openCart">مراجعة الطلب</button>
  </div>
</div>

<div class="modal-bg" id="cartModalBg">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <h2 id="cartTitle">ملخص الطلبية</h2>
    <div id="cartLines"></div>
    <label for="custName">الاسم الكامل</label>
    <input id="custName" name="custName" placeholder="مثال: محمد بن علي">
    <label for="custPhone">رقم الهاتف</label>
    <input id="custPhone" name="custPhone" placeholder="0555 12 34 56" inputmode="tel">
    <label for="custAddr">الولاية / العنوان</label>
    <input id="custAddr" name="custAddr" placeholder="الجزائر العاصمة، ...">
    <label for="custNote">ملاحظات (اختياري)</label>
    <textarea id="custNote" name="custNote" placeholder="نوع الشاحنة، ملاحظات التوصيل..."></textarea>
    <input id="websiteField" type="hidden" value="" aria-hidden="true">
    <button class="btn block" id="confirmOrder" style="margin-top:16px;">تأكيد الطلبية</button>
    <button class="btn ghost block" id="closeCart" style="margin-top:8px;">رجوع للمتجر</button>
  </div>
</div>

<div id="successSheet" class="success-sheet" aria-live="polite">
  <div class="success-box">
    <h3>تم التسجيل بنجاح</h3>
    <p id="successText">تمت تسجيل طلبك بنجاح. سيتم التواصل معك لتأكيد التفاصيل.</p>
    <div class="success-actions">
      <a id="waLink" class="btn" href="#" target="_blank" rel="noopener noreferrer">إرسال على WhatsApp</a>
      <button id="successClose" class="btn ghost">إغلاق</button>
    </div>
  </div>
</div>

<div id="toast" class="toast" aria-live="polite"></div>

<script>
const esc = (value) => String(value ?? '').replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[char]));

const state = {
  products: [],
  orders: [],
  cart: JSON.parse(localStorage.getItem('ftc-cart') || '{}'),
  token: sessionStorage.getItem('ftc_token') || '',
  waNumber: ''
};

const statusMap = {
  pending: 'بانتظار التأكيد',
  confirmed: 'مؤكدة',
  delivered: 'تم التسليم',
  cancelled: 'ملغاة'
};

const actionMap = {
  pending: 'بانتظار',
  confirmed: 'تأكيد',
  delivered: 'تم التسليم',
  cancelled: 'إلغاء'
};

const toast = (msg, type = 'info') => {
  const node = document.getElementById('toast');
  node.textContent = msg;
  node.classList.add('show');
  node.style.borderColor = type === 'error' ? 'var(--warn)' : 'var(--line)';
  window.clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove('show'), 2600);
};

async function api(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers['x-token'] = state.token;

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (response.status === 401 && url.startsWith('/api/admin')) {
    logoutAdmin();
    throw new Error('غير مصرح بالدخول');
  }
  if (!response.ok) throw new Error(payload.error || 'حدث خطأ غير متوقع');
  return payload;
}

function saveCart() {
  localStorage.setItem('ftc-cart', JSON.stringify(state.cart));
}

function normalizePhoneValue(value) {
  return String(value || '').replace(/\D/g, '').replace(/^0/, '213').slice(0, 12);
}

function stockLabel(stock) {
  if (stock <= 0) return { text: 'نفدت الكمية', className: 'out' };
  if (stock <= 5) return { text: `كمية محدودة (${stock})`, className: 'low' };
  return { text: `متوفر (${stock})`, className: 'ok' };
}

function updateCartBar() {
  const ids = Object.keys(state.cart);
  const count = ids.reduce((sum, id) => sum + Number(state.cart[id] || 0), 0);
  const total = ids.reduce((sum, id) => {
    const product = state.products.find((item) => String(item.id) === String(id));
    return sum + (product ? Number(product.price || 0) * Number(state.cart[id] || 0) : 0);
  }, 0);

  document.getElementById('cartCount').textContent = String(count);
  document.getElementById('cartTotal').textContent = String(total);
  document.getElementById('cartBar').classList.toggle('show', count > 0);
  saveCart();
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = '';
  state.products.forEach((product) => {
    const label = stockLabel(product.stock);
    const qty = Number(state.cart[product.id] || 0);
    const card = document.createElement('div');
    card.className = 'card';

    const image = product.image ? `<img src="${esc(product.image)}" alt="${esc(product.name)}">` : '';
    card.innerHTML = `
      ${image}
      <div class="cat">${esc(product.cat || product.category || 'منتج')}</div>
      <h3>${esc(product.name)}</h3>
      <p class="desc">${esc(product.desc || 'منتج عالي الجودة')}</p>
      <div class="foot">
        <div class="price">${Number(product.price || 0)} د.ج</div>
        <div class="stock ${label.className}">${label.text}</div>
      </div>
      ${product.stock > 0 ? `
        <div class="qtybox">
          <button type="button" class="decrease" aria-label="تقليل الكمية">−</button>
          <span>${qty}</span>
          <button type="button" class="increase" aria-label="زيادة الكمية">+</button>
        </div>
      ` : '<button class="addbtn" type="button" disabled>غير متوفر</button>'}
    `;

    if (product.stock > 0) {
      const decrease = card.querySelector('.decrease');
      const increase = card.querySelector('.increase');

      decrease.onclick = () => {
        const current = Number(state.cart[product.id] || 0);
        if (current <= 1) delete state.cart[product.id];
        else state.cart[product.id] = current - 1;
        renderProducts();
        updateCartBar();
      };

      increase.onclick = () => {
        const current = Number(state.cart[product.id] || 0);
        if (current < Number(product.stock || 0)) {
          state.cart[product.id] = current + 1;
          renderProducts();
          updateCartBar();
        } else {
          toast('الكمية المطلوبة لا تتوفر الآن', 'error');
        }
      };
    }

    grid.appendChild(card);
  });
}

function openCartModal() {
  const box = document.getElementById('cartLines');
  const entries = Object.keys(state.cart);

  if (!entries.length) {
    box.innerHTML = '<div class="empty">السلة فارغة</div>';
    document.getElementById('cartModalBg').classList.add('show');
    return;
  }

  box.innerHTML = entries.map((id) => {
    const product = state.products.find((item) => String(item.id) === String(id));
    if (!product) return '';
    const qty = Number(state.cart[id] || 0);
    return `<div class="line-item"><span>${esc(product.name)} × ${qty}</span><span style="display:flex;align-items:center;gap:8px;">${Number(product.price || 0) * qty} د.ج <button class="rm" data-id="${id}">حذف</button></span></div>`;
  }).join('');

  box.querySelectorAll('.rm').forEach((button) => {
    button.onclick = () => {
      delete state.cart[button.dataset.id];
      updateCartBar();
      renderProducts();
      openCartModal();
    };
  });

  document.getElementById('cartModalBg').classList.add('show');
}

function closeCartModal() {
  document.getElementById('cartModalBg').classList.remove('show');
}

async function loadProductsAndCart() {
  try {
    state.products = await api('/api/products');
    Object.keys(state.cart).forEach((id) => {
      const product = state.products.find((item) => String(item.id) === String(id));
      if (!product) {
        delete state.cart[id];
        return;
      }
      if (Number(state.cart[id] || 0) > Number(product.stock || 0)) {
        state.cart[id] = Number(product.stock || 0);
      }
      if (Number(state.cart[id] || 0) <= 0) delete state.cart[id];
    });
    saveCart();
    renderProducts();
    updateCartBar();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function submitOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const addr = document.getElementById('custAddr').value.trim();
  const note = document.getElementById('custNote').value.trim();
  const honeypot = document.getElementById('websiteField').value.trim();

  if (honeypot) {
    toast('طلب غير صالح', 'error');
    return;
  }

  if (!name || !phone || !addr || !Object.keys(state.cart).length) {
    toast('أكمل الاسم والهاتف والعنوان والسلة أولاً', 'error');
    return;
  }

  if (!/^(0|\+?213)[567]\d{8}$/.test(phone.replace(/\s+/g, ''))) {
    toast('رقم الهاتف غير صحيح. مثال: 0555 12 34 56 أو +213555123456', 'error');
    return;
  }

  const orderPayload = {
    name,
    phone: normalizePhoneValue(phone),
    addr,
    note,
    honeypot: '',
    items: Object.keys(state.cart).map((id) => ({ id, qty: Number(state.cart[id] || 0) }))
  };

  const button = document.getElementById('confirmOrder');
  button.disabled = true;

  try {
    const { order } = await api('/api/orders', { method: 'POST', body: orderPayload });
    const waMessage = `طلبية جديدة #${order.orderNumber}\nالاسم: ${name}\nالهاتف: ${normalizePhoneValue(phone)}\nالعنوان: ${addr}\n\n${order.items.map((item) => `• ${item.name} × ${item.qty}`).join('\n')}\n\nالمجموع: ${order.total} د.ج\n${note ? `ملاحظة: ${note}` : ''}`;

    state.cart = {};
    saveCart();
    renderProducts();
    updateCartBar();
    closeCartModal();

    document.getElementById('custName').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('custAddr').value = '';
    document.getElementById('custNote').value = '';

    document.getElementById('successText').textContent = `تم تسجيل طلبك بنجاح. رقم الطلب: ${order.orderNumber}. سنقوم بالتواصل معك لتأكيد التفاصيل.`;
    document.getElementById('waLink').href = `https://wa.me/${state.waNumber}?text=${encodeURIComponent(waMessage)}`;
    document.getElementById('successSheet').classList.add('show');
    toast('تم تسجيل الطلبية بنجاح', 'success');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    button.disabled = false;
  }
}

function logoutAdmin() {
  state.token = '';
  sessionStorage.removeItem('ftc_token');
  document.getElementById('pinScreen').style.display = 'flex';
  document.getElementById('adminBody').style.display = 'none';
  document.getElementById('pinErr').style.display = 'none';
  document.getElementById('pinInput').value = '';
}

async function loginAdmin() {
  const password = document.getElementById('pinInput').value;
  if (!password) {
    toast('أدخل كلمة المرور', 'error');
    return;
  }

  try {
    const result = await api('/api/login', { method: 'POST', body: { password } });
    state.token = result.token;
    sessionStorage.setItem('ftc_token', result.token);
    document.getElementById('pinErr').style.display = 'none';
    document.getElementById('pinInput').value = '';
    await showAdminPanel();
  } catch (error) {
    document.getElementById('pinErr').textContent = error.message;
    document.getElementById('pinErr').style.display = 'block';
    toast(error.message, 'error');
  }
}

async function showAdminPanel() {
  document.getElementById('pinScreen').style.display = 'none';
  document.getElementById('adminBody').style.display = 'block';
  await loadOrders();
  await loadProductsAndCart();
  renderStockList();
  updateAdminNotice();
}

async function loadOrders() {
  try {
    state.orders = await api('/api/admin/orders');
    renderOrders();
  } catch (error) {
    toast(error.message, 'error');
  }
}

function getFilteredOrders() {
  const search = document.getElementById('orderSearch').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;

  return state.orders.filter((order) => {
    const matchesStatus = status === 'all' || order.status === status;
    const haystack = `${order.name} ${order.phone} ${order.orderNumber} ${order.addr}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    return matchesStatus && matchesSearch;
  });
}

function renderOrders() {
  const box = document.getElementById('ordersList');
  const filtered = getFilteredOrders();

  if (!filtered.length) {
    box.innerHTML = '<div class="empty">لا توجد طلبيات مطابقة</div>';
    return;
  }

  box.innerHTML = filtered.map((order) => `
    <div class="order">
      <div class="top">
        <div>
          <div class="cust">${esc(order.name)}</div>
          <div class="when">${esc(order.orderNumber)} — ${new Date(order.when).toLocaleString('ar-DZ')} — ${esc(order.phone)}</div>
        </div>
        <div class="badge ${order.status}">${statusMap[order.status] || order.status}</div>
      </div>
      <div class="items">
        ${order.items.map((item) => `${esc(item.name)} × ${item.qty}`).join(' • ')}<br>
        المجموع: ${order.total} د.ج<br>
        ${esc(order.addr)}${order.note ? ` — ${esc(order.note)}` : ''}
      </div>
      <div class="actions">
        ${['pending', 'confirmed', 'delivered', 'cancelled'].map((state) => `
          <button data-status="${state}" data-id="${order.id}" class="${order.status === state ? 'active-state' : ''}">${actionMap[state]}</button>
        `).join('')}
        <button class="wa" data-wa="${order.id}">واتساب</button>
      </div>
    </div>
  `).join('');

  box.querySelectorAll('[data-status]').forEach((button) => {
    button.onclick = async () => {
      const orderId = button.dataset.id;
      const nextStatus = button.dataset.status;
      try {
        await api(`/api/admin/orders/${orderId}`, { method: 'PATCH', body: { status: nextStatus } });
        toast('تم تحديث حالة الطلبية');
        await loadOrders();
        await loadProductsAndCart();
        renderStockList();
      } catch (error) {
        toast(error.message, 'error');
      }
    };
  });

  box.querySelectorAll('[data-wa]').forEach((button) => {
    button.onclick = () => {
      const order = state.orders.find((item) => String(item.id) === String(button.dataset.wa));
      if (!order) return;
      const message = `مرحبا ${order.name}، بخصوص طلبك رقم ${order.orderNumber}.\n${order.items.map((item) => `• ${item.name} × ${item.qty}`).join('\n')}\nالمجموع: ${order.total} د.ج`;
      window.open(`https://wa.me/${state.waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    };
  });
}

function renderStockList() {
  const list = document.getElementById('stockList');
  if (!list) return;

  list.innerHTML = state.products.map((product) => `
    <div class="stockrow">
      <div class="nm">${esc(product.name)}</div>
      <label>
        السعر
        <input type="number" min="0" value="${Number(product.price || 0)}" data-id="${product.id}" data-field="price">
      </label>
      <label>
        المخزون
        <input type="number" min="0" value="${Number(product.stock || 0)}" data-id="${product.id}" data-field="stock">
      </label>
      <button class="delete-product" data-delete="${product.id}" aria-label="حذف المنتج">×</button>
    </div>
  `).join('');

  list.querySelectorAll('input[data-field]').forEach((input) => {
    input.onchange = async () => {
      const value = Number(input.value || 0);
      if (!Number.isFinite(value) || value < 0) {
        toast('القيمة غير صحيحة', 'error');
        return;
      }
      try {
        await api(`/api/admin/products/${input.dataset.id}`, { method: 'PUT', body: { [input.dataset.field]: value } });
        toast('تم حفظ التعديلات');
        await loadProductsAndCart();
      } catch (error) {
        toast(error.message, 'error');
      }
    };
  });

  list.querySelectorAll('[data-delete]').forEach((button) => {
    button.onclick = async () => {
      try {
        await api(`/api/admin/products/${button.dataset.delete}`, { method: 'DELETE' });
        toast('تم حذف المنتج');
        await loadProductsAndCart();
        renderStockList();
      } catch (error) {
        toast(error.message, 'error');
      }
    };
  });
}

async function addProduct() {
  const modalMarkup = `
    <div id="productModalBg" style="position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);padding:20px;">
      <div class="modal" style="max-width:520px;border-radius:18px;">
        <h2>إضافة منتج</h2>
        <label>اسم المنتج</label>
        <input id="newProductName" placeholder="فلتر هواء — مان TGX">
        <label>الفئة</label>
        <input id="newProductCat" placeholder="فلاتر هواء">
        <label>الوصف</label>
        <textarea id="newProductDesc" placeholder="الوصف التفصيلي"></textarea>
        <label>المرجع OEM</label>
        <input id="newProductOem" placeholder="MAN TGX 2019">
        <label>الماركة</label>
        <input id="newProductBrand" placeholder="MAN">
        <label>موديل الشاحنة</label>
        <input id="newProductModel" placeholder="TGX">
        <label>السعر (د.ج)</label>
        <input id="newProductPrice" type="number" min="0" value="0">
        <label>الكمية المتوفرة</label>
        <input id="newProductStock" type="number" min="0" value="0">
        <label>رابط الصورة (اختياري)</label>
        <input id="newProductImage" type="url" placeholder="https://...">
        <button class="btn block" id="saveNewProduct" style="margin-top:16px;">حفظ المنتج</button>
        <button class="btn ghost block" id="cancelNewProduct" style="margin-top:8px;">إلغاء</button>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = modalMarkup;
  document.body.appendChild(wrapper.firstElementChild);

  document.getElementById('saveNewProduct').onclick = async () => {
    const payload = {
      name: document.getElementById('newProductName').value.trim(),
      cat: document.getElementById('newProductCat').value.trim(),
      desc: document.getElementById('newProductDesc').value.trim(),
      oem: document.getElementById('newProductOem').value.trim(),
      brand: document.getElementById('newProductBrand').value.trim(),
      model: document.getElementById('newProductModel').value.trim(),
      price: Number(document.getElementById('newProductPrice').value || 0),
      stock: Number(document.getElementById('newProductStock').value || 0),
      image: document.getElementById('newProductImage').value.trim()
    };

    if (!payload.name || payload.price < 0 || payload.stock < 0) {
      toast('الاسم والسعر والمخزون غير صحيحين', 'error');
      return;
    }

    try {
      await api('/api/admin/products', { method: 'POST', body: payload });
      toast('تمت إضافة المنتج');
      await loadProductsAndCart();
      renderStockList();
      document.getElementById('productModalBg').remove();
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  document.getElementById('cancelNewProduct').onclick = () => document.getElementById('productModalBg').remove();
}

function updateAdminNotice() {
  const notice = document.getElementById('adminNotice');
  const pendingCount = state.orders.filter((order) => order.status === 'pending').length;
  notice.textContent = `أوامر معلقة: ${pendingCount}. آخر تحديث: ${new Date().toLocaleTimeString('ar-DZ')}`;
}

async function initialize() {
  try {
    const config = await api('/api/config');
    state.waNumber = config.whatsapp;
  } catch (error) {
    state.waNumber = '213500000000';
  }

  if (state.token) await showAdminPanel();

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      document.querySelectorAll('.tab').forEach((node) => node.classList.toggle('active', node === tab));
      document.getElementById('store').classList.toggle('active', view === 'store');
      document.getElementById('admin').classList.toggle('active', view === 'admin');
      if (view === 'store') loadProductsAndCart();
    });
  });

  document.getElementById('pinGo').onclick = loginAdmin;
  document.getElementById('logoutBtn').onclick = logoutAdmin;
  document.getElementById('refreshOrdersBtn').onclick = async () => { await loadOrders(); updateAdminNotice(); };
  document.getElementById('openCart').onclick = openCartModal;
  document.getElementById('closeCart').onclick = closeCartModal;
  document.getElementById('confirmOrder').onclick = submitOrder;
  document.getElementById('addProdBtn').onclick = addProduct;
  document.getElementById('successClose').onclick = () => document.getElementById('successSheet').classList.remove('show');
  document.getElementById('cartModalBg').addEventListener('click', (event) => {
    if (event.target.id === 'cartModalBg') closeCartModal();
  });
  document.getElementById('statusFilter').addEventListener('change', renderOrders);
  document.getElementById('orderSearch').addEventListener('input', renderOrders);
  document.getElementById('pinInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') loginAdmin();
  });
  document.getElementById('exportCsvBtn').onclick = () => {
    const rows = [['رقم الطلب', 'العميل', 'الهاتف', 'الحالة', 'المجموع', 'تاريخ']];
    state.orders.forEach((order) => {
      rows.push([order.orderNumber, order.name, order.phone, statusMap[order.status] || order.status, order.total, new Date(order.when).toLocaleString('ar-DZ')]);
    });
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  await loadProductsAndCart();
  setInterval(async () => {
    if (document.getElementById('admin').classList.contains('active') && state.token) {
      await loadOrders();
      updateAdminNotice();
    } else {
      await loadProductsAndCart();
    }
  }, 30000);
}

initialize();
</script>
</body>
</html>
"@ | Set-Content -Path "public\index.html" -Encoding utf8;

@'
# Node.js / Express Storefront

## Overview
This storefront sells truck air filters and allows order capture through WhatsApp and an admin login panel.

## Installation
```bash
npm install
```

## Running locally
```bash
npm start
```

Then open http://localhost:3000

## Required environment
Create a `.env` file or export these variables before starting the app:

```bash
ADMIN_PASSWORD="StrongPasswordHere"
WHATSAPP_NUMBER=""
PORT=3000
DATA_DIR="./data"
ADMIN_SESSION_TTL_MS=43200000
ORDER_AUTO_CANCEL_MINUTES=720
NODE_ENV=production
```

## Deployment notes
- Use HTTPS in production.
- Keep `DATA_DIR` on persistent storage.
- Do not leave `ADMIN_PASSWORD` at its default value.
- Ensure `WHATSAPP_NUMBER` is the real shop number.

## Health check
```bash
curl http://localhost:3000/api/health
```
