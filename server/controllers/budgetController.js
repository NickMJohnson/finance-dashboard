const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res) => {
  try {
    const { year, month } = req.query;
    const budgets = await Budget.find({ user: req.user._id, year: Number(year), month: Number(month) });

    // Attach current spending for each budget category
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const spending = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end }, amount: { $gt: 0 } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = Object.fromEntries(spending.map((s) => [s._id, s.spent]));

    const result = budgets.map((b) => ({
      ...b.toObject(),
      spent: spendingMap[b.category] || 0,
    }));

    res.json({ budgets: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.upsertBudget = async (req, res) => {
  try {
    const { category, limit, month, year, color } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { limit, color },
      { upsert: true, new: true }
    );
    res.json({ budget });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
