import React, { useState } from 'react';
import {
  Crown,
  UserPlus,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  Receipt,
  Users,
  Shield,
  Bell,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  CreditCard,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

// Charts & Widgets
import { DashboardKPIs } from './DashboardKPIs';
import { RevenueExpenseChart } from './RevenueExpenseChart';
import { CashFlowChart } from './CashFlowChart';
import { ExpenseDonutChart } from './ExpenseDonutChart';
import { PendingApprovalsWidget } from './PendingApprovalsWidget';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';
import { RecentActivityWidget } from './RecentActivityWidget';

// Modals
import { AddEmployeeModal } from '../modals/AddEmployeeModal';
import { AddDepartmentModal } from '../modals/AddDepartmentModal';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateInvoiceModal } from '../modals/CreateInvoiceModal';
import { CreateExpenseModal } from '../modals/CreateExpenseModal';
import { RecordTransactionModal } from '../modals/RecordTransactionModal';
import { RunPayrollModal } from '../modals/RunPayrollModal';
import { ManageUserAccountsModal } from '../modals/ManageUserAccountsModal';
import { BroadcastNotificationModal } from '../modals/BroadcastNotificationModal';
import { ExecutiveReportsModal } from '../modals/ExecutiveReportsModal';

interface SuperAdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigate }) => {
  const {
    financialSummary,
    departments,
    employees,
    projects,
    expenses,
    transactions,
    invoices,
    payrolls,
    leaveRequests,
    companyInfo,
    approveExpense,
    reviewLeaveRequest,
    disbursePayroll
  } = useData();

  const { currentUser } = useAuth();

