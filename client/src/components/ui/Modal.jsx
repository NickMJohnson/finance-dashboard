import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 180);
  };

  const handleConfirm = () => {
    if (!onConfirm) return handleClose();
    const result = onConfirm();
    if (result !== false) handleClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Enter' && onConfirm) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'TEXTAREA') handleConfirm();
      }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(5,5,10,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-2 rounded-2xl"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 24,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1), opacity 180ms ease',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-sm" style={{ color: '#cbd5e1', letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="cursor-pointer transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            <X size={18} />
          </button>
        </div>

        <div>{children}</div>

        {onConfirm && (
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
