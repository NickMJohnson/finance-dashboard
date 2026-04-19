const GRADIENTS = {
  primary: 'linear-gradient(90deg,#6366f1,#818cf8)',
  success: 'linear-gradient(90deg,#10b981,#34d399)',
  danger: 'linear-gradient(90deg,#ef4444,#f87171)',
};

const HEIGHTS = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'primary',
  gradient,
  height = 'sm',
  className = '',
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const fillBg = gradient ?? GRADIENTS[variant] ?? GRADIENTS.primary;
  const heightClass = HEIGHTS[height] ?? HEIGHTS.sm;

  return (
    <div className={`progress-track ${heightClass} ${className}`.trim()}>
      <div className="progress-fill" style={{ width: `${pct}%`, background: fillBg }} />
    </div>
  );
}
