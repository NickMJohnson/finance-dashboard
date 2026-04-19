import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyTotals, fetchSpendingByCategory } from '../store/slices/transactionSlice';
import { fetchGoals } from '../store/slices/goalSlice';
import { fetchBudgets } from '../store/slices/budgetSlice';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Skeleton from '../components/ui/Skeleton';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ChartSkeleton({ kind }) {
  if (kind === 'pie') {
    return (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="skeleton-shimmer"
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, transparent 48%, rgba(255,255,255,0.07) 49%, rgba(255,255,255,0.07) 72%, transparent 73%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
          }}
        />
      </div>
    );
  }
  const heights = [55, 85, 40, 95, 65, 75];
  return (
    <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 16, padding: '0 8px 28px' }}>
      {heights.map((h, i) => (
        <div key={i} className="flex-1 flex gap-1.5" style={{ height: '100%', alignItems: 'flex-end' }}>
          <Skeleton width="100%" height={`${h}%`} rounded={6} />
          <Skeleton width="100%" height={`${Math.max(20, h - 25)}%`} rounded={6} />
        </div>
      ))}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-2 rounded-xl p-3 text-xs" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="font-medium mb-1" style={{ color: '#cbd5e1' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: <span className="font-mono font-semibold">${p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { monthlyData, categoryData } = useSelector((s) => s.transactions);
  const { items: goals } = useSelector((s) => s.goals);
  const { items: budgets } = useSelector((s) => s.budgets);
  const user = useSelector((s) => s.auth.user);

  const now = new Date();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      dispatch(fetchMonthlyTotals({ months: 6 })),
      dispatch(fetchSpendingByCategory({ year: now.getFullYear(), month: now.getMonth() + 1 })),
      dispatch(fetchGoals()),
      dispatch(fetchBudgets({ year: now.getFullYear(), month: now.getMonth() + 1 })),
    ]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const chartData = monthlyData.map((d) => ({
    name: MONTH_NAMES[d._id.month - 1],
    Income: Number(d.income.toFixed(2)),
    Expenses: Number(d.expenses.toFixed(2)),
  }));

  const pieData = categoryData.slice(0, 6).map((d) => ({
    name: d._id,
    value: Number(d.total.toFixed(2)),
  }));

  const latestIncome = chartData.at(-1)?.Income ?? 0;
  const latestExpenses = chartData.at(-1)?.Expenses ?? 0;
  const netSavings = latestIncome - latestExpenses;

  const summaryCards = [
    {
      label: 'Total Income',
      value: latestIncome,
      icon: TrendingUp,
      color: '#10b981',
      glow: 'rgba(16,185,129,0.15)',
    },
    {
      label: 'Total Expenses',
      value: latestExpenses,
      icon: TrendingDown,
      color: '#ef4444',
      glow: 'rgba(239,68,68,0.15)',
    },
    {
      label: 'Net Savings',
      value: netSavings,
      icon: Wallet,
      color: '#6366f1',
      glow: 'rgba(99,102,241,0.15)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>
          Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'there'}</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: '#475569' }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={`sc-${i}`}>
                <Skeleton width={90} height={11} style={{ marginBottom: 12 }} />
                <Skeleton width={140} height={28} />
              </Card>
            ))
          : summaryCards.map(({ label, value, icon: Icon, color, glow }) => (
              <Card key={label} style={{ position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 80, height: 80, borderRadius: '50%',
                    background: glow, filter: 'blur(20px)',
                  }}
                />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: '#64748b' }}>{label}</p>
                    <p className="text-2xl font-bold font-mono" style={{ color }}>
                      ${value.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: glow }}
                  >
                    <Icon size={17} color={color} />
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#94a3b8' }}>Income vs Expenses</h3>
          {loading ? (
            <ChartSkeleton kind="bars" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={50} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center mt-16" style={{ color: '#475569' }}>No data yet</p>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#94a3b8' }}>Spending by Category</h3>
          {loading ? (
            <ChartSkeleton kind="pie" />
          ) : pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `$${v}`}
                  contentStyle={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                />
                <Legend
                  iconSize={8}
                  formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center mt-16" style={{ color: '#475569' }}>
              No transactions yet. Sync your bank account.
            </p>
          )}
        </Card>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-5" style={{ color: '#94a3b8' }}>Budget Progress</h3>
          <div className="space-y-5">
            {budgets.map((b) => {
              const pct = Math.min((b.spent / b.limit) * 100, 100);
              const over = b.spent > b.limit;
              return (
                <div key={b._id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{b.category}</span>
                    <span className="text-xs font-mono" style={{ color: over ? '#f87171' : '#64748b' }}>
                      ${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}
                    </span>
                  </div>
                  <ProgressBar value={pct} variant={over ? 'danger' : 'primary'} height="sm" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold mb-5" style={{ color: '#94a3b8' }}>Savings Goals</h3>
          <div className="grid grid-cols-2 gap-4">
            {goals.slice(0, 4).map((g) => {
              const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
              return (
                <Card key={g._id} rounded="rounded-xl" padding="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{g.name}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: '#818cf8' }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <ProgressBar value={pct} variant="success" height="xs" className="mb-2" />
                  <p className="text-xs font-mono" style={{ color: '#475569' }}>
                    ${g.currentAmount.toFixed(0)} / ${g.targetAmount.toFixed(0)}
                  </p>
                </Card>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
