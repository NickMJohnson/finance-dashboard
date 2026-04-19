import { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import api from '../api/axios';
import { Building2, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function AccountsPage() {
  const [linkToken, setLinkToken] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const toast = useToast();

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
      try {
        await api.post('/plaid/exchange-token', {
          publicToken,
          institutionName: metadata.institution.name,
          institutionId: metadata.institution.institution_id,
        });
        toast.success(`${metadata.institution.name} linked — syncing transactions…`);
        handleSync();
      } catch {
        toast.error('Failed to link bank. Please try again.');
      }
    },
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post('/plaid/sync');
      toast.success(data.message || 'Transactions synced successfully.');
      fetchAccounts();
    } catch {
      toast.error('Sync failed. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Connected Accounts
        </h1>
        <div className="flex gap-2">
          {accounts.length > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-60"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync transactions'}
            </button>
          )}
          <button
            onClick={() => open()}
            disabled={!ready}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
          >
            <Building2 size={16} /> Link Bank Account
          </button>
        </div>
      </div>

      {/* Account cards */}
      <div className="space-y-3">
        {accounts.map((a) => (
          <div
            key={a.account_id}
            className="glass rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{a.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                {a.institutionName} · {a.subtype}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg font-mono" style={{ color: '#10b981' }}>
                ${a.balances.current?.toFixed(2) ?? '—'}
              </p>
              <p className="text-xs capitalize mt-0.5" style={{ color: '#334155' }}>{a.type}</p>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="glass rounded-2xl text-center py-16" style={{ color: '#475569' }}>
            <Building2 size={48} className="mx-auto mb-4" style={{ color: '#334155' }} />
            <p className="text-lg font-medium" style={{ color: '#cbd5e1' }}>No accounts linked yet</p>
            <p className="text-sm mt-1" style={{ color: '#475569' }}>
              Click "Link Bank Account" to connect your bank via Plaid
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
