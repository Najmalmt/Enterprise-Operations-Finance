import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  headerTitle?: React.ReactNode;
  headerSubtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  headerTitle,
  headerSubtitle,
  headerAction,
  noPadding = false,
}) => {
  const hasHeader = Boolean(headerTitle || headerAction);

  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03),0_1px_2px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 ${className}`}
    >
      {hasHeader && (
        <div className="px-5 py-4 border-b border-[#f0f2f5] flex items-center justify-between gap-4">
          <div>
            {typeof headerTitle === 'string' ? (
              <h3 className="text-sm font-semibold text-[#111827] tracking-tight">{headerTitle}</h3>
            ) : (
              headerTitle
            )}
            {headerSubtitle && (
              <p className="text-xs text-[#6b7280] mt-0.5">{headerSubtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="shrink-0 flex items-center gap-2">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};
