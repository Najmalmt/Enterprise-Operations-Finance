import React from 'react';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-[#e5e7eb]/70 rounded ${className}`} />
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 pb-3 border-b border-[#f0f2f5]">
        {Array.from({ length: cols }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2.5 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <LoadingSkeleton key={c} className="h-4 flex-1 opacity-60" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const KPISkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] p-5 space-y-3">
          <div className="flex justify-between items-center">
            <LoadingSkeleton className="h-3.5 w-24" />
            <LoadingSkeleton className="h-8 w-8 rounded-lg" />
          </div>
          <LoadingSkeleton className="h-7 w-32" />
          <LoadingSkeleton className="h-3.5 w-20" />
        </div>
      ))}
    </div>
  );
};
