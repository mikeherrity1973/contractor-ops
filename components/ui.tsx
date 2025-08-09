'use client';
import React from 'react';
import Link, { type LinkProps } from 'next/link';
import clsx from 'clsx';

/** Button
 * - Supports href (renders <Link>) or onClick (renders <button>)
 * - If href includes a hash (#), render a plain <a> (hash links aren't typed routes)
 * - Variants: primary (brand), outline, ghost, success, danger, warning
 * - Sizes: sm, md, lg
 */
export const Button = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
}: React.PropsWithChildren<{
  href?: LinkProps['href'] | string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}>) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition px-4 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-3',
  };
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    outline: 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
  };
  const cls = clsx(base, sizes[size], variants[variant], className, {
    'pointer-events-none opacity-50': disabled && !!href,
  });

  // If href has a hash (#), use a plain anchor (typedRoutes doesn't like hashes)
  if (typeof href === 'string' && href.includes('#')) {
    return (
      <a href={href} className={cls} aria-disabled={disabled}>
        {children}
      </a>
    );
  }

  // If href provided (typed route or UrlObject), render <Link>
  if (href) {
    return (
      <Link href={href as LinkProps['href']} className={cls} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  // Otherwise render a normal button
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
};

/** Card */
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
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

/** Input */
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
      'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200',
      className
    )}
  />
);

/** Select */
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
      'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200',
      className
    )}
  >
    {children}
  </select>
);

/** Badge */
export const Badge = ({
  children,
  tone = 'gray',
}: React.PropsWithChildren<{
  tone?: 'gray' | 'brand' | 'blue' | 'green' | 'amber' | 'red' | 'violet';
}>) => {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    brand: 'bg-brand-100 text-brand-700',
    blue: 'bg-brand-100 text-brand-700', // alias for old code
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
