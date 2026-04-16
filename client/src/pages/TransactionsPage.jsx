import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { Search } from 'lucide-react';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { items, total, pages, loading } = useSelector((s) => s.transactions);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ page, search: search || undefined }));
  }, [dispatch, page, search]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h2>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search transactions..."
          className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No transactions found. Sync your bank account to get started.</td></tr>
            ) : (
              items.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{t.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-full text-xs">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.amount < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {t.amount < 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
