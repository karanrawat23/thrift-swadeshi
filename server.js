const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// APIs
app.get('/api/products', (req, res) => res.json(db.getAllProducts()));
app.get('/api/products/:id', (req, res) => {
  const p = db.getProduct(Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'not_found' });
  res.json(p);
});
app.get('/api/products/:id/reviews', (req, res) =>
  res.json(db.getReviewsForProduct(Number(req.params.id)))
);
app.post('/api/products/:id/reviews', (req, res) => {
  const prodId = Number(req.params.id);
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) return res.status(400).json({ error: 'missing_fields' });
  const review = db.insertReview(prodId, name, Number(rating), comment);
  res.status(201).json(review);
});
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'invalid_payload' });
  const total = items.reduce((sum, it) => {
    const p = db.getProduct(Number(it.id));
    return p ? sum + p.price * (it.qty || 1) : sum;
  }, 0);
  res.json({ success: true, total, orderId: `ORD-${Date.now()}` });
});

// fallback for SPA
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));