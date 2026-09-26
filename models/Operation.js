const mongoose = require('mongoose'); 
const OperationSchema = new mongoose.Schema({ 
  type: { type: String, enum: ['Receipt', 'Delivery', 'Internal Transfer', 'Adjustment'], required: true }, 
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  quantity: { type: Number, required: true }, 
  sourceLocation: { type: String }, 
  destinationLocation: { type: String }, 
  status: { type: String, enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'], default: 'Draft' }, 
  createdAt: { type: Date, default: Date.now } 
}); 
module.exports = mongoose.model('Operation', OperationSchema); 
