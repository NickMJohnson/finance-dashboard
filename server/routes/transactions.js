const router = require('express').Router();
const {
  getTransactions, createTransaction, updateTransaction,
  deleteTransaction, getSpendingByCategory, getMonthlyTotals,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/analytics/by-category', getSpendingByCategory);
router.get('/analytics/monthly', getMonthlyTotals);

module.exports = router;
