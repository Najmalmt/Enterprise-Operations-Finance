import React, { useState } from 'react';
import {
  UserPlus,
  Receipt,
  FileText,
  DollarSign,
  Plus,
  TrendingUp,
  Download,
  Building2,
  Calendar
} from 'lucide-react';
import { DashboardKPIs } from '../components/dashboard/DashboardKPIs';
import { RevenueExpenseChart } from '../components/dashboard/RevenueExpenseChart';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { ExpenseDonutChart } from '../components/dashboard/ExpenseDonutChart';
import { PendingApprovalsWidget } from '../components/dashboard/PendingApprovalsWidget';
import { RecentTransactionsWidget } from '../components/dashboard/RecentTransactionsWidget';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useData } from '../context/DataContext';
import { formatCurrency, formatPercent } from '../utils/formatters';

// Modals
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { CreateExpenseModal } from '../components/modals/CreateExpenseModal';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { RecordTransactionModal } from '../components/modals/RecordTransactionModal';
import { RunPayrollModal } from '../components/modals/RunPayrollModal';
import { TeamLeadDashboard } from '../components/dashboard/TeamLeadDashboard';
import { ProjectManagerDashboard } from '../components/dashboard/ProjectManagerDashboard';
import { AccountantDashboard } from '../components/dashboard/AccountantDashboard';
import { FinanceManagerDashboard } from '../components/dashboard/FinanceManagerDashboard';
import { HRExecutiveDashboard } from '../components/dashboard/HRExecutiveDashboard';
import { HRManagerDashboard } from '../components/dashboard/HRManagerDashboard';
import { SuperAdminDashboard } from '../components/dashboard/SuperAdminDashboard';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { departments, budgets, financialSummary } = useData();
  const { role, hasPermission } = useAuth();

  // Modal open states - hooks must always be called unconditionally at top level
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showRecordTx, setShowRecordTx] = useState(false);
  const [showRunPayroll, setShowRunPayroll] = useState(false);

  // If user is Super Admin / CEO, render the full Executive Command Console
  if (role === 'Super Admin') {
    return <SuperAdminDashboard onNavigate={onNavigate} />;
  }

  // If user is HR Manager, render dedicated HR Manager console
  if (role === 'HR Manager') {
    return <HRManagerDashboard onNavigate={onNavigate} />;
  }

  // If user is HR Executive, render dedicated HR Executive view
  if (role === 'HR Executive') {
    return <HRExecutiveDashboard onNavigate={onNavigate} />;
  }

  // If user is Finance Manager, render dedicated Finance Manager view
  if (role === 'Finance Manager') {
    return <FinanceManagerDashboard onNavigate={onNavigate} />;
  }

  // If user is Team Lead, render dedicated Team Lead view
  if (role === 'Team Lead') {
    return <TeamLeadDashboard onNavigate={onNavigate} />;
  }

  // If user is Project Manager, render dedicated Project Manager view
  if (role === 'Project Manager') {
    return <ProjectManagerDashboard onNavigate={onNavigate} />;
  }

  // If user is Accountant, render dedicated Accountant view
  if (role === 'Accountant') {
    return <AccountantDashboard onNavigate={onNavigate} />;
  }

  const canCreateEmployee = hasPermission('create_employee');
  const canManageInvoices = hasPermission('manage_invoices');
  const canRecordTx = hasPermission('manage_transactions');

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Executive Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              FY2026 Q3 Active
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Enterprise resource governance, liquidity tracking, and operating analytics.
          </p>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-2 flex-wrap">
          {canCreateEmployee && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddEmployee(true)}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Onboard
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateExpense(true)}
          >
            <Receipt className="w-3.5 h-3.5 mr-1.5" />
            File Claim
          </Button>
          {canManageInvoices && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCreateInvoice(true)}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              New Invoice
            </Button>
          )}
          {canRecordTx && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowRecordTx(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Record Entry
            </Button>
          )}
        </div>
      </div>

      {/* 4 Primary High-Impact KPIs */}
      <DashboardKPIs />

      {/* Charts Row: Revenue/Expenses vs Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueExpenseChart />
        </div>
        <div className="lg:col-span-1">
          <CashFlowChart />
        </div>
      </div>

      {/* Expense Breakdown & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseDonutChart />
        <PendingApprovalsWidget onViewAll={() => onNavigate('/expenses')} />
      </div>

      {/* Department Budget Allocation & Utilization overview */}
      <Card
        headerTitle="Departmental Cost Center Utilization"
        headerSubtitle="Actual operating spend against allocated Q3 budgets"
        headerAction={
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/finance')}>
            Manage Cost Centers
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const b = budgets.find(bg => bg.departmentId === dept.id) || {
              allocated: dept.budget / 4,
              spent: (dept.budget / 4) * 0.72,
            };
            const spent = b.spent || (b.allocated * 0.68);
            const pct = Math.round((spent / b.allocated) * 100);
            return (
              <div key={dept.id} className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#111827] truncate">{dept.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[#4b5563]">
                    {dept.code}
                  </span>
                </div>
                <div className="flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-[#111827]">{formatCurrency(spent, true)}</span>
                  <span className="text-[#6b7280]">of {formatCurrency(b.allocated, true)}</span>
                </div>
                <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct > 85 ? 'bg-amber-600' : 'bg-black'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#6b7280]">
                  <span>Head: {dept.headName.split(' ')[0]}</span>
                  <span className={pct > 85 ? 'text-amber-700 font-semibold' : 'text-[#6b7280]'}>{pct}% utilized</span>
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

      {/* Modals Mounted */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
      />
      <CreateExpenseModal
        isOpen={showCreateExpense}
        onClose={() => setShowCreateExpense(false)}
      />
      <CreateInvoiceModal
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
      />
      <RecordTransactionModal
        isOpen={showRecordTx}
        onClose={() => setShowRecordTx(false)}
      />
      <RunPayrollModal
        isOpen={showRunPayroll}
        onClose={() => setShowRunPayroll(false)}
      />
    </div>
  );
};
