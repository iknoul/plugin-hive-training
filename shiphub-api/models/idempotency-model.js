import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  requestHash: {
    type: String,
    required: true,
  },

  resourceId: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h',
  },
});

export const IdempotencyRecord = mongoose.model(
  'IdempotencyRecord',
  idempotencySchema
);