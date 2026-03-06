interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary ${className}`}
    >
      {children}
    </span>
  );
}
