const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

process.env.NODE_ENV = 'test';
process.env.ADMIN_PASSWORD = 'test-admin-secret';
process.env.WHATSAPP_NUMBER = '213500000000';
process.env.DATA_DIR = path.join(__dirname, '.tmp-test-data');

const { app, db } = require('../server.js');

async function withServer(callback) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;
  try {
    await callback(port);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
}

function resetData() {
  db.products = [
    { id: 'p-demo', name: 'Filtre test', cat: 'filtres', desc: 'Produit de test', price: 3000, stock: 2, oem: 'OEM', brand: 'BRAND', model: 'MODEL', image: '', category: 'filtres' }
  ];
  db.orders = [];
}

test('GET /api/health works', async () => {
  await withServer(async (port) => {
    const response = await fetch(`http://localhost:${port}/api/health`);
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.ok, true);
  });
});

test('POST /api/orders creates pending order when stock is available', async () => {
  resetData();
  await withServer(async (port) => {
    const response = await fetch(`http://localhost:${port}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ahmed',
        phone: '0555123456',
        addr: 'Alger',
        note: 'Urgent',
        items: [{ id: 'p-demo', qty: 1 }]
      })
    });

    const json = await response.json();
    assert.equal(response.status, 201);
    assert.equal(json.order.status, 'pending');
    assert.equal(db.orders.length, 1);
    assert.equal(db.products[0].stock, 2);
  });
});

test('POST /api/orders rejects an order when stock is insufficient', async () => {
  resetData();
  await withServer(async (port) => {
    const response = await fetch(`http://localhost:${port}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Said',
        phone: '0555123456',
        addr: 'Oran',
        note: '',
        items: [{ id: 'p-demo', qty: 5 }]
      })
    });

    const json = await response.json();
    assert.equal(response.status, 409);
    assert.ok(json.error && json.error.length > 0);
  });
});

test('Admin login works and protects admin endpoints', async () => {
  resetData();
  await withServer(async (port) => {
    const loginResponse = await fetch(`http://localhost:${port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-admin-secret' })
    });

    const loginJson = await loginResponse.json();
    assert.equal(loginResponse.status, 200);
    assert.ok(loginJson.token);

    const ordersResponse = await fetch(`http://localhost:${port}/api/admin/orders`, {
      headers: { 'x-token': loginJson.token }
    });

    assert.equal(ordersResponse.status, 200);
    const orders = await ordersResponse.json();
    assert.ok(Array.isArray(orders));

    const unauthorized = await fetch(`http://localhost:${port}/api/admin/orders`);
    assert.equal(unauthorized.status, 401);
  });
});

if (fs.existsSync(process.env.DATA_DIR)) {
  fs.rmSync(process.env.DATA_DIR, { recursive: true, force: true });
}
