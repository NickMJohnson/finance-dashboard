import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store/slices/goalSlice';
import { Plus, Trash2, PlusCircle, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['emergency_fund', 'vacation', 'purchase', 'debt_payoff', 'investment', 'other'];

export default function GoalsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.goals);
  const [showForm, setShowForm] = useState(false);
  const [addingFundsId, setAddingFundsId] = useState(null);
  const [fundsAmount, setFundsAmount] = useState('');
  const [form, setForm] = useState({ name: '', targetAmount: '', targetDate: '', category: 'other' });

  useEffect(() => { dispatch(fetchGoals()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createGoal({ ...form, targetAmount: Number(form.targetAmount) }));
    setShowForm(false);
    setForm({ name: '', targetAmount: '', targetDate: '', category: 'other' });
  };

  const handleAddFunds = async (goal) => {
    if (!fundsAmount || isNaN(fundsAmount)) return;
    await dispatch(updateGoal({
      id: goal._id,
      currentAmount: Math.min(goal.currentAmount + Number(fundsAmount), goal.targetAmount),
    }));
    setAddingFundsId(null);
    setFundsAmount('');
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
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-2 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: '#cbd5e1' }}>New Goal</h3>
            <button onClick={() => setShowForm(false)} className="cursor-pointer" style={{ color: '#475569' }}>
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block mb-1.5" style={labelStyle}>Goal Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-dark w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="e.g. Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Target Amount ($)</label>
                <input
                  type="number"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  className="input-dark w-full rounded-xl px-4 py-2.5 text-sm"
                  placeholder="0.00"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="input-dark w-full rounded-xl px-4 py-2.5 text-sm"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label className="block mb-1.5" style={labelStyle}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={selectStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: '#0f172a' }}>
                      {c.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer">
                Create Goal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goal cards */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((g) => {
          const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
          const isAddingFunds = addingFundsId === g._id;

          return (
            <div key={g._id} className="glass rounded-2xl p-6">
              {/* Top row */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{g.name}</h3>
                  <p className="text-xs capitalize mt-0.5" style={{ color: '#475569' }}>
                    {g.category.replace('_', ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {g.isCompleted && (
                    <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                  )}
                  <button
                    onClick={() => dispatch(deleteGoal(g._id))}
                    className="cursor-pointer transition-colors"
                    style={{ color: '#334155' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Amounts */}
              <div className="flex justify-between items-baseline mb-2 mt-4">
                <span className="text-lg font-bold font-mono" style={{ color: '#10b981' }}>
                  ${g.currentAmount.toFixed(0)}
                </span>
                <span className="text-xs font-mono" style={{ color: '#334155' }}>
                  / ${g.targetAmount.toFixed(0)}
                </span>
              </div>

              {/* Progress */}
              <div className="progress-track h-1.5 mb-3">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: g.isCompleted
                      ? 'linear-gradient(90deg,#10b981,#34d399)'
                      : 'linear-gradient(90deg,#6366f1,#818cf8)',
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: '#475569' }}>{pct.toFixed(0)}% complete</span>

                {!g.isCompleted && (
                  isAddingFunds ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={fundsAmount}
                        onChange={(e) => setFundsAmount(e.target.value)}
                        className="input-dark rounded-lg px-2.5 py-1.5 text-xs font-mono w-24"
                        placeholder="Amount"
                        autoFocus
                        min="1"
                      />
                      <button
                        onClick={() => handleAddFunds(g)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingFundsId(null); setFundsAmount(''); }}
                        className="cursor-pointer"
                        style={{ color: '#475569' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingFundsId(g._id)}
                      className="flex items-center gap-1 text-xs font-medium cursor-pointer"
                      style={{ color: '#818cf8' }}
                    >
                      <PlusCircle size={13} /> Add funds
                    </button>
                  )
                )}
              </div>

              {g.targetDate && (
                <p className="text-xs mt-2 font-mono" style={{ color: '#334155' }}>
                  Target: {new Date(g.targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="col-span-2 text-center py-16 text-sm" style={{ color: '#334155' }}>
            No goals yet. Create one to start saving.
          </p>
        )}
      </div>
    </div>
  );
}
