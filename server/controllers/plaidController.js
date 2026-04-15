const { PlaidApi, PlaidEnvironments, Configuration, Products, CountryCode } = require('plaid');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
require('dotenv').config();

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

// Step 1: Create a Link token to initialise Plaid Link on the frontend
exports.createLinkToken = async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.user._id.toString() },
      client_name: 'Finance Dashboard',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });
    res.json({ linkToken: response.data.link_token });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create link token', error: err.message });
  }
};

// Step 2: Exchange public token for access token after user links bank
exports.exchangeToken = async (req, res) => {
  try {
    const { publicToken, institutionName, institutionId } = req.body;

    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const { access_token, item_id } = response.data;

    // Store access token securely — never send it to the client
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        plaidItems: {
          itemId: item_id,
          accessToken: access_token,
          institutionName,
          institutionId,
          lastSynced: new Date(),
        },
      },
    });

    res.json({ message: 'Bank account linked successfully', itemId: item_id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to exchange token', error: err.message });
  }
};

// Step 3: Sync transactions for all linked accounts
exports.syncTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let synced = 0;

    for (const item of user.plaidItems) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months

      const response = await plaidClient.transactionsGet({
        access_token: item.accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        options: { count: 500 },
      });

      const transactions = response.data.transactions;

      for (const t of transactions) {
        await Transaction.findOneAndUpdate(
          { plaidTransactionId: t.transaction_id },
          {
            user: user._id,
            plaidTransactionId: t.transaction_id,
            accountId: t.account_id,
            amount: t.amount,
            date: new Date(t.date),
            name: t.name,
            merchantName: t.merchant_name,
            category: t.personal_finance_category?.primary || t.category?.[0] || 'Uncategorized',
            plaidCategory: t.category || [],
            pending: t.pending,
          },
          { upsert: true, new: true }
        );
        synced++;
      }

      // Update last synced timestamp
      await User.updateOne(
        { _id: user._id, 'plaidItems.itemId': item.itemId },
        { $set: { 'plaidItems.$.lastSynced': new Date() } }
      );
    }

    res.json({ message: `Synced ${synced} transactions` });
  } catch (err) {
    res.status(500).json({ message: 'Sync failed', error: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accounts = [];

    for (const item of user.plaidItems) {
      const response = await plaidClient.accountsGet({ access_token: item.accessToken });
      accounts.push(
        ...response.data.accounts.map((a) => ({
          ...a,
          institutionName: item.institutionName,
        }))
      );
    }

    res.json({ accounts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get accounts', error: err.message });
  }
};
