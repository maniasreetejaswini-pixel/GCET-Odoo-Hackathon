const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Operation = require('../models/Operation');

router.get('/dashboard', async (req, res) => {
  try {
    const products = (await Product.find()) || [];
    const operations = (await Operation.find().populate('product')) || [];
    const totalProducts = products.length;
    const lowStock = products.filter(p => (p.quantity || 0) <= (p.minStockAlert || 5)).length;
    const pendingReceipts = operations.filter(o => o.type === 'Receipt' && o.status !== 'Done').length;
    const pendingDeliveries = operations.filter(o => o.type === 'Delivery' && o.status !== 'Done').length;
    const internalTransfers = operations.filter(o => o.type === 'Internal Transfer').length;
    res.render('dashboard', { totalProducts, lowStock, pendingReceipts, pendingDeliveries, internalTransfers, operations });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/products', async (req, res) => {
  const products = (await Product.find()) || [];
  res.render('products', { products });
});

router.post('/products/add', async (req, res) => {
  await Product.create(req.body);
  res.redirect('/inventory/products');
});

router.get('/operations', async (req, res) => {
  const products = (await Product.find()) || [];
  res.render('operations', { products });
});

router.post('/operations/process', async (req, res) => {
  const { type, productId, quantity, destinationLocation } = req.body;
  const product = await Product.findById(productId);
  const qty = Number(quantity) || 0;
  if (product) {
    if (type === 'Receipt') product.quantity += qty;
    else if (type === 'Delivery') product.quantity = Math.max(0, product.quantity - qty);
    else if (type === 'Adjustment') product.quantity = qty;
    else if (type === 'Internal Transfer' && destinationLocation) product.location = destinationLocation;
    await product.save();
  }
  await Operation.create({ type, product: productId, quantity: qty, destinationLocation, status: 'Done' });
  res.redirect('/inventory/dashboard');
});

router.get('/settings', (req, res) => res.render('settings'));
router.get('/profile', (req, res) => res.render('profile'));

module.exports = router;