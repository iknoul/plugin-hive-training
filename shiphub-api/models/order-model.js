import mongoose from "mongoose";

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const PRIORITY = ['low', 'normal', 'high']
const ORDER_CHANNELS = ['web', 'app']

const orderSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  customer:  { type: String, required: true, trim: true, maxlength: 100 },
  product:   { type: String, required: true, trim: true, maxlength: 100 },
  status:    { type: String, required: true, enum: ORDER_STATUSES, default: 'Pending' },
  priority:  { type: String, enum: PRIORITY, default: 'normal' },
  createdAt: { type: Date,   required: true, default: Date.now },
  channel:   { type: String, enum: ORDER_CHANNELS, default: 'web' },
}, { id: false, versionKey: false,
     timestamps: { createdAt: false, updatedAt: true },
     toJSON: { transform(_d, ret) { delete ret._id; return ret; } } });

orderSchema.index({
  priority: 1,
  createdAt: -1,
  id: 1,
});

export const Order = mongoose.model('Order', orderSchema); 
