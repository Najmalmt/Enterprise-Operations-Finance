import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Download,
  Calendar,
  CheckCircle,
  Play,
  ArrowUpRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { RunPayrollModal } from '../components/modals/RunPayrollModal';

export const PayrollPage: React.FC = () => {
  const { payrollRuns, employees, disbursePayroll } = useData();
  const { hasPermission } = useAuth();
  const [showRunModal, setShowRunModal] = useState(false);

  const canProcessPayroll = hasPermission('process_payroll');

  const totalGross = employees.reduce((sum, e) => sum + (e.salary / 12), 0);
  const totalTax = totalGross * 0.26;
  const totalNet = totalGross * 0.67;

  const exportPayrollCSV = () => {
    const headers = ['Employee ID,First Name,Last Name,Role,Department,Monthly Base,Tax Withholding,Net Pay\n'];
    const rows = employees.map(e => {
      const gross = e.salary / 12;
      const tax = gross * 0.26;
      const net = gross * 0.67;
      return `"${e.id}","${e.firstName}","${e.lastName}","${e.role}","${e.department}",${gross.toFixed(2)},${tax.toFixed(2)},${net.toFixed(2)}`;
    });
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-payroll-schedule-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Payroll Processing & ACH Disbursements
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Direct ACH Configured
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Automated compensation calculations, state & federal tax withholdings, and bulk salary settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={exportPayrollCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Payroll Matrix
          </Button>
          {canProcessPayroll && (
            <Button variant="primary" size="sm" onClick={() => setShowRunModal(true)}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Run Payroll Cycle
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Roster in Run</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{employees.length} Personnel</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">100% verified routing masks</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross Monthly Run</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalGross, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{formatCurrency(totalGross * 12, true)} annualized</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Est. Tax Withholdings</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalTax, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Federal & State FICA</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Net ACH Disbursed</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(totalNet, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Silicon Valley Bank Direct</p>
        </div>
      </div>

      {/* Historical Payroll Batches */}
      <Card
        headerTitle="Corporate Payroll Batch History"
        headerSubtitle="Processed salary settlement cycles and ledger vouchers"
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
              <tr>
                <th className="px-5 py-3">Disbursement Period</th>
                <th className="px-4 py-3">Headcount</th>
                <th className="px-4 py-3">Gross Total</th>
                <th className="px-4 py-3">Tax Withheld</th>
                <th className="px-4 py-3">Net Direct Deposit</th>
                <th className="px-4 py-3">Processed Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {payrollRuns.map((run) => (
                <tr key={run.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#111827]">{run.periodName}</p>
                    <p className="text-[10px] font-mono text-[#6b7280]">{run.month}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-[#111827]">
                    {run.employeeCount}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-[#111827]">
                    {formatCurrency(run.totalGross)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#6b7280]">
                    {formatCurrency(run.totalTax)}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">
                    {formatCurrency(run.totalNet)}
                  </td>
                  <td className="px-4 py-3.5 text-[#6b7280] font-mono">
                    {run.paymentDate ? formatDate(run.paymentDate) : '2026-08-31'}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={getStatusBadgeVariant(run.status)} size="sm">{run.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {run.status === 'Processing' ? (
                      canProcessPayroll ? (
                        <button
                          onClick={() => disbursePayroll(run.id)}
                          className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer"
                        >
                          Disburse Funds
                        </button>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          Processing
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-[#6b7280] flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monthly Employee Compensation Matrix preview */}
      <Card
        headerTitle="Active Personnel Monthly Direct Deposit Schedule"
        headerSubtitle="Base wage calculations and masked ACH account distribution"
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-4 py-3">Role & Department</th>
                <th className="px-4 py-3">Direct Deposit Account</th>
                <th className="px-4 py-3 text-right">Annual Base</th>
                <th className="px-4 py-3 text-right">Monthly Gross</th>
                <th className="px-5 py-3 text-right">Est. Net Take-home</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {employees.slice(0, 8).map((emp) => {
                const gross = emp.salary / 12;
                const net = gross * 0.67;
                return (
                  <tr key={emp.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#111827]">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#4b5563]">
                      {emp.role} • {emp.department}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#6b7280]">
                      {emp.bankAccount}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium">
                      {formatCurrency(emp.salary)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#111827]">
                      {formatCurrency(gross)}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <RunPayrollModal
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
      />
    </div>
  );
};
