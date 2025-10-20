const Database = require('better-sqlite3');
const path = require('path');
const dbFile = path.join(__dirname, 'data.sqlite');
const db = new Database(dbFile);

// setup
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  img TEXT,
  rating REAL,
  description TEXT
);
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name TEXT,
  rating INTEGER,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

// seed if empty
const row = db.prepare('SELECT COUNT(*) AS cnt FROM products').get();
if (!row || row.cnt === 0) {
  const insert = db.prepare('INSERT INTO products (title, price, category, img, rating, description) VALUES (?, ?, ?, ?, ?, ?)');
  const sample = [
    ["Men's Tracksuit",49,"tops","https://picsum.photos/seed/tracksuit/800/600",4.2,"Cozy tracksuit — great for warmups."],
    ["Windbreaker Jacket",59,"tops","https://picsum.photos/seed/windbreaker/800/600",4.6,"Lightweight wind protection."],
    ["Running Shorts",22,"bottoms","https://picsum.photos/seed/shorts/800/600",4.0,"Breathable running shorts."],
    ["Performance Gym Tee",18,"tops","https://picsum.photos/seed/gymtee/800/600",4.4,"Sweat-wicking tee."],
    ["Training Sneakers",79,"footwear","https://picsum.photos/seed/sneakers/800/600",4.7,"Comfortable trainers."],
    ["Sports Cap",12,"accessories","https://picsum.photos/seed/cap/800/600",4.1,"Classic sports cap."]
  ];
  const tx = db.transaction(items => { for (const it of items) insert.run(...it); });
  tx(sample);
}

// helpers
module.exports = {
  getAllProducts() { return db.prepare('SELECT * FROM products ORDER BY id').all(); },
  getProduct(id) { return db.prepare('SELECT * FROM products WHERE id = ?').get(id); },
  getReviewsForProduct(productId) { return db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(productId); },
  insertReview(productId, name, rating, comment) {
    const stmt = db.prepare('INSERT INTO reviews (product_id, name, rating, comment) VALUES (?, ?, ?, ?)');
    const info = stmt.run(productId, name, rating, comment);
    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
  }
};cd "C:\Users\rawat\my project"
Get-ChildItem -Name
Test-Path .\server.js; Test-Path .\db.js