export default function EmptyState({
  icon: Icon,
  iconSize = 48,
  title,
  description,
  action,
  variant = 'glass',
  className = '',
}) {
  const wrapperClass = variant === 'bare'
    ? `text-center py-16 ${className}`.trim()
    : `${variant} rounded-2xl text-center py-16 ${className}`.trim();

  return (
    <div className={wrapperClass} style={{ color: '#475569' }}>
      {Icon && <Icon size={iconSize} className="mx-auto mb-4" style={{ color: '#334155' }} />}
      {title && (
        <p className="text-lg font-medium" style={{ color: '#cbd5e1' }}>{title}</p>
      )}
      {description && (
        <p className="text-sm mt-1" style={{ color: '#475569' }}>{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
