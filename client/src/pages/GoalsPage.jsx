import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store/slices/goalSlice';
import { Plus, Trash2, PlusCircle } from 'lucide-react';

const CATEGORIES = ['emergency_fund', 'vacation', 'purchase', 'debt_payoff', 'investment', 'other'];

export default function GoalsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.goals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '', targetDate: '', category: 'other', color: '#10b981' });

  useEffect(() => { dispatch(fetchGoals()); }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createGoal({ ...form, targetAmount: Number(form.targetAmount) }));
    setShowForm(false);
    setForm({ name: '', targetAmount: '', targetDate: '', category: 'other', color: '#10b981' });
  };

  const handleAddFunds = async (goal, amount) => {
    await dispatch(updateGoal({ id: goal._id, currentAmount: Math.min(goal.currentAmount + Number(amount), goal.targetAmount) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">New Goal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount ($)</label>
              <input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
              <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {CATEGORIES.map((c) => <option key={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">Create Goal</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {items.map((g) => {
          const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
          return (
            <div key={g._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{g.name}</h3>
                <div className="flex items-center gap-2">
                  {g.isCompleted && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Completed</span>}
                  <button onClick={() => dispatch(deleteGoal(g._id))} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-500 capitalize mb-3">{g.category.replace('_', ' ')}</p>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">${g.currentAmount.toFixed(2)}</span>
                <span className="text-gray-400">${g.targetAmount.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%`, backgroundColor: g.color }} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{pct.toFixed(0)}% complete</span>
                {!g.isCompleted && (
                  <button
                    onClick={() => {
                      const amount = prompt('Add how much?');
                      if (amount && !isNaN(amount)) handleAddFunds(g, amount);
                    }}
                    className="ml-auto flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <PlusCircle size={14} /> Add funds
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="col-span-2 text-center text-gray-400 py-12">No goals yet. Create one to start saving.</p>
        )}
      </div>
    </div>
  );
}
