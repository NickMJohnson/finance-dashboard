const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },   // Monthly spending limit in cents
  month: { type: Number, required: true },   // 1-12
  year: { type: Number, required: true },
  color: { type: String, default: '#6366f1' },
}, { timestamps: true });

budgetSchema.index({ user: 1, year: 1, month: 1 });
budgetSchema.index({ user: 1, category: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
