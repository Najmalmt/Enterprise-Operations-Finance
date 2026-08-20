import React from 'react';

export type BadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'info'
  | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = true,
}) => {
  const getStyles = (): { bg: string; text: string; dotColor: string; border: string } => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-emerald-50/80',
          text: 'text-emerald-700',
          dotColor: 'bg-emerald-500',
          border: 'border-emerald-200/60',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/80',
          text: 'text-amber-800',
          dotColor: 'bg-amber-500',
          border: 'border-amber-200/60',
        };
      case 'danger':
        return {
          bg: 'bg-rose-50/80',
          text: 'text-rose-700',
          dotColor: 'bg-rose-500',
          border: 'border-rose-200/60',
        };
      case 'info':
        return {
          bg: 'bg-sky-50/80',
          text: 'text-sky-700',
          dotColor: 'bg-sky-500',
          border: 'border-sky-200/60',
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-zinc-100',
          text: 'text-zinc-700',
          dotColor: 'bg-zinc-500',
          border: 'border-zinc-200',
        };
    }
  };

  const styles = getStyles();
  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 font-medium' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} tracking-tight whitespace-nowrap select-none ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dotColor} shrink-0`} />
      )}
      <span>{children}</span>
    </span>
  );
};

export function getStatusBadgeVariant(status: string | undefined): BadgeVariant {
  if (!status) return 'neutral';
  const s = status.toLowerCase();
  if (['completed', 'approved', 'paid', 'active', 'present', 'on track'].includes(s)) {
    return 'success';
  }
  if (['pending', 'processing', 'sent', 'probation', 'planning', 'half day', 'at risk'].includes(s)) {
    return 'warning';
  }
  if (['rejected', 'terminated', 'failed', 'overdue', 'cancelled', 'absent', 'exceeded'].includes(s)) {
    return 'danger';
  }
  if (['on hold', 'on leave', 'draft'].includes(s)) {
    return 'neutral';
  }
  return 'neutral';
}
