const router = require('express').Router();
const { createLinkToken, exchangeToken, syncTransactions, getAccounts } = require('../controllers/plaidController');
const { protect } = require('../middleware/auth');

router.post('/link-token', protect, createLinkToken);
router.post('/exchange-token', protect, exchangeToken);
router.post('/sync', protect, syncTransactions);
router.get('/accounts', protect, getAccounts);

module.exports = router;
