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
  Check
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';
import { RecordTransactionModal } from '../modals/RecordTransactionModal';
import { CreateInvoiceModal } from '../modals/CreateInvoiceModal';
import { EditTransactionModal } from '../modals/EditTransactionModal';
import { Transaction } from '../../types';

interface AccountantDashboardProps {
  onNavigate: (path: string) => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({ onNavigate }) => {
  const { 
    transactions, 
    invoices, 
    expenses, 
    budgets, 
    departments, 
    financialSummary,
    payrolls,
    reconcileTransaction,
    markInvoicePaid
  } = useData();

  const [showRecordTx, setShowRecordTx] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Accounting specific calculations
  const pendingTx = transactions.filter(t => t.status === 'Pending');
  const unpaidInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue');
  const totalUnpaidInvoiced = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');

  const recentTransactions = transactions.slice(0, 8);
  const approvedExpensesPendingPayout = expenses.filter(e => e.status === 'Approved');
  const latestPayrollBatch = payrolls[0];

  const handleQuickReconcile = async (txId: string) => {
    await reconcileTransaction(txId, 'Verified against monthly bank statement');
  };

  const exportGeneralLedgerCSV = () => {
    const headers = ['Reference,Title,Type,Category,Amount,Date,Status,Settlement Account\n'];
    const rows = transactions.map(t =>
      `"${t.reference}","${t.title}","${t.type}","${t.category}",${t.amount},"${t.date}","${t.status}","${t.account}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-accountant-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Accounting Desk & Financial Records
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Accountant Console
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Day-to-day general ledger entries, client invoicing, receivables tracking, and bank reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={exportGeneralLedgerCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Ledger
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowCreateInvoice(true)}>
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Create Invoice
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowRecordTx(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Record Transaction
          </Button>
        </div>
      </div>

      {/* Accounting KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Unpaid Client Receivables</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalUnpaidInvoiced, true)}</p>
          <div className="flex items-center justify-between text-[11px] mt-1">
            <span className="text-amber-700 font-medium">{unpaidInvoices.length} invoices pending</span>
            {overdueInvoices.length > 0 && (
              <span className="text-rose-600 font-bold">{overdueInvoices.length} Overdue</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross YTD Revenue</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(financialSummary.totalRevenue, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">+8.4% vs annual target</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Pending Reconciliation</span>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{pendingTx.length} Entries</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Bank feed statement sync</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Approved Expense Claims</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">
            {formatCurrency(approvedExpensesPendingPayout.reduce((sum, e) => sum + e.amount, 0))}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">{approvedExpensesPendingPayout.length} vouchers ready for payout</p>
        </div>
      </div>

      {/* Main Accounting Content: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: General Ledger & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            headerTitle="General Ledger & Transactions"
            headerSubtitle="Click any entry to edit or reconcile with treasury accounts"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/transactions')}>
                All ledger <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Ref & Title</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'Income';
                    return (
                      <tr 
                        key={tx.id} 
                        className="hover:bg-[#fafbfc] transition-colors cursor-pointer group"
                        onClick={() => setEditingTransaction(tx)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                                isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {isIncome ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#111827] truncate">{tx.title}</p>
                              <p className="font-mono text-[10px] text-[#6b7280]">{tx.reference}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[#4b5563] truncate max-w-[120px]">{tx.category}</td>
                        <td className="px-3 py-3 text-[#6b7280] font-mono">{formatDate(tx.date)}</td>
                        <td className="px-3 py-3">
                          <Badge variant={getStatusBadgeVariant(tx.status)} size="sm">
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold">
                          <span className={isIncome ? 'text-emerald-700' : 'text-[#111827]'}>
                            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {tx.status === 'Pending' && (
                              <button
                                onClick={() => handleQuickReconcile(tx.id)}
                                className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                title="Mark Reconciled"
                              >
                                <Check className="w-3 h-3" /> Reconcile
                              </button>
                            )}
                            <button
                              onClick={() => setEditingTransaction(tx)}
                              className="px-2 py-1 rounded border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] text-[10px] font-medium"
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

          {/* Department Budget Oversight */}
          <Card
            headerTitle="Departmental Cost Centers & Budget Monitoring"
            headerSubtitle="Authorized operational expense ceilings and utilization status"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/budgets')}>
                View OPEX <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {departments.slice(0, 4).map((d) => {
                const b = budgets.find(bg => bg.departmentId === d.id) || {
                  allocated: d.budget / 4,
                  spent: (d.budget / 4) * 0.72,
                };
                const spent = b.spent || (b.allocated * 0.68);
                const pct = Math.round((spent / b.allocated) * 100);

                return (
                  <div key={d.id} className="p-3 bg-[#fafbfc] rounded-lg border border-[#e5e7eb] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{d.name}</span>
                      <span className="font-mono text-[11px] font-bold text-[#6b7280]">{pct}%</span>
                    </div>
                    <div className="flex justify-between font-mono text-[11px] text-[#6b7280]">
                      <span>Burn: {formatCurrency(spent)}</span>
                      <span>Cap: {formatCurrency(b.allocated)}</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 85 ? 'bg-amber-600' : 'bg-black'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Invoices & Receivables + Payroll Schedule (Authorized View) */}
        <div className="space-y-6">
          {/* Unpaid / Active Invoices */}
          <Card
            headerTitle="Unpaid Invoices & Receivables"
            headerSubtitle="Record client settlements upon receipt"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/invoices')}>
                Invoices <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
            noPadding
          >
            <div className="divide-y divide-[#f0f2f5]">
              {unpaidInvoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="p-3.5 hover:bg-[#fafbfc] transition-colors flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#111827]">{inv.invoiceNumber}</span>
                      <Badge variant={getStatusBadgeVariant(inv.status)} size="sm">{inv.status}</Badge>
                    </div>
                    <p className="text-[11px] text-[#4b5563] truncate mt-0.5">{inv.clientName}</p>
                    <p className="text-[10px] text-[#6b7280] font-mono">Due: {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#111827]">{formatCurrency(inv.totalAmount)}</p>
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="mt-1 px-2 py-0.5 rounded bg-black text-white hover:bg-zinc-800 text-[10px] font-semibold cursor-pointer"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              ))}
              {unpaidInvoices.length === 0 && (
                <div className="p-6 text-center text-xs text-[#6b7280]">
                  All client invoices reconciled and collected!
                </div>
              )}
            </div>
          </Card>

          {/* Authorized Payroll & Salary Records Preview */}
          <Card
            headerTitle="Authorized Payroll Disbursal Records"
            headerSubtitle="Audited salary vouchers & payment batches"
          >
            {latestPayrollBatch ? (
              <div className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827]">{latestPayrollBatch.periodName}</span>
                  <Badge variant={getStatusBadgeVariant(latestPayrollBatch.status)} size="sm">
                    {latestPayrollBatch.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-[#6b7280] block font-sans">Gross Payroll:</span>
                    <span className="font-bold text-[#111827]">{formatCurrency(latestPayrollBatch.totalGross)}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280] block font-sans">Tax Withheld:</span>
                    <span className="font-bold text-[#111827]">{formatCurrency(latestPayrollBatch.totalTax)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-[11px]">
                  <span className="text-[#6b7280]">Settlement Status:</span>
                  <span className="font-semibold text-emerald-700">ACH Matrix Exportable</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#6b7280]">No processed payroll batches found.</p>
            )}
          </Card>

          {/* Quick Financial Statement summary */}
          <div className="p-4 rounded-xl bg-[#0c1017] text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">P&L Operating Summary</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">Q3 FY26</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-300">
                <span className="font-sans">Gross Revenue:</span>
                <span>{formatCurrency(financialSummary.totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span className="font-sans">Operating Expenses:</span>
                <span>{formatCurrency(financialSummary.totalExpenses)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-zinc-800">
                <span className="font-sans">Net Operating Margin:</span>
                <span>{formatPercent(financialSummary.profitMargin)}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              onClick={() => onNavigate('/reports')}
            >
              View Full P&L Statement
            </Button>
          </div>
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
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
    </div>
  );
};
