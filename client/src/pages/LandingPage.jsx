import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Target, Zap, BarChart3, CreditCard } from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Bank Sync',
    desc: 'Connect all your accounts in seconds with Plaid. Transactions sync automatically.',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'Smart Budgets',
    desc: 'Set category budgets and get real-time alerts before you overspend.',
    color: '#10b981',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    desc: 'Define goals, track progress visually, and hit every milestone.',
    color: '#f59e0b',
  },
  {
    icon: TrendingUp,
    title: 'Analytics',
    desc: 'Understand your spending patterns with beautiful, actionable charts.',
    color: '#ec4899',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Level Security',
    desc: 'Your data is encrypted end-to-end. We never store your bank credentials.',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    desc: 'See every transaction the moment it happens. Stay ahead of your money.',
    color: '#8b5cf6',
  },
];

const stats = [
  { value: '10k+', label: 'Active users' },
  { value: '$2.4B', label: 'Tracked monthly' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#05050a', color: '#f1f5f9' }}>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Fira Code, monospace' }}>
            <span className="gradient-text">Finance</span>
            <span style={{ color: '#f1f5f9' }}>App</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        {/* Ambient blobs */}
        <div className="blob" style={{ width: 600, height: 600, background: '#6366f1', top: '-10%', left: '-10%' }} />
        <div className="blob blob-2" style={{ width: 500, height: 500, background: '#10b981', bottom: '-5%', right: '-8%' }} />
        <div className="blob blob-3" style={{ width: 400, height: 400, background: '#8b5cf6', top: '40%', left: '50%' }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now with Plaid bank sync
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
            Take control of<br />
            <span className="gradient-text">your finances</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
            The all-in-one dashboard to track spending, set budgets, and crush your savings goals.
            Sync your bank accounts in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary px-8 py-4 rounded-xl text-base font-semibold text-white cursor-pointer w-full sm:w-auto"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl text-base font-semibold cursor-pointer w-full sm:w-auto transition-colors glass"
              style={{ color: '#cbd5e1' }}
            >
              Sign in
            </Link>
          </div>

          {/* Hero mockup card */}
          <div className="mt-20 glass-2 rounded-3xl p-6 max-w-2xl mx-auto text-left" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <p className="text-xs font-medium mb-4" style={{ color: '#64748b' }}>MONTHLY OVERVIEW</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Income', val: '$5,240', color: '#10b981' },
                { label: 'Expenses', val: '$3,180', color: '#ef4444' },
                { label: 'Saved', val: '$2,060', color: '#6366f1' },
              ].map(({ label, val, color }) => (
                <div key={label} className="glass rounded-xl p-4">
                  <p className="text-xs mb-1" style={{ color: '#64748b' }}>{label}</p>
                  <p className="text-xl font-bold font-mono" style={{ color }}>{val}</p>
                </div>
              ))}
            </div>
            {/* Fake bar chart */}
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 68].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: i % 2 === 0
                      ? 'linear-gradient(to top, #6366f1, #818cf8)'
                      : 'rgba(255,255,255,0.06)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold font-mono gradient-text mb-1">{value}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Everything you need to<br />
              <span className="gradient-text">master your money</span>
            </h2>
            <p style={{ color: '#64748b' }}>Powerful tools built for people who take their finances seriously.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="glass rounded-2xl p-6 group cursor-default transition-all duration-300"
                style={{ '--feature-color': color }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = color + '40';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.background = '';
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: color + '20' }}
                >
                  <Icon size={20} color={color} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#f1f5f9' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass-2 rounded-3xl p-12 relative overflow-hidden">
          <div className="blob" style={{ width: 300, height: 300, background: '#6366f1', top: '-50%', left: '-10%', opacity: 0.18 }} />
          <div className="blob blob-2" style={{ width: 250, height: 250, background: '#10b981', bottom: '-50%', right: '-5%', opacity: 0.15 }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Ready to get started?
            </h2>
            <p className="mb-8" style={{ color: '#94a3b8' }}>
              Join thousands of people who already track their finances smarter.
            </p>
            <Link
              to="/register"
              className="btn-primary inline-block px-8 py-4 rounded-xl text-base font-semibold text-white cursor-pointer"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: 14 }}>
        © {new Date().getFullYear()} FinanceApp · Built with MERN Stack
      </footer>
    </div>
  );
}
