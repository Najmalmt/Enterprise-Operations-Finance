import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

interface RunPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunPayrollModal: React.FC<RunPayrollModalProps> = ({ isOpen, onClose }) => {
  const { runPayroll, employees } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [month, setMonth] = useState('2026-09');
  const [periodName, setPeriodName] = useState('September 2026 (Regular Cycle)');

  const totalGross = employees.reduce((sum, e) => sum + (e.salary / 12), 0);
  const totalTax = totalGross * 0.26;
  const totalBenefits = totalGross * 0.07;
  const totalNet = totalGross - totalTax - totalBenefits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await runPayroll(month, periodName);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Monthly Payroll Cycle"
      subtitle="Calculate salary distributions, tax withholding, and ACH direct deposits"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Confirm & Queue Payroll ({formatCurrency(totalGross, true)})
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Payroll Period Month
            </label>
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Disbursement Cycle Title
            </label>
            <input
              type="text"
              required
              value={periodName}
              onChange={(e) => setPeriodName(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-4 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#111827]">Active Personnel in Run</span>
            <span className="font-mono font-bold text-xs bg-black text-white px-2 py-0.5 rounded">
              {employees.length} Employees
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#f0f2f5] font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#6b7280] font-sans">Total Gross Salary:</span>
              <span className="font-semibold text-[#111827]">{formatCurrency(totalGross)}</span>
            </div>
            <div className="flex justify-between text-[#6b7280]">
              <span className="font-sans">Employer/Employee Tax Withholding (26%):</span>
              <span>-{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-[#6b7280]">
              <span className="font-sans">Healthcare, 401k & Benefits (7%):</span>
              <span>-{formatCurrency(totalBenefits)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#e5e7eb] text-emerald-700 font-bold text-sm">
              <span className="font-sans">Total Net ACH Direct Distribution:</span>
              <span>{formatCurrency(totalNet)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#6b7280] leading-relaxed">
          * Once queued, the payroll batch will enter Processing state. Super Admins or Finance Managers can trigger final disbursement to post the transaction to the corporate ledger.
        </p>
      </form>
    </Modal>
  );
};
