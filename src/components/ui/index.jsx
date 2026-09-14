import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers.js';
import { Loader2, ChevronLeft, ChevronRight, Inbox, AlertCircle } from 'lucide-react';

/* ---------------- Button ---------------- */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref
) {
  const variants = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  return (
    <button
      ref={ref}
      className={cn(variants[variant] || variants.primary, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

/* ---------------- Card ---------------- */
export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  );
}

/* ---------------- Form inputs ---------------- */
export const Input = forwardRef(function Input({ label, error, hint, id, className, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input ref={ref} id={inputId} className={cn('input', error && 'border-red-500')} aria-invalid={!!error} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options = [], placeholder, id, className, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <select ref={ref} id={inputId} className={cn('input', error && 'border-red-500')} aria-invalid={!!error} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value;
          const text = typeof o === 'string' ? o : o.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, id, className, rows = 4, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <textarea ref={ref} id={inputId} rows={rows} className={cn('input', error && 'border-red-500')} aria-invalid={!!error} {...props} />
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

/* ---------------- Status badge ---------------- */
const STATUS_COLORS = {
  Submitted: 'bg-gray-100 text-gray-700',
  'Under Review': 'bg-amber-50 text-amber-700',
  Assigned: 'bg-blue-50 text-blue-700',
  'Under Investigation': 'bg-purple-50 text-purple-700',
  'Action Taken': 'bg-indigo-50 text-indigo-700',
  Resolved: 'bg-green-50 text-green-700',
  Closed: 'bg-gray-200 text-gray-600',
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700',
  Active: 'bg-green-50 text-green-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  Completed: 'bg-gray-100 text-gray-600',
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-50 text-green-700',
  Urgent: 'bg-red-50 text-red-700',
  High: 'bg-orange-50 text-orange-700',
  Normal: 'bg-gray-100 text-gray-700',
  Low: 'bg-gray-50 text-gray-500',
  Registered: 'bg-blue-50 text-blue-700',
  Confirmed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STATUS_COLORS[status] || 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {status}
    </span>
  );
}

/* ---------------- Loading / Empty / Error ---------------- */
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return <Loader2 className={cn('animate-spin text-navy-700', sizes[size], className)} aria-label="Loading" />;
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded bg-gray-200', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">
      <Icon className="h-10 w-10 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Failed to load content. Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <p className="mt-3 text-sm text-red-700">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ---------------- Section header ---------------- */
export function SectionHeader({ eyebrow, title, description, align = 'center', className }) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', 'mb-10', className)}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent-600">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h2>
      {description && (
        <p className={cn('mt-3 text-base text-gray-600', align === 'center' && 'mx-auto max-w-2xl')}>{description}</p>
      )}
    </div>
  );
}

/* ---------------- Stats card ---------------- */
export function StatsCard({ label, value, icon: Icon, className, dark = false }) {
  return (
    <Card className={cn('p-6 text-center', dark && 'border-white/10 bg-white/5', className)}>
      {Icon && (
        <Icon
          className={cn('mx-auto mb-3 h-7 w-7', dark ? 'text-accent-400' : 'text-accent-600')}
          aria-hidden="true"
        />
      )}
      <div className={cn('text-3xl font-extrabold', dark ? 'text-white' : 'text-navy-900')}>{value}</div>
      <p className={cn('mt-1 text-sm font-medium', dark ? 'text-navy-200' : 'text-gray-600')}>{label}</p>
    </Card>
  );
}

/* ---------------- Pagination ---------------- */
export function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="px-3 text-sm text-gray-600">
        Page <span className="font-semibold text-navy-900">{page}</span> of {pages}
      </span>
      <Button variant="outline" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

/* ---------------- Search / Filter ---------------- */
export const SearchBar = forwardRef(function SearchBar({ value, onChange, placeholder = 'Search…', className }, ref) {
  return (
    <div className={cn('relative', className)}>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input pl-9"
        aria-label="Search"
      />
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    </div>
  );
});

export function FilterBar({ children, className }) {
  return <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>;
}

export default Button;
