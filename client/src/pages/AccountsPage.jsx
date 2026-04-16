import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import api from '../api/axios';
import { Building2, RefreshCw } from 'lucide-react';

export default function AccountsPage() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/plaid/accounts');
      setAccounts(data.accounts);
    } catch {
      // No accounts linked yet
    }
  };

  useEffect(() => {
    fetchAccounts();
    api.post('/plaid/link-token').then(({ data }) => setLinkToken(data.linkToken)).catch(() => {});
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      await api.post('/plaid/exchange-token', {
        publicToken,
        institutionName: metadata.institution.name,
        institutionId: metadata.institution.institution_id,
      });
      setMessage('Bank linked! Syncing transactions...');
      handleSync();
    },
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post('/plaid/sync');
      setMessage(data.message);
      fetchAccounts();
    } catch {
      setMessage('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connected Accounts</h2>
        <div className="flex gap-2">
          {accounts.length > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync transactions'}
            </button>
          )}
          <button
            onClick={() => open()}
            disabled={!ready}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            <Building2 size={16} /> Link Bank Account
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="space-y-3">
        {accounts.map((a) => (
          <div key={a.account_id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{a.name}</p>
              <p className="text-sm text-gray-500">{a.institutionName} · {a.subtype}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                ${a.balances.current?.toFixed(2) ?? '—'}
              </p>
              <p className="text-xs text-gray-400">{a.type}</p>
            </div>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Building2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No accounts linked yet</p>
            <p className="text-sm mt-1">Click "Link Bank Account" to connect your bank via Plaid</p>
          </div>
        )}
      </div>
    </div>
  );
}
