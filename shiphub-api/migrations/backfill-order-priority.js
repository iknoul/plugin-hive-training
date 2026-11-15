
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Order } from '../models/order-model.js';

async function migrate() {
  try {
    await connectDatabase();

    // Raw MongoDB collection operation: bypasses Mongoose defaults.
    const result = await Order.collection.updateMany(
      { priority: { $exists: false } },
      { $set: { priority: 'normal' } }
    );

    console.log('Migration completed');
    console.log('Matched documents:', result.matchedCount);
    console.log('Modified documents:', result.modifiedCount);

    const normalCount = await Order.countDocuments({
      priority: 'normal',
    });

    console.log('Normal priority documents:', normalCount);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrate();