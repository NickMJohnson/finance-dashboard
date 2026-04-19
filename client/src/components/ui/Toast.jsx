import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext } from '../../hooks/useToast';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    color: '#34d399',
    border: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.08)',
    glow: '0 0 24px rgba(16,185,129,0.25)',
  },
  error: {
    icon: AlertCircle,
    color: '#f87171',
    border: 'rgba(239,68,68,0.3)',
    bg: 'rgba(239,68,68,0.08)',
    glow: '0 0 24px rgba(239,68,68,0.25)',
  },
  warning: {
    icon: AlertTriangle,
    color: '#fbbf24',
    border: 'rgba(251,191,36,0.3)',
    bg: 'rgba(251,191,36,0.08)',
    glow: '0 0 24px rgba(251,191,36,0.22)',
  },
  info: {
    icon: Info,
    color: '#818cf8',
    border: 'rgba(99,102,241,0.3)',
    bg: 'rgba(99,102,241,0.08)',
    glow: '0 0 24px rgba(99,102,241,0.25)',
  },
};

export default function Toast({ id, variant = 'info', message, duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = v.icon;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(id), 200);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="glass-2 rounded-xl flex items-start gap-3"
      style={{
        padding: '12px 14px',
        minWidth: 280,
        maxWidth: 380,
        border: `1px solid ${v.border}`,
        background: v.bg,
        boxShadow: `0 18px 44px rgba(0,0,0,0.45), ${v.glow}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(16px) scale(0.96)',
        transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'auto',
      }}
    >
      <Icon size={18} style={{ color: v.color, flexShrink: 0, marginTop: 1 }} />
      <p className="text-sm flex-1" style={{ color: '#f1f5f9', lineHeight: 1.45 }}>
        {message}
      </p>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Dismiss"
        className="cursor-pointer transition-colors"
        style={{ color: '#475569', flexShrink: 0, marginTop: 1 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
      >
        <X size={15} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const api = {
    toasts,
    dismiss,
    show,
    success: (msg, opts) => show(msg, { ...opts, variant: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, variant: 'error' }),
    warning: (msg, opts) => show(msg, { ...opts, variant: 'warning' }),
    info: (msg, opts) => show(msg, { ...opts, variant: 'info' }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