  // Modal open states
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showRecordTx, setShowRecordTx] = useState(false);
  const [showRunPayroll, setShowRunPayroll] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // Quick batch approval states
  const pendingExpenses = expenses.filter(e => e.status === 'Pending');
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue');
  const pendingPayroll = payrolls.find(p => p.status === 'Processing');

  const handleBatchApproveExpenses = async () => {
    for (const exp of pendingExpenses.slice(0, 5)) {
      await approveExpense(exp.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* CEO / Super Admin Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              Super Admin & Chief Executive
            </span>
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              {companyInfo.legalName}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              FY2026 Active • Full Governance
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-1">
            Welcome back, <strong className="text-[#111827]">{currentUser?.name || 'Mohammed Najmal'}</strong>. Total enterprise oversight across personnel, treasury, projects, and security.
          </p>
        </div>

        {/* Executive Action Cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowReports(true)}>
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Executive Reports
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowManageUsers(true)}>
            <Shield className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            User Roles & RBAC
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowBroadcast(true)}>
            <Bell className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Broadcast Alert
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddEmployee(true)}>
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Onboard Personnel
          </Button>
        </div>
      </div>

      {/* Quick Launch Control Bar */}
      <div className="p-3 bg-[#fafbfc] border border-[#e5e7eb] rounded-xl flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider pl-2 whitespace-nowrap">
          Quick Launch:
        </span>
        <button
          onClick={() => setShowAddDept(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[#374151] hover:text-black font-semibold hover:border-black transition-all cursor-pointer whitespace-nowrap"
        >
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          Create Department
        </button>
        <button
          onClick={() => setShowCreateProject(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[#374151] hover:text-black font-semibold hover:border-black transition-all cursor-pointer whitespace-nowrap"
        >
          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
          New Enterprise Project
        </button>
        <button
          onClick={() => setShowCreateInvoice(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[#374151] hover:text-black font-semibold hover:border-black transition-all cursor-pointer whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          Issue Client Invoice
        </button>
        <button
          onClick={() => setShowRunPayroll(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[#374151] hover:text-black font-semibold hover:border-black transition-all cursor-pointer whitespace-nowrap"
        >
          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          Run Payroll
        </button>
        <button
          onClick={() => setShowRecordTx(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[#374151] hover:text-black font-semibold hover:border-black transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-700" />
          Record Ledger TX
        </button>
      </div>

      {/* 4 Primary High-Impact KPIs */}
      <DashboardKPIs />

      {/* Executive Approvals & Action Center */}
      {(pendingExpenses.length > 0 || pendingLeaves.length > 0 || overdueInvoices.length > 0 || pendingPayroll) && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold text-xs text-amber-900">
                Executive Action Center: {pendingExpenses.length + pendingLeaves.length + overdueInvoices.length + (pendingPayroll ? 1 : 0)} items requiring CEO clearance
              </span>
            </div>
            {pendingExpenses.length > 0 && (
              <Button variant="secondary" size="sm" onClick={handleBatchApproveExpenses}>
                Quick Approve Next 5 Expenses
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {pendingPayroll && (
              <div className="p-3 bg-white border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111827]">Pending Payroll Batch</div>
                  <div className="text-[11px] text-[#6b7280]">{pendingPayroll.periodName} ({formatCurrency(pendingPayroll.totalGross)})</div>
                </div>
                <Button variant="primary" size="sm" onClick={() => disbursePayroll(pendingPayroll.id)}>
                  Disburse
                </Button>
              </div>
            )}

            {pendingExpenses.length > 0 && (
              <div className="p-3 bg-white border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111827]">{pendingExpenses.length} Expense Claims</div>
                  <div className="text-[11px] text-[#6b7280]">Total ${pendingExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => onNavigate('/expenses')}>
                  Review
                </Button>
              </div>
            )}

            {pendingLeaves.length > 0 && (
              <div className="p-3 bg-white border border-amber-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#111827]">{pendingLeaves.length} Leave Requests</div>
                  <div className="text-[11px] text-[#6b7280]">PTO Queue</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => onNavigate('/attendance')}>
                  Manage
                </Button>
              </div>
            )}

            {overdueInvoices.length > 0 && (
              <div className="p-3 bg-white border border-rose-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-900">{overdueInvoices.length} Overdue Invoices</div>
                  <div className="text-[11px] text-rose-700">${overdueInvoices.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()} unpaid</div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => onNavigate('/finance')}>
                  Invoices
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueExpenseChart />
        </div>
        <div className="lg:col-span-1">
          <CashFlowChart />
        </div>
      </div>

      {/* Expense Allocation & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseDonutChart />
        <PendingApprovalsWidget onViewAll={() => onNavigate('/expenses')} />
      </div>

      {/* Department Cost Centers */}
      <Card
        headerTitle="Organizational Cost Centers & Budget Burn"
        headerSubtitle="Allocated Q3 budgets vs. actual departmental expenditures"
        headerAction={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowAddDept(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Dept
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/employees')}>
              View Directory
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const pct = Math.round((dept.spent / dept.budget) * 100);
            return (
              <div key={dept.id} className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#111827] truncate">{dept.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[#4b5563]">
                    {dept.code}
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-[#111827]">{formatCurrency(dept.spent, true)}</span>
                  <span className="text-[#6b7280]">of {formatCurrency(dept.budget, true)}</span>
                </div>

                <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct > 85 ? 'bg-amber-600' : 'bg-black'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#6b7280]">
                  <span>Head: {dept.headName.split(' ')[0]}</span>
                  <span className={pct > 85 ? 'text-amber-700 font-semibold' : 'text-[#6b7280]'}>
                    {pct}% burned • {dept.employeeCount} staff
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Enterprise Projects Portfolio Summary */}
      <Card
        headerTitle="Enterprise Projects Portfolio & Margins"
        headerSubtitle="Strategic initiatives, client contracts, and progress tracking"
        headerAction={
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/projects')}>
            Open Projects Page
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {projects.slice(0, 3).map((proj) => {
            const burnPct = proj.budget > 0 ? Math.round((proj.spent / proj.budget) * 100) : 0;
            return (
              <div key={proj.id} className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#111827] truncate">{proj.name}</span>
                  <Badge variant={proj.status === 'Active' ? 'success' : 'neutral'}>
                    {proj.status}
                  </Badge>
                </div>
                <div className="text-[#6b7280] text-[11px]">
                  Client: <strong className="text-[#374151]">{proj.client}</strong> • Lead: {proj.leadName}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#6b7280]">Progress</span>
                    <span className="font-bold text-[#111827]">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: `${proj.progressPercent}%` }} />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-mono pt-1 border-t border-[#f0f2f5]">
                  <span className="text-[#6b7280]">Spent: {formatCurrency(proj.spent, true)}</span>
                  <span className="font-bold text-[#111827]">Cap: {formatCurrency(proj.budget, true)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Ledger & Security Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactionsWidget onViewAll={() => onNavigate('/finance')} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityWidget onViewAll={() => onNavigate('/settings')} />
        </div>
      </div>

      {/* ALL MODALS MOUNTED */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
      />
      <AddDepartmentModal
        isOpen={showAddDept}
        onClose={() => setShowAddDept(false)}
      />
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />
      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
      />
      <CreateExpenseModal
        isOpen={showCreateExpense}
        onClose={() => setShowCreateExpense(false)}
      />
      <RecordTransactionModal
        isOpen={showRecordTx}
        onClose={() => setShowRecordTx(false)}
      />
      <RunPayrollModal
        isOpen={showRunPayroll}
        onClose={() => setShowRunPayroll(false)}
      />
      <ManageUserAccountsModal
        isOpen={showManageUsers}
        onClose={() => setShowManageUsers(false)}
      />
      <BroadcastNotificationModal
        isOpen={showBroadcast}
        onClose={() => setShowBroadcast(false)}
      />
      <ExecutiveReportsModal
        isOpen={showReports}
        onClose={() => setShowReports(false)}
      />
    </div>
  );
};
