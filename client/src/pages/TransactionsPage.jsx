import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { Search } from 'lucide-react';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { items, pages, loading } = useSelector((s) => s.transactions);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ page, search: search || undefined }));
  }, [dispatch, page, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
        Transactions
      </h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: '#475569' }} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search transactions…"
          className="input-dark w-full rounded-xl pl-9 pr-4 py-3 text-sm"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Date', 'Description', 'Category', 'Amount'].map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${i === 3 ? 'text-right' : 'text-left'}`}
                  style={{ color: '#475569' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: '#475569' }}>
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: '#475569' }}>
                  No transactions found. Sync your bank account to get started.
                </td>
              </tr>
            ) : (
              items.map((t, idx) => (
                <tr
                  key={t._id}
                  style={{
                    borderBottom: idx < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: '#475569' }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 font-medium" style={{ color: '#cbd5e1' }}>
                    {t.name}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(99,102,241,0.15)',
                        color: '#a5b4fc',
                        border: '1px solid rgba(99,102,241,0.25)',
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold" style={{ color: t.amount < 0 ? '#34d399' : '#f87171' }}>
                    {t.amount < 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: p === page ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.05)',
                color: p === page ? '#fff' : '#64748b',
                border: p === page ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
