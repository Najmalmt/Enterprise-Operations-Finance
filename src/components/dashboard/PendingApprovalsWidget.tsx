import React from 'react';
import { Check, X, ArrowRight, CheckSquare } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface PendingApprovalsWidgetProps {
  onViewAll: () => void;
}

export const PendingApprovalsWidget: React.FC<PendingApprovalsWidgetProps> = ({ onViewAll }) => {
  const { expenses, leaveRequests, approveExpense, rejectExpense, reviewLeaveRequest } = useData();

  const pendingExpenses = expenses.filter(e => e.status === 'Pending').slice(0, 3);
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').slice(0, 2);

  const hasItems = pendingExpenses.length > 0 || pendingLeaves.length > 0;

  return (
    <Card
      headerTitle="Pending Executive Approvals"
      headerSubtitle="Claims and requests requiring manager clearance"
      headerAction={
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all queue <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      }
    >
      {!hasItems ? (
        <div className="py-8 text-center text-xs text-[#6b7280]">
          <CheckSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          All approvals cleared. No pending items in queue.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Expense items */}
          {pendingExpenses.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] hover:bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="warning" size="sm">Expense Claim</Badge>
                  <span className="text-xs font-semibold text-[#111827] truncate">
                    {exp.title}
                  </span>
                </div>
                <div className="text-[11px] text-[#6b7280] mt-1 flex items-center gap-2 flex-wrap">
                  <span>By: <strong className="text-[#374151]">{exp.submitterName}</strong> ({exp.submitterDepartment})</span>
                  <span>•</span>
                  <span>{formatDate(exp.date)}</span>
                  {exp.projectName && (
                    <>
                      <span>•</span>
                      <span className="text-zinc-600 font-medium">[{exp.projectName}]</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f2f5]">
                <span className="font-mono text-sm font-bold text-[#111827]">
                  {formatCurrency(exp.amount)}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => approveExpense(exp.id)}
                    className="p-1.5 rounded-md bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Approve claim"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => rejectExpense(exp.id, 'Manager review rejection')}
                    className="p-1.5 rounded-md bg-white border border-[#e5e7eb] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Reject claim"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Leave items */}
          {pendingLeaves.map((leave) => (
            <div
              key={leave.id}
              className="p-3.5 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] hover:bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="info" size="sm">{leave.leaveType}</Badge>
                  <span className="text-xs font-semibold text-[#111827]">
                    {leave.employeeName} — {leave.daysCount} days
                  </span>
                </div>
                <div className="text-[11px] text-[#6b7280] mt-1">
                  <span>{formatDate(leave.startDate)} to {formatDate(leave.endDate)}</span>
                  <span className="mx-1.5">•</span>
                  <span className="italic">{leave.reason}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f2f5]">
                <button
                  onClick={() => reviewLeaveRequest(leave.id, 'Approved')}
                  className="p-1.5 rounded-md bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Approve leave"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reviewLeaveRequest(leave.id, 'Rejected', 'Scheduling conflict')}
                  className="p-1.5 rounded-md bg-white border border-[#e5e7eb] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Reject leave"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
