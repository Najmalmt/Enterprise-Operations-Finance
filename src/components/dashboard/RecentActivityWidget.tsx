import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatDateTime } from '../../utils/formatters';

interface RecentActivityWidgetProps {
  onViewAll: () => void;
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ onViewAll }) => {
  const { auditLogs } = useData();
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <Card
      headerTitle="Enterprise Activity & Audit Stream"
      headerSubtitle="Real-time security and operations log"
      headerAction={
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View audit trail <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      }
    >
      <div className="space-y-3">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#111827] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-semibold text-[#111827]">
                  {log.userName} <span className="font-normal text-[#6b7280]">({log.userRole})</span>
                </span>
                <span className="text-[10px] text-[#9ca3af] font-mono">
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
              <p className="text-[#374151] mt-0.5 leading-relaxed">{log.details}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-1.5 py-0.2 rounded bg-[#f3f4f6] text-[10px] font-mono text-[#6b7280]">
                  {log.module}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-[10px] font-mono text-zinc-700">
                  {log.action}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
