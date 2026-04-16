import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, upsertBudget, deleteBudget } from '../store/slices/budgetSlice';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Travel', 'Other'];

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.budgets);
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: CATEGORIES[0], limit: '', color: '#6366f1' });

  useEffect(() => {
    dispatch(fetchBudgets({ year, month }));
  }, [dispatch, year, month]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(upsertBudget({ ...form, limit: Number(form.limit), year, month }));
    setShowForm(false);
    setForm({ category: CATEGORIES[0], limit: '', color: '#6366f1' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Add Budget
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">New Budget</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Limit ($)</label>
              <input
                type="number"
                value={form.limit}
                onChange={(e) => setForm({ ...form, limit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {items.map((b) => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          const over = b.spent > b.limit;
          return (
            <div key={b._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{b.category}</span>
                </div>
                <button onClick={() => dispatch(deleteBudget(b._id))} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className={over ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                  ${b.spent?.toFixed(2) ?? '0.00'} spent
                </span>
                <span className="text-gray-500">${b.limit.toFixed(2)} limit</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : ''}`}
                  style={{ width: `${pct}%`, backgroundColor: over ? undefined : b.color }}
                />
              </div>
              {over && <p className="text-xs text-red-500 mt-1">Over budget by ${(b.spent - b.limit).toFixed(2)}</p>}
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="col-span-2 text-center text-gray-400 py-12">No budgets set. Add one to start tracking.</p>
        )}
      </div>
    </div>
  );
}
