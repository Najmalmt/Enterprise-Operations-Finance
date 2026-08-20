import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Search,
  Building2,
  PieChart as PieIcon,
  FileSpreadsheet
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, formatPercent } from '../utils/formatters';
import { RecordTransactionModal } from '../components/modals/RecordTransactionModal';
import { CreateBudgetModal } from '../components/modals/CreateBudgetModal';
import { AddDepartmentModal } from '../components/modals/AddDepartmentModal';
import { EditTransactionModal } from '../components/modals/EditTransactionModal';
import { Transaction } from '../types';
import { useAuth } from '../context/AuthContext';

export const FinancePage: React.FC = () => {
  const { transactions, departments, budgets, financialSummary, reconcileTransaction } = useData();
  const { hasPermission, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'ledger' | 'budgets' | 'accounts' | 'reports'>('ledger');

  // Ledger filters
  const [searchLedger, setSearchLedger] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');

  // Modals
  const [showRecordTx, setShowRecordTx] = useState(false);
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const canManageBudgets = hasPermission('manage_budgets');
  const canManageTransactions = hasPermission('manage_transactions');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchLedger.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchLedger.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchLedger.toLowerCase());
    const matchesType = filterType === 'All' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const exportLedgerCSV = () => {
    const headers = ['Reference,Title,Type,Category,Amount,Date,Status,Account\n'];
    const rows = transactions.map(t =>
      `"${t.reference}","${t.title}","${t.type}","${t.category}",${t.amount},"${t.date}","${t.status}","${t.account}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-general-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Corporate Finance & General Ledger
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audited & Reconciled
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Treasury management, cost-center budget allocations, P&L reporting, and settlement audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={exportLedgerCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Ledger
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowRecordTx(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Record Transaction
          </Button>
        </div>
      </div>

      {/* Top Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross Inflow (YTD)</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(financialSummary.totalRevenue, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">+8.4% vs FY25</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Operational Burn (YTD)</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(financialSummary.totalExpenses, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Within ±3.2% budget</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Net Operating Margin</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(financialSummary.netProfit, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Effective Margin: {formatPercent(financialSummary.profitMargin)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Treasury Liquid Reserves</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">$6.25M</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">14.2 months runway</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb] flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`py-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ledger'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          General Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={`py-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'budgets'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          Cost Centers & Budgets ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`py-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          Treasury Accounts
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reports'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          P&L Financial Statements
        </button>
      </div>

      {/* TAB 1: GENERAL LEDGER */}
      {activeTab === 'ledger' && (
        <Card noPadding>
          <div className="p-4 border-b border-[#f0f2f5] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger by reference, title, or category..."
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filterType === 'All'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:bg-[#f3f4f6]'
                }`}
              >
                All Flows
              </button>
              <button
                onClick={() => setFilterType('Income')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filterType === 'Income'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:bg-[#f3f4f6]'
                }`}
              >
                Income Only
              </button>
              <button
                onClick={() => setFilterType('Expense')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filterType === 'Expense'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:bg-[#f3f4f6]'
                }`}
              >
                Disbursements Only
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-4 py-3">Transaction Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Settlement Account</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Amount (USD)</th>
                  {canManageTransactions && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'Income';
                  return (
                    <tr 
                      key={tx.id} 
                      className={`hover:bg-[#fafbfc] transition-colors ${canManageTransactions ? 'cursor-pointer' : ''}`}
                      onClick={() => canManageTransactions && setEditingTransaction(tx)}
                    >
                      <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-[#111827]">
                        {tx.reference}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#111827]">
                        {tx.title}
                      </td>
                      <td className="px-4 py-3.5 text-[#4b5563]">
                        {tx.category}
                      </td>
                      <td className="px-4 py-3.5 text-[#6b7280] truncate max-w-xs">
                        {tx.account}
                      </td>
                      <td className="px-4 py-3.5 text-[#6b7280] font-mono">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getStatusBadgeVariant(tx.status)} size="sm">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold">
                        <span className={isIncome ? 'text-emerald-700' : 'text-[#111827]'}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      {canManageTransactions && (
                        <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {tx.status === 'Pending' && (
                              <button
                                onClick={() => reconcileTransaction(tx.id, 'Bank matched')}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[10px] font-semibold"
                              >
                                Reconcile
                              </button>
                            )}
                            <button
                              onClick={() => setEditingTransaction(tx)}
                              className="px-2 py-0.5 rounded border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[10px] font-medium text-[#374151]"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: COST CENTERS & BUDGETS */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAddDept(true)}>
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Add Department
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowCreateBudget(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Budget Cap
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const b = budgets.find(bg => bg.departmentId === dept.id) || {
                allocated: dept.budget / 4,
                spent: (dept.budget / 4) * 0.72,
                forecasted: (dept.budget / 4) * 0.95,
              };
              const spent = b.spent || (b.allocated * 0.68);
              const remaining = b.allocated - spent;
              const pct = Math.round((spent / b.allocated) * 100);

              return (
                <div key={dept.id} className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#111827]">{dept.name}</h3>
                      <p className="text-[11px] text-[#6b7280]">Head: {dept.headName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#f3f4f6] text-[#374151]">
                      {dept.code}
                    </span>
                  </div>

                  <div className="p-3 bg-[#fafbfc] rounded-lg border border-[#f0f2f5] space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-[#6b7280]">
                      <span className="font-sans">Q3 Allocated:</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(b.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span className="font-sans">Actual Burn:</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(spent)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#e5e7eb] text-emerald-700 font-bold">
                      <span className="font-sans">Remaining Buffer:</span>
                      <span>{formatCurrency(remaining)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[#374151]">
                      <span>Utilization</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 85 ? 'bg-amber-600' : 'bg-black'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TREASURY ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900 text-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-400 uppercase">Operating Treasury</span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">Primary ACH</span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">$4,850,000.00</p>
              <p className="text-xs text-zinc-400 mt-1">JPMorgan Chase ••8912</p>
            </div>
            <div className="pt-3 border-t border-white/10 text-xs text-zinc-300 flex justify-between">
              <span>Routing: 021000021</span>
              <span className="text-emerald-400">Reconciled Active</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#e5e7eb] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[#6b7280] uppercase">Dedicated Payroll Account</span>
              <span className="text-[10px] font-mono bg-[#f3f4f6] px-2 py-0.5 rounded">Automated ACH</span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-[#111827]">$1,250,000.00</p>
              <p className="text-xs text-[#6b7280] mt-1">Silicon Valley Bank ••1102</p>
            </div>
            <div className="pt-3 border-t border-[#f0f2f5] text-xs text-[#6b7280] flex justify-between">
              <span>Bi-weekly schedule</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#e5e7eb] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[#6b7280] uppercase">Corporate Credit Reserve</span>
              <span className="text-[10px] font-mono bg-[#f3f4f6] px-2 py-0.5 rounded">Revolving Card</span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-[#111827]">$150,000.00</p>
              <p className="text-xs text-[#6b7280] mt-1">Brex Corporate ••4401</p>
            </div>
            <div className="pt-3 border-t border-[#f0f2f5] text-xs text-[#6b7280] flex justify-between">
              <span>30-day settlement</span>
              <span className="text-emerald-700 font-semibold">Current</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL REPORTS (P&L) */}
      {activeTab === 'reports' && (
        <Card
          headerTitle="Condensed Statement of Comprehensive Income (P&L)"
          headerSubtitle="FY2026 Consolidated Operating Metrics in USD"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb] space-y-2">
              <h4 className="font-bold text-[#111827] font-sans text-xs uppercase tracking-wider">Revenue & Operating Inflow</h4>
              <div className="flex justify-between text-[#374151] pt-1">
                <span className="font-sans">Enterprise IT Client Retainers & Contracts:</span>
                <span>$4,120,000.00</span>
              </div>
              <div className="flex justify-between text-[#374151]">
                <span className="font-sans">Cloud Modernization & DevOps Milestones:</span>
                <span>$700,000.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5e7eb] font-bold text-[#111827]">
                <span className="font-sans">Total Gross Revenue:</span>
                <span>{formatCurrency(financialSummary.totalRevenue)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb] space-y-2">
              <h4 className="font-bold text-[#111827] font-sans text-xs uppercase tracking-wider">Operating Expenses (COGS & OPEX)</h4>
              <div className="flex justify-between text-[#6b7280] pt-1">
                <span className="font-sans">Engineering & Technical Payroll:</span>
                <span>$1,240,000.00</span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span className="font-sans">AWS & Cloud Compute Infrastructure:</span>
                <span>$480,000.00</span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span className="font-sans">Enterprise SaaS Licenses & Security Tooling:</span>
                <span>$240,000.00</span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span className="font-sans">General, Administrative & Real Estate:</span>
                <span>$200,000.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5e7eb] font-bold text-[#111827]">
                <span className="font-sans">Total Operating Expenditures:</span>
                <span>{formatCurrency(financialSummary.totalExpenses)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0f141c] text-white space-y-2">
              <div className="flex justify-between font-bold text-sm">
                <span className="font-sans">Net Operating Income (EBITDA):</span>
                <span className="text-emerald-400">{formatCurrency(financialSummary.netProfit)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="font-sans">Operating Profit Margin:</span>
                <span>{formatPercent(financialSummary.profitMargin)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modals */}
      <RecordTransactionModal
        isOpen={showRecordTx}
        onClose={() => setShowRecordTx(false)}
      />
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
      <CreateBudgetModal
        isOpen={showCreateBudget}
        onClose={() => setShowCreateBudget(false)}
      />
      <AddDepartmentModal
        isOpen={showAddDept}
        onClose={() => setShowAddDept(false)}
      />
    </div>
  );
};
