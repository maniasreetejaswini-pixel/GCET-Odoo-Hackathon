const mongoose = require('mongoose'); 
const ProductSchema = new mongoose.Schema({ 
  name: { type: String, required: true }, 
  sku: { type: String, required: true, unique: true }, 
  category: { type: String, required: true }, 
  uom: { type: String, default: 'Units' }, 
  quantity: { type: Number, default: 0 }, 
  location: { type: String, default: 'Main Store' }, 
  minStockAlert: { type: Number, default: 10 } 
}); 
module.exports = mongoose.model('Product', ProductSchema); 
