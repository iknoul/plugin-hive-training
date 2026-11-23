import mongoose from "mongoose";

const ITEM_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const ORDER_STATUSES = ['Partially Shipped', 'Partially Delivered',...ITEM_STATUSES]
const PRIORITY = ['low', 'normal', 'high']
const ORDER_CHANNELS = ['web', 'app']


const pickupAddressSnapshot = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  pickUpAdressId: { type: String, required: true },
  seller_id: { type: String, required: true },
  label:  { type: String, required: true, trim: true, maxlength: 100 },
  city:   { type: String, required: true, trim: true, maxlength: 50 },
  address: { type: String, required: true },
  pincode:  { type: String, required: true }
})

const itemSchema = new mongoose.Schema({
  item_id:        { type: String, required: true, unique: true },
  name:  { type: String, required: true, trim: true, maxlength: 100 },
  type:   { type: String, required: true, trim: true, maxlength: 50 },
  sellerId:  { type: String, required: true },
  pickUpAdress: { type: pickupAddressSnapshot, required: true },
  status:    { type: String, required: true, enum: ITEM_STATUSES, default: 'Pending' }
})

const orderSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  customer:  { type: String, required: true, trim: true, maxlength: 100 },
  // product:   { type: String, required: false, trim: true, maxlength: 100 },
  status:    { type: String, required: true, enum: ORDER_STATUSES, default: 'Pending' },
  priority:  { type: String, enum: PRIORITY, default: 'normal' },
  createdAt: { type: Date,   required: true, default: Date.now },
  channel:   { type: String, enum: ORDER_CHANNELS, default: 'web' },
  items:     { 
              type: [itemSchema], 
              required: false,
              validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: 'An order must contain at least one item.'
              }
            }
}, { id: false, versionKey: false,
     timestamps: { createdAt: false, updatedAt: true },
     toJSON: { transform(_d, ret) { delete ret._id; return ret; } } });

orderSchema.index({
  priority: 1,
  createdAt: -1,
  id: 1,
});

export const Order = mongoose.model('Order', orderSchema); 
