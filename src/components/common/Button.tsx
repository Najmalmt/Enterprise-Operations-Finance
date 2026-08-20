import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#111827] text-white hover:bg-black border border-[#111827] shadow-sm active:scale-[0.99]';
      case 'secondary':
        return 'bg-white text-[#111827] hover:bg-[#f8f9fa] border border-[#e5e7eb] shadow-xs active:scale-[0.99]';
      case 'outline':
        return 'bg-transparent text-[#374151] hover:bg-[#f3f4f6] border border-[#d1d5db] active:scale-[0.99]';
      case 'danger':
        return 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-sm active:scale-[0.99]';
      case 'ghost':
        return 'bg-transparent text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827] border-transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-xs gap-1.5 rounded-md';
      case 'lg':
        return 'h-11 px-5 text-sm gap-2 rounded-lg font-medium';
      case 'md':
      default:
        return 'h-9 px-4 text-xs font-medium gap-2 rounded-md';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
