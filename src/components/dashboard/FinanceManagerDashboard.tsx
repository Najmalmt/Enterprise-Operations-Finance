import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Calendar,
  Receipt,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Play,
  PieChart,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';
import { RecordTransactionModal } from '../modals/RecordTransactionModal';
import { CreateInvoiceModal } from '../modals/CreateInvoiceModal';
import { EditInvoiceModal } from '../modals/EditInvoiceModal';
import { EditTransactionModal } from '../modals/EditTransactionModal';
import { RunPayrollModal } from '../modals/RunPayrollModal';
import { ManageExpenseCategoriesModal } from '../modals/ManageExpenseCategoriesModal';
import { RevenueExpenseChart } from './RevenueExpenseChart';
import { CashFlowChart } from './CashFlowChart';
import { ExpenseDonutChart } from './ExpenseDonutChart';
import { Transaction, Invoice, Expense } from '../../types';

interface FinanceManagerDashboardProps {
  onNavigate: (path: string) => void;
}

export const FinanceManagerDashboard: React.FC<FinanceManagerDashboardProps> = ({ onNavigate }) => {
  const {
    transactions,
    invoices,
    expenses,
    budgets,
    departments,
    financialSummary,
    payrolls,
    approveExpense,
    rejectExpense,
    reimburseExpense,
    markInvoicePaid,
    reconcileTransaction
  } = useData();

  const [showRecordTx, setShowRecordTx] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showRunPayroll, setShowRunPayroll] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Financial calculations
  const pendingExpenses = expenses.filter(e => e.status === 'Pending');
  const approvedExpenses = expenses.filter(e => e.status === 'Approved');
  const unpaidInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue');
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
  const totalUnpaidInvoiced = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingReconciliations = transactions.filter(t => t.status === 'Pending');
  const latestPayroll = payrolls[0];

  const exportFinancialPackCSV = () => {
    const header = 'Type,Reference,Title,Category,Amount,Date,Status,Notes\n';
    const txRows = transactions.map(t =>
      `"Transaction","${t.reference}","${t.title}","${t.category}",${t.amount},"${t.date}","${t.status}","${t.notes || ''}"`
    );
    const invRows = invoices.map(i =>
      `"Invoice","${i.invoiceNumber}","${i.clientName}","Client Billing",${i.totalAmount},"${i.issueDate}","${i.status}","${i.notes || ''}"`
    );
    const expRows = expenses.map(e =>
      `"Expense","${e.id}","${e.title}","${e.category}",${e.amount},"${e.date}","${e.status}","${e.submitterName}"`
    );
    const content = [header, ...txRows, ...invRows, ...expRows].join('\n');
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-finance-executive-pack-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Executive Finance Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Corporate Financial Operations & Treasury
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Finance Manager
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Full oversight of general ledgers, executive cash flows, invoice collections, employee expense clearances, and payroll cycles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowCategoriesModal(true)}>
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Expense Policies
          </Button>
          <Button variant="secondary" size="sm" onClick={exportFinancialPackCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Financial Pack
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowCreateInvoice(true)}>
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Create Invoice
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowRecordTx(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Record Transaction
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowRunPayroll(true)}>
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross YTD Revenue</span>
            <span className="text-emerald-700 font-bold text-xs flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {formatCurrency(financialSummary.totalRevenue, true)}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">From contract billing & services</p>
        </div>

        {/* Total Expenses / Burn */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Total OPEX & Payroll</span>
            <span className="text-zinc-600 font-medium text-xs">Runway: 18 mo</span>
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">
            {formatCurrency(financialSummary.totalExpenses, true)}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">Operating burn + salary disbursements</p>
        </div>

        {/* Profit Margin */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Net Operating Profit</span>
            <span className="text-emerald-700 font-bold text-xs">
              {formatPercent(financialSummary.profitMargin)} Margin
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">
            {formatCurrency(financialSummary.netProfit, true)}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Post-tax net surplus</p>
        </div>

        {/* Unpaid Invoices */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Pending Receivables</span>
            {overdueInvoices.length > 0 && (
              <span className="text-rose-600 font-bold text-xs flex items-center">
                <AlertTriangle className="w-3 h-3 mr-0.5" /> {overdueInvoices.length} Overdue
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">
            {formatCurrency(totalUnpaidInvoiced, true)}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">{unpaidInvoices.length} invoices awaiting settlement</p>
        </div>
      </div>

      {/* Financial Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueExpenseChart />
        </div>
        <div>
          <CashFlowChart />
        </div>
      </div>

      {/* Main Operations Split: Left (Pending Approvals & Ledger) - Right (Invoices & Payroll) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Clearance Queues & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Expense Claims Approval Queue */}
          <Card
            headerTitle="Employee Expense Approval & Reimbursement Queue"
            headerSubtitle="Managerial review and ACH disbursement clearance"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/expenses')}>
                All expenses <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
            noPadding
          >
            {pendingExpenses.length > 0 ? (
              <div className="divide-y divide-[#f0f2f5]">
                {pendingExpenses.slice(0, 5).map((exp) => (
                  <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-[#fafbfc] transition-colors text-xs">
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]">{exp.title}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-700">
                          {exp.category}
                        </span>
                        {exp.leadEndorsement === 'Endorsed' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            ✓ Lead Endorsed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6b7280] mt-0.5">
                        Submitted by <strong className="text-[#374151]">{exp.submitterName}</strong> ({exp.submitterDepartment}) • {formatDate(exp.date)}
                      </p>
                      {exp.notes && <p className="text-[10px] text-[#6b7280] italic mt-0.5">{exp.notes}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono font-bold text-sm text-[#111827]">
                        {formatCurrency(exp.amount)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approveExpense(exp.id)}
                          className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectExpense(exp.id, 'Management budget review')}
                          className="px-2.5 py-1 rounded border border-[#e5e7eb] text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#6b7280]">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                All employee expense vouchers reviewed and processed!
              </div>
            )}
          </Card>

          {/* Approved Expenses Awaiting Direct ACH Disbursal */}
          {approvedExpenses.length > 0 && (
            <Card
              headerTitle="Approved Vouchers Awaiting ACH Disbursal"
              headerSubtitle="Execute electronic bank transfer settlements"
              noPadding
            >
              <div className="divide-y divide-[#f0f2f5]">
                {approvedExpenses.slice(0, 4).map((exp) => (
                  <div key={exp.id} className="p-3.5 flex items-center justify-between hover:bg-[#fafbfc] text-xs">
                    <div>
                      <span className="font-bold text-[#111827]">{exp.title}</span>
                      <p className="text-[11px] text-[#6b7280]">{exp.submitterName} • {exp.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-700">{formatCurrency(exp.amount)}</span>
                      <button
                        onClick={() => reimburseExpense(exp.id)}
                        className="px-2.5 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold cursor-pointer"
                      >
                        Disburse ACH
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Treasury Transactions Ledger */}
          <Card
            headerTitle="Recent Treasury Transactions"
            headerSubtitle="Click any transaction to edit details or reconcile"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/finance')}>
                Full Ledger <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Reference & Title</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {transactions.slice(0, 6).map((tx) => {
                    const isIncome = tx.type === 'Income';
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-[#fafbfc] transition-colors cursor-pointer"
                        onClick={() => setEditingTransaction(tx)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#111827] truncate">{tx.title}</p>
                          <p className="font-mono text-[10px] text-[#6b7280]">{tx.reference}</p>
                        </td>
                        <td className="px-3 py-3 text-[#4b5563] truncate max-w-[120px]">{tx.category}</td>
                        <td className="px-3 py-3 text-[#6b7280] font-mono">{formatDate(tx.date)}</td>
                        <td className="px-3 py-3">
                          <Badge variant={getStatusBadgeVariant(tx.status)} size="sm">{tx.status}</Badge>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold">
                          <span className={isIncome ? 'text-emerald-700' : 'text-[#111827]'}>
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {tx.status === 'Pending' && (
                              <button
                                onClick={() => reconcileTransaction(tx.id, 'Treasury verified')}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-semibold"
                              >
                                Reconcile
                              </button>
                            )}
                            <button
                              onClick={() => setEditingTransaction(tx)}
                              className="px-2 py-0.5 rounded border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[10px] text-[#374151]"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Invoices & Payroll & Budgets */}
        <div className="space-y-6">
          {/* Active / Unpaid Invoices */}
          <Card
            headerTitle="Unpaid Invoices & Receivables"
            headerSubtitle="Click to view details, edit, or settle"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/invoices')}>
                Invoices <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
            noPadding
          >
            <div className="divide-y divide-[#f0f2f5]">
              {unpaidInvoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 hover:bg-[#fafbfc] transition-colors flex items-center justify-between text-xs cursor-pointer"
                  onClick={() => setEditingInvoice(inv)}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#111827]">{inv.invoiceNumber}</span>
                      <Badge variant={getStatusBadgeVariant(inv.status)} size="sm">{inv.status}</Badge>
                    </div>
                    <p className="text-[11px] text-[#4b5563] truncate mt-0.5">{inv.clientName}</p>
                    <p className="text-[10px] text-[#6b7280] font-mono">Due: {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="text-right shrink-0" onClick={e => e.stopPropagation()}>
                    <p className="font-mono font-bold text-[#111827]">{formatCurrency(inv.totalAmount)}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <button
                        onClick={() => markInvoicePaid(inv.id)}
                        className="px-2 py-0.5 rounded bg-black text-white hover:bg-zinc-800 text-[10px] font-semibold cursor-pointer"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => setEditingInvoice(inv)}
                        className="px-2 py-0.5 rounded border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] text-[10px]"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {unpaidInvoices.length === 0 && (
                <div className="p-6 text-center text-xs text-[#6b7280]">
                  All client accounts collected and reconciled!
                </div>
              )}
            </div>
          </Card>

          {/* Payroll Execution Status */}
          <Card
            headerTitle="Corporate Payroll Management"
            headerSubtitle="Salary disbursements and batch authorization"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/payroll')}>
                Payroll <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            {latestPayroll ? (
              <div className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#111827]">{latestPayroll.periodName}</span>
                    <p className="text-[10px] text-[#6b7280]">Processed by {latestPayroll.processedBy}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(latestPayroll.status)} size="sm">
                    {latestPayroll.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-[#6b7280] block font-sans">Gross Total:</span>
                    <span className="font-bold text-[#111827]">{formatCurrency(latestPayroll.totalGross)}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280] block font-sans">Tax Withheld:</span>
                    <span className="font-bold text-[#111827]">{formatCurrency(latestPayroll.totalTax)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between">
                  <span className="text-[11px] text-[#6b7280]">Direct Deposit ACH:</span>
                  <Button variant="primary" size="sm" onClick={() => setShowRunPayroll(true)}>
                    Run New Cycle
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#6b7280]">No payroll history recorded.</p>
            )}
          </Card>

          {/* Department Budget Burn Caps */}
          <Card
            headerTitle="Department OPEX Utilization"
            headerSubtitle="Authorized quarterly cost ceilings"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/budgets')}>
                Budgets <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="space-y-3 text-xs">
              {departments.slice(0, 4).map((d) => {
                const b = budgets.find(bg => bg.departmentId === d.id) || {
                  allocated: d.budget / 4,
                  spent: (d.budget / 4) * 0.74,
                };
                const spent = b.spent || (b.allocated * 0.70);
                const pct = Math.round((spent / b.allocated) * 100);

                return (
                  <div key={d.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111827]">{d.name}</span>
                      <span className="font-mono text-[11px] font-bold text-[#6b7280]">
                        {formatCurrency(spent)} / {formatCurrency(b.allocated)}
                      </span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 90 ? 'bg-rose-600' : pct > 75 ? 'bg-amber-500' : 'bg-black'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <RecordTransactionModal
        isOpen={showRecordTx}
        onClose={() => setShowRecordTx(false)}
      />
      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
      />
      <EditInvoiceModal
        invoice={editingInvoice}
        isOpen={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
      />
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
      <RunPayrollModal
        isOpen={showRunPayroll}
        onClose={() => setShowRunPayroll(false)}
      />
      <ManageExpenseCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </div>
  );
};
