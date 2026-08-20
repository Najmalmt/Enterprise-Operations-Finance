import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { LeaveRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Calendar, User, FileText, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PrepareLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
}

export const PrepareLeaveModal: React.FC<PrepareLeaveModalProps> = ({
  isOpen,
  onClose,
  leaveRequest,
}) => {
  const { prepareLeaveRequestForManager, leaveRequests } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'Prepared for HR Manager' | 'Incomplete Documentation'>('Prepared for HR Manager');
  const [notes, setNotes] = useState('PTO allowance and team coverage verified. Recommended for HR Manager final approval.');

  if (!leaveRequest) return null;

  // Calculate PTO metrics for employee
  const employeePastLeaves = leaveRequests.filter(
    l => l.employeeId === leaveRequest.employeeId && l.status === 'Approved'
  );
  const usedDays = employeePastLeaves.reduce((acc, l) => acc + l.daysCount, 0);
  const totalAllowance = 20; // 20 days annual allowance
  const remainingAllowance = Math.max(0, totalAllowance - usedDays);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await prepareLeaveRequestForManager(leaveRequest.id, notes, reviewStatus);
      onClose();
    } catch (err) {
      console.error('Error preparing leave request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prepare Leave Request for HR Manager"
      subtitle="HR Executive preliminary vetting, balance check & endorsement"
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            type="submit"
          >
            Submit to HR Manager
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Request Overview Card */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[#111827] text-sm">{leaveRequest.employeeName}</p>
              <p className="text-[11px] text-[#6b7280]">{leaveRequest.department} • {leaveRequest.leaveType}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono font-bold">
              {leaveRequest.daysCount} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-zinc-200">
            <div>
              <span className="text-[#6b7280] block">Requested Window:</span>
              <span className="font-medium text-[#111827]">
                {formatDate(leaveRequest.startDate)} – {formatDate(leaveRequest.endDate)}
              </span>
            </div>
            <div>
              <span className="text-[#6b7280] block">Reason:</span>
              <span className="font-medium text-[#111827] truncate block" title={leaveRequest.reason}>
                {leaveRequest.reason}
              </span>
            </div>
          </div>
        </div>

        {/* Leave Balance Verification Panel */}
        <div className="p-3 bg-white border border-[#e5e7eb] rounded-lg space-y-2">
          <h4 className="font-bold text-[#111827] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            PTO Balance & Accrual Check
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 bg-zinc-50 rounded">
              <span className="text-[#6b7280] block">Annual Quota</span>
              <span className="font-bold text-[#111827] font-mono text-sm">{totalAllowance}d</span>
            </div>
            <div className="p-2 bg-zinc-50 rounded">
              <span className="text-[#6b7280] block">Days Used</span>
              <span className="font-bold text-amber-700 font-mono text-sm">{usedDays}d</span>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-900 rounded">
              <span className="text-emerald-700 block">Available</span>
              <span className="font-bold text-emerald-800 font-mono text-sm">{remainingAllowance}d</span>
            </div>
          </div>
        </div>

        {/* HR Executive Determination */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Preparation Status <span className="text-rose-500">*</span>
          </label>
          <select
            value={reviewStatus}
            onChange={(e) => {
              const val = e.target.value as any;
              setReviewStatus(val);
              if (val === 'Prepared for HR Manager') {
                setNotes('PTO allowance and team coverage verified. Recommended for HR Manager final approval.');
              } else {
                setNotes('Documentation incomplete: pending medical slip or coverage signoff.');
              }
            }}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          >
            <option value="Prepared for HR Manager">Prepared for HR Manager (Fully Vetted)</option>
            <option value="Incomplete Documentation">Incomplete Documentation (Flagged for HR)</option>
          </select>
        </div>

        {/* Notes for HR Manager */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Vetting Notes for HR Manager <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
