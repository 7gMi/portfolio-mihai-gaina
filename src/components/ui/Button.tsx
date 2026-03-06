import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline';

type BaseProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = AsButton | AsLink;

const styles: Record<Variant, string> = {
  primary:
    'bg-primary text-text-inverted hover:brightness-110 focus-visible:ring-primary/50',
  outline:
    'border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 ${styles[variant]} ${className}`;

  if ('href' in props && props.href) {
    return (
      <a className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
