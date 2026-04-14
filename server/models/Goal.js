const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: Date,
  category: {
    type: String,
    enum: ['emergency_fund', 'vacation', 'purchase', 'debt_payoff', 'investment', 'other'],
    default: 'other',
  },
  color: { type: String, default: '#10b981' },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

goalSchema.index({ user: 1 });

module.exports = mongoose.model('Goal', goalSchema);
