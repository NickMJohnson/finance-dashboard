export default function Card({
  children,
  variant = 'glass',
  padding = 'p-6',
  rounded = 'rounded-2xl',
  className = '',
  style,
  ...rest
}) {
  return (
    <div className={`${variant} ${rounded} ${padding} ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  );
}
