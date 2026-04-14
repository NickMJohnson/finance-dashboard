const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plaidTransactionId: { type: String, unique: true, sparse: true },
  accountId: String,
  amount: { type: Number, required: true },  // Positive = expense, negative = income
  date: { type: Date, required: true },
  name: { type: String, required: true },
  merchantName: String,
  category: { type: String, default: 'Uncategorized' },
  plaidCategory: [String],                   // Raw Plaid category array
  isManual: { type: Boolean, default: false },
  notes: String,
  pending: { type: Boolean, default: false },
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
