
import mongoose from 'mongoose';
import { connectDatabase } from '../config/mongodb.js';
import {Order} from '../models/mongoose-models/order-model.js';

const INDEX_NAME = 'priority_1_createdAt_-1_id_1';

async function explainQuery(label) {
  const result = await Order.find({ priority: 'high' })
    .sort({ createdAt: -1, id: 1 })
    .limit(20)
    .explain('executionStats');

  console.debug(`\n--- ${label} ---`);

  console.log({
    winningPlan: result.queryPlanner.winningPlan,
    executionStats: {
      nReturned: result.executionStats.nReturned,
      totalKeysExamined: result.executionStats.totalKeysExamined,
      totalDocsExamined: result.executionStats.totalDocsExamined,
      executionTimeMillis: result.executionStats.executionTimeMillis,
    },
  });
}

async function run() {
  try {
    // Disable automatic index creation for this experiment.
    mongoose.set('autoIndex', false);

    await connectDatabase();

    // Remove the target index so we can measure the unindexed query.
    try {
      await Order.collection.dropIndex(INDEX_NAME);
    } catch (error) {
      if (error.codeName !== 'IndexNotFound') {
        throw error;
      }
    }

    await explainQuery('BEFORE INDEX');

    await Order.collection.createIndex(
      { priority: 1, createdAt: -1, id: 1 },
      { name: INDEX_NAME }
    );

    await explainQuery('AFTER INDEX');
  } catch (error) {
    console.error('Query analysis failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await run();
