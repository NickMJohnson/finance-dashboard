import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets, upsertBudget, deleteBudget } from '../store/slices/budgetSlice';
import { Plus, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../hooks/useToast';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Travel', 'Other'];

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.budgets);
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: CATEGORIES[0], limit: '', color: '#6366f1' });
  const toast = useToast();
  const warnedRef = useRef(new Set());

  useEffect(() => {
    dispatch(fetchBudgets({ year, month }));
  }, [dispatch, year, month]);

  useEffect(() => {
    items.forEach((b) => {
      if (b.spent > b.limit && !warnedRef.current.has(b._id)) {
        warnedRef.current.add(b._id);
        toast.warning(
          `${b.category} budget exceeded by $${(b.spent - b.limit).toFixed(2)}`,
        );
      }
    });
  }, [items, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(upsertBudget({ ...form, limit: Number(form.limit), year, month }));
    setShowForm(false);
    setForm({ category: CATEGORIES[0], limit: '', color: '#6366f1' });
  };

  const labelStyle = { color: '#94a3b8', fontSize: 13, fontWeight: 500 };
  const selectStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f1f5f9',
    borderRadius: 12,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>Budgets</h1>
        <Button onClick={() => setShowForm(true)} icon={Plus}>Add Budget</Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card variant="glass-2" className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: '#cbd5e1' }}>New Budget</h3>
            <button onClick={() => setShowForm(false)} className="cursor-pointer" style={{ color: '#475569' }}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block mb-1.5" style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={selectStyle}
                >
                  {CATEGORIES.map((c) => <option key={c} style={{ background: '#0f172a' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Monthly Limit ($)</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  className="input-dark w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="0.00"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Color</label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full rounded-xl cursor-pointer"
                  style={{ height: 42, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 4 }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Budget cards */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((b) => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          const over = b.spent > b.limit;
          return (
            <Card key={b._id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{b.category}</span>
                </div>
                <button
                  onClick={() => dispatch(deleteBudget(b._id))}
                  className="cursor-pointer transition-colors"
                  style={{ color: '#475569' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex justify-between text-xs font-mono mb-2">
                <span style={{ color: over ? '#f87171' : '#94a3b8' }}>
                  ${b.spent?.toFixed(2) ?? '0.00'} spent
                </span>
                <span style={{ color: '#475569' }}>${b.limit.toFixed(2)} limit</span>
              </div>

              <ProgressBar
                value={pct}
                height="sm"
                gradient={over
                  ? 'linear-gradient(90deg,#ef4444,#f87171)'
                  : `linear-gradient(90deg, ${b.color}, ${b.color}cc)`}
              />

              {over && (
                <p className="text-xs mt-2 font-mono" style={{ color: '#f87171' }}>
                  Over by ${(b.spent - b.limit).toFixed(2)}
                </p>
              )}

              <p className="text-xs mt-2 font-mono" style={{ color: '#334155' }}>
                {pct.toFixed(0)}% used
              </p>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="col-span-2 text-center py-16 text-sm" style={{ color: '#334155' }}>
            No budgets set. Add one to start tracking.
          </p>
        )}
      </div>
    </div>
  );
}
