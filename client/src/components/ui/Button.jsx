const BASE = 'rounded-xl text-sm cursor-pointer transition-colors inline-flex items-center justify-center';

const SIZES = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3',
};

const VARIANT_CLASS = {
  primary: 'btn-primary font-semibold text-white',
  secondary: 'font-medium',
  ghost: 'font-medium',
};

const VARIANT_STYLE = {
  primary: {},
  secondary: {
    background: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  ghost: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid transparent',
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconSize = 16,
  children,
  className = '',
  style,
  disabled,
  type = 'button',
  ...rest
}) {
  const gap = Icon ? 'gap-2' : '';
  const composedClass = `${BASE} ${SIZES[size]} ${VARIANT_CLASS[variant]} ${gap} ${className}`.trim();
  const composedStyle = {
    ...VARIANT_STYLE[variant],
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : null),
    ...style,
  };

  return (
    <button type={type} disabled={disabled} className={composedClass} style={composedStyle} {...rest}>
      {Icon && <Icon size={iconSize} />}
      {children}
    </button>
  );
}
