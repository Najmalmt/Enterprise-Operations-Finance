import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-[#4b5563] shadow-xs mb-3.5">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      <p className="text-xs text-[#6b7280] max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
