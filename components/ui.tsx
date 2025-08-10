'use client';

import React from 'react';
import clsx from 'clsx';
import Link, { type LinkProps } from 'next/link';

// ---------- Buttons ----------
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost' | 'success' | 'warning';

const baseBtn =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';
const sizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-3',
};
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  outline: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  disabled,
}: React.PropsWithChildren<{
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}>) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(baseBtn, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  );
}

// Safer Link button (works with typedRoutes, but also accepts string)
type Href = LinkProps<unknown>['href'] | string;

export function LinkButton({
  href,
  children,
  size = 'md',
  variant = 'primary',
  className,
  prefetch = false,
}: React.PropsWithChildren<{
  href: Href;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  prefetch?: boolean;
}>) {
  return (
    <Link
      href={href as any}
      prefetch={prefetch}
      className={clsx(baseBtn, sizes[size], variants[variant], className)}
    >
      {children}
    </Link>
  );
}

// ---------- Card ----------
export function Card({
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
}>) {
  return (
    <div className={clsx('rounded-3xl border border-gray-200 bg-white shadow-sm', className)}>
      {(title || actions || subtitle) && (
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

// ---------- Inputs ----------
export function Input({
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
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
      className={clsx(
        'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200',
        className,
      )}
    />
  );
}

export function Select({
  value,
  onChange,
  children,
  className,
}: React.PropsWithChildren<{
  value: string;
  onChange: (v: string) => void;
  className?: string;
}>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200',
        className,
      )}
    >
      {children}
    </select>
  );
}

// ---------- Badge (now supports 'brand') ----------
type BadgeTone = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet' | 'brand';

const badgeTones: Record<BadgeTone, string> = {
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-rose-100 text-rose-700',
  violet: 'bg-violet-100 text-violet-700',
  // uses your Tailwind extended brand palette
  brand: 'bg-brand-100 text-brand-800',
};

export function Badge({
  children,
  tone = 'gray',
  className,
}: React.PropsWithChildren<{ tone?: BadgeTone; className?: string }>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
