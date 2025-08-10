'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

/* ----------------------------- Button / Link ----------------------------- */

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost' | 'success' | 'warning';

type ButtonBaseProps = {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  children: React.ReactNode;
};

type ButtonProps =
  | (ButtonBaseProps & {
      type?: 'button' | 'submit';
      onClick?: () => void;
      href?: undefined;
    })
  | (ButtonBaseProps & {
      /** keep types loose to avoid Next typed-routes generics issues on Vercel */
      href: any; // string | UrlObject but we don't import LinkProps to keep build simple
      onClick?: React.MouseEventHandler<HTMLAnchorElement>;
      type?: undefined;
    });

const btnSizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-3',
};

const btnVariants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  outline: 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
};

export function Button(props: ButtonProps) {
  const {
    size = 'md',
    variant = 'primary',
    className,
    disabled,
    children,
  } = props;

  const cls = clsx(
    'inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    btnSizes[size],
    btnVariants[variant],
    className
  );

  if ('href' in props && props.href) {
    // Link-style button
    const { href, onClick } = props;
    return (
      <Link href={href as any} onClick={onClick} className={cls} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  // Regular button
  const { type = 'button', onClick } = props as Exclude<ButtonProps, { href: any }>;
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

/** Convenience wrapper to mirror your imports in page.tsx */
export const LinkButton = ({
  href,
  children,
  ...rest
}: Omit<Extract<ButtonProps, { href: any }>, 'variant' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) => {
  return (
    <Button href={href} {...rest}>
      {children}
    </Button>
  );
};

/* ---------------------------------- Card --------------------------------- */

export const Card = ({
  title,
  subtitle,
  actions,
  children,
  className,
}: React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}>) => (
  <div className={clsx('rounded-3xl border border-gray-200 bg-white shadow-sm', className)}>
    {(title || actions || subtitle) && (
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
        <div>
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
        </div>
        <div className="text-sm text-gray-500 mt-0.5">{subtitle}</div>
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

/* --------------------------------- Input --------------------------------- */

export const Input = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    type={type}
    placeholder={placeholder}
    className={clsx(
      'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200',
      className
    )}
  />
);

/* --------------------------------- Select -------------------------------- */

export const Select = ({
  value,
  onChange,
  children,
  className,
}: React.PropsWithChildren<{
  value: string;
  onChange: (v: string) => void;
  className?: string;
}>) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={clsx(
      'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200',
      className
    )}
  >
    {children}
  </select>
);

/* --------------------------------- Badge --------------------------------- */

export const Badge = ({
  children,
  tone = 'gray',
}: React.PropsWithChildren<{ tone?: 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet' }>) => {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-rose-100 text-rose-700',
    violet: 'bg-violet-100 text-violet-700',
  };
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  );
};
