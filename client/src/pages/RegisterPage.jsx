import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (!result.error) navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#05050a' }}
    >
      {/* Blobs */}
      <div className="blob" style={{ width: 500, height: 500, background: '#8b5cf6', top: '-15%', right: '-10%', position: 'fixed' }} />
      <div className="blob blob-3" style={{ width: 400, height: 400, background: '#10b981', bottom: '-10%', left: '-8%', position: 'fixed' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="font-bold text-2xl tracking-tight" style={{ fontFamily: 'Fira Code, monospace' }}>
            <span className="gradient-text">Finance</span>
            <span style={{ color: '#f1f5f9' }}>App</span>
          </Link>
        </div>

        <div className="glass-2 rounded-2xl p-8" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.4)' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9', letterSpacing: '-0.02em' }}>Create account</h1>
          <p className="text-sm mb-7" style={{ color: '#64748b' }}>Start tracking your finances today — it's free</p>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl mb-5"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                placeholder="Jane Smith"
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-dark w-full rounded-xl px-4 py-3 pr-11 text-sm"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: '#475569' }}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium cursor-pointer"
              style={{ color: '#818cf8' }}
              onClick={() => dispatch(clearError())}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
