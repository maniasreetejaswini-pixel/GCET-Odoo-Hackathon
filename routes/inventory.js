const express = require('express'); 
const router = express.Router(); 
const Product = require('../models/Product'); 
const Operation = require('../models/Operation'); 
router.get('/dashboard', async (req, res) => { 
  const products = await Product.find(); 
  const operations = await Operation.find().populate('product'); 
  const totalProducts = products.length; 
  const lowStock = products.filter(p => p.quantity <= p.minStockAlert).length; 
  const pendingReceipts = operations.filter(o => o.type === 'Receipt' && o.status !== 'Done').length; 
  const pendingDeliveries = operations.filter(o => o.type === 'Delivery' && o.status !== 'Done').length; 
  res.render('dashboard', { totalProducts, lowStock, pendingReceipts, pendingDeliveries, operations }); 
}); 
router.get('/products', async (req, res) => { 
  const products = await Product.find(); 
  res.render('products', { products }); 
}); 
router.post('/products/add', async (req, res) => { 
  await Product.create(req.body); 
  res.redirect('/inventory/products'); 
}); 
router.post('/operations/process', async (req, res) => { 
  const { type, productId, quantity, sourceLocation, destinationLocation } = req.body; 
  const product = await Product.findById(productId); 
  const qty = Number(quantity); 
  if (type === 'Receipt') product.quantity += qty; 
  else if (type === 'Delivery') product.quantity -= qty; 
  else if (type === 'Adjustment') product.quantity = qty; 
  else if (type === 'Internal Transfer') product.location = destinationLocation; 
  await product.save(); 
  await Operation.create({ type, product: productId, quantity: qty, sourceLocation, destinationLocation, status: 'Done' }); 
  res.redirect('/inventory/dashboard'); 
}); 
module.exports = router; 
