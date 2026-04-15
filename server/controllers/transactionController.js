const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, startDate, endDate, search } = req.query;
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, date, name, category, notes } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      date,
      name,
      category,
      notes,
      isManual: true,
    });
    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
      isManual: true,  // Only allow deleting manual transactions
    });
    if (!transaction) return res.status(404).json({ message: 'Not found or not deletable' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getSpendingByCategory = async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const data = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end }, amount: { $gt: 0 } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMonthlyTotals = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const data = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          income: { $sum: { $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0] } },
          expenses: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
