import React, { useState, useMemo, useEffect } from 'react';
import {
  User as UserIcon,
  Briefcase,
  Clock,
  CalendarDays,
  Receipt,
  Banknote,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Plus,
  ArrowRight,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  Printer,
  Shield,
  Layers,
  ChevronRight,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { LeaveType, ExpenseCategory } from '../types';

interface EmployeePortalPageProps {
  initialTab?: 'overview' | 'profile' | 'projects' | 'attendance' | 'leave' | 'expenses' | 'salary';
}

export const EmployeePortalPage: React.FC<EmployeePortalPageProps> = ({ initialTab = 'overview' }) => {
  const { currentUser, role } = useAuth();
  const {
    employees,
    projects,
    expenses,
    leaveRequests,
    attendance,
    payrolls,
    notifications,
    submitLeaveRequest,
    cancelLeaveRequest,
    addExpense,
    updateExpense,
    cancelExpense,
    updateEmployee,
    clockIn,
    clockOut,
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'projects' | 'attendance' | 'leave' | 'expenses' | 'salary'>(initialTab);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [editExpenseForm, setEditExpenseForm] = useState<{
    title: string;
    amount: number;
    category: ExpenseCategory;
    notes: string;
  }>({
    title: '',
    amount: 0,
    category: 'Software Licenses',
    notes: '',
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Match current user to their employee record
  const currentEmployee = useMemo(() => {
    if (!currentUser) return employees[0];
    const match = employees.find(
      e => e.id === currentUser.employeeId || e.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    return match || employees.find(e => e.id === 'emp-5') || employees[0];
  }, [currentUser, employees]);

  const [phoneVal, setPhoneVal] = useState(currentEmployee?.phone || '+1 (555) 019-3382');
  const [locationVal, setLocationVal] = useState(currentEmployee?.location || 'Remote (Seattle)');

  // Permitted sprint task items for employee self-service progress tracking
  const [projectTasks, setProjectTasks] = useState<Record<string, Array<{ id: string; title: string; status: 'In Progress' | 'Completed' | 'Pending'; dueDate: string }>>>({
    'prj-1': [
      { id: 't-1', title: 'Implement gRPC Auth Interceptor & Rate Limiter', status: 'Completed', dueDate: '2026-08-25' },
      { id: 't-2', title: 'Migrate Redis Cluster shards to v7.2 topology', status: 'In Progress', dueDate: '2026-08-30' },
      { id: 't-3', title: 'Write integration regression suites in Playwright', status: 'Pending', dueDate: '2026-09-05' },
    ],
    'prj-2': [
      { id: 't-4', title: 'Configure Multi-Region Cloud SQL Read Replicas', status: 'In Progress', dueDate: '2026-08-28' },
      { id: 't-5', title: 'Audit OWASP Top 10 API Security Headers', status: 'Pending', dueDate: '2026-09-10' },
    ],
    'prj-3': [
      { id: 't-6', title: 'Benchmark throughput latency on WebSocket gateway', status: 'Completed', dueDate: '2026-08-20' },
      { id: 't-7', title: 'Set up Prometheus alerting rules for container OOMs', status: 'In Progress', dueDate: '2026-09-02' },
    ]
  });

  const toggleTaskStatus = (projectId: string, taskId: string) => {
    setProjectTasks(prev => {
      const list = prev[projectId] || [];
      const updated = list.map(t => {
        if (t.id === taskId) {
          const nextStatus: 'In Progress' | 'Completed' | 'Pending' =
            t.status === 'Pending' ? 'In Progress' : t.status === 'In Progress' ? 'Completed' : 'Pending';
          return { ...t, status: nextStatus };
        }
        return t;
      });
      return { ...prev, [projectId]: updated };
    });
  };

  useEffect(() => {
    if (currentEmployee) {
      setPhoneVal(currentEmployee.phone || '+1 (555) 019-3382');
      setLocationVal(currentEmployee.location || 'Remote (Seattle)');
    }
  }, [currentEmployee]);

  const handleSaveProfile = async () => {
    if (!currentEmployee) return;
    await updateEmployee(currentEmployee.id, {
      phone: phoneVal,
      location: locationVal,
    });
    setProfileSuccessMsg('Profile contact details updated successfully.');
    setTimeout(() => setProfileSuccessMsg(null), 4000);
  };

  // Personal data filters
  const myProjects = useMemo(() => {
    if (!currentEmployee) return [];
    return projects.filter(p =>
      p.teamMemberIds.includes(currentEmployee.id) || p.leadId === currentEmployee.id
    );
  }, [projects, currentEmployee]);

  const myExpenses = useMemo(() => {
    if (!currentEmployee) return [];
    return expenses.filter(e =>
      e.submitterId === currentEmployee.id || e.submitterName.toLowerCase() === `${currentEmployee.firstName} ${currentEmployee.lastName}`.toLowerCase()
    );
  }, [expenses, currentEmployee]);

  const myLeaveRequests = useMemo(() => {
    if (!currentEmployee) return [];
    return leaveRequests.filter(l =>
      l.employeeId === currentEmployee.id || l.employeeName.toLowerCase() === `${currentEmployee.firstName} ${currentEmployee.lastName}`.toLowerCase()
    );
  }, [leaveRequests, currentEmployee]);

  const myAttendance = useMemo(() => {
    if (!currentEmployee) return [];
    return attendance.filter(a =>
      a.employeeId === currentEmployee.id || a.employeeName.toLowerCase() === `${currentEmployee.firstName} ${currentEmployee.lastName}`.toLowerCase()
    );
  }, [attendance, currentEmployee]);

  // Latest payslip from payrolls
  const myPayslip = useMemo(() => {
    if (!currentEmployee) return null;
    for (const p of payrolls) {
      const item = p.items.find(i => i.employeeId === currentEmployee.id);
      if (item) {
        return {
          ...item,
          periodName: p.periodName,
          paymentDate: p.paymentDate || '2026-08-31',
          status: p.status,
        };
      }
    }
    // Default fallback calculation based on salary
    const base = currentEmployee.salary / 12;
    const tax = base * 0.22;
    const deductions = base * 0.06;
    return {
      id: `ps-${currentEmployee.id}`,
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      employeeRole: currentEmployee.role,
      department: currentEmployee.department,
      baseSalary: base,
      bonus: 1500,
      tax: tax,
      deductions: deductions,
      netPay: base + 1500 - tax - deductions,
      periodName: 'August 2026',
      paymentDate: '2026-08-31',
      status: 'Paid' as const,
    };
  }, [payrolls, currentEmployee]);

  // Attendance check-in status
  const todayStr = '2026-08-19';
  const todayRecord = myAttendance.find(a => a.date === todayStr);
  const isClockedIn = Boolean(todayRecord && !todayRecord.checkOut);

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [leaveForm, setLeaveForm] = useState<{
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }>({
    leaveType: 'Annual Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    reason: '',
  });

  const [expenseForm, setExpenseForm] = useState<{
    title: string;
    amount: number;
    category: ExpenseCategory;
    projectId?: string;
    notes: string;
  }>({
    title: '',
    amount: 120,
    category: 'Software Licenses',
    projectId: myProjects[0]?.id || '',
    notes: '',
  });

  // Handle Leave Submission (Employee -> HR Flow)
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;
    setIsSubmitting(true);
    try {
      const start = new Date(leaveForm.startDate);
      const end = new Date(leaveForm.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      await submitLeaveRequest({
        employeeId: currentEmployee.id,
        employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
        department: currentEmployee.department,
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        daysCount,
        reason: leaveForm.reason || 'Personal time off requested',
      });

      setShowLeaveModal(false);
      setLeaveForm({
        leaveType: 'Annual Leave',
        startDate: '2026-09-01',
        endDate: '2026-09-03',
        reason: '',
      });
      setActiveTab('leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Expense Submission (Employee -> Finance Flow)
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;
    setIsSubmitting(true);
    try {
      const proj = projects.find(p => p.id === expenseForm.projectId);
      await addExpense({
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        date: new Date().toISOString().split('T')[0],
        submitterId: currentEmployee.id,
        submitterName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
        submitterDepartment: currentEmployee.department,
        projectId: proj?.id,
        projectName: proj?.name,
        notes: expenseForm.notes,
      });

      setShowExpenseModal(false);
      setExpenseForm({
        title: '',
        amount: 120,
        category: 'Software Licenses',
        projectId: myProjects[0]?.id || '',
        notes: '',
      });
      setActiveTab('expenses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditExpense = (exp: any) => {
    setEditingExpense(exp);
    setEditExpenseForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      notes: exp.notes || '',
    });
  };

  const handleSaveEditedExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    setIsSubmitting(true);
    try {
      await updateExpense(editingExpense.id, {
        title: editExpenseForm.title,
        amount: Number(editExpenseForm.amount),
        category: editExpenseForm.category,
        notes: editExpenseForm.notes,
      });
      setEditingExpense(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clock in / out handlers
  const handleClockIn = async () => {
    if (!currentEmployee) return;
    await clockIn(
      currentEmployee.id,
      `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      currentEmployee.department
    );
  };

  const handleClockOut = async () => {
    if (!currentEmployee) return;
    await clockOut(currentEmployee.id);
  };

  // Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
      case 'Present':
      case 'Active':
      case 'Completed':
        return 'success';
      case 'Pending':
      case 'Processing':
      case 'Planning':
        return 'warning';
      case 'Rejected':
      case 'Failed':
      case 'Absent':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Header Banner */}
      <div className="bg-[#0c1017] text-white rounded-2xl p-6 sm:p-8 border border-[#1e2633] relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-black font-bold text-xl flex items-center justify-center shadow-md shrink-0">
              {currentEmployee ? `${currentEmployee.firstName[0]}${currentEmployee.lastName[0]}` : 'NX'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : currentUser?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentEmployee?.role || 'Staff Engineer'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-zinc-800 text-zinc-300">
                  ID: {currentEmployee?.id}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-500" />
                  {currentEmployee?.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {currentEmployee?.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {currentEmployee?.email}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions (Apply Leave / Submit Expense / Clock) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isClockedIn ? (
              <button
                onClick={handleClockOut}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                Clock Out (09:02 AM)
              </button>
            ) : (
              <button
                onClick={handleClockIn}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                Check-In Today
              </button>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={CalendarDays}
              onClick={() => setShowLeaveModal(true)}
              className="bg-white text-black hover:bg-zinc-100"
            >
              Apply Leave
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Receipt}
              onClick={() => setShowExpenseModal(true)}
              className="border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              Submit Claim
            </Button>
          </div>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute right-0 bottom-0 top-0 w-96 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#e5e7eb] pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'My Workspace', icon: Sparkles },
          { id: 'profile', label: 'My Profile', icon: UserIcon },
          { id: 'projects', label: 'My Projects', icon: Briefcase, count: myProjects.length },
          { id: 'attendance', label: 'My Attendance', icon: Clock },
          { id: 'leave', label: 'My Leave Requests', icon: CalendarDays, count: myLeaveRequests.filter(l => l.status === 'Pending').length },
          { id: 'expenses', label: 'My Expenses & Claims', icon: Receipt, count: myExpenses.filter(e => e.status === 'Pending').length },
          { id: 'salary', label: 'My Salary & Payslips', icon: Banknote },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white text-black' : 'bg-[#e5e7eb] text-[#374151]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW / WORKSPACE */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Assigned Projects</span>
              <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{myProjects.length}</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {myProjects.filter(p => p.status === 'Active').length} in active sprint
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Available Paid Leave</span>
              <p className="text-2xl font-bold text-[#111827] font-mono mt-1">16 <span className="text-xs font-normal text-[#6b7280]">/ 22 Days</span></p>
              <p className="text-[11px] text-[#6b7280] mt-1">
                {myLeaveRequests.filter(l => l.status === 'Pending').length} requests pending review
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Pending Claims Reimbursement</span>
              <p className="text-2xl font-bold text-[#111827] font-mono mt-1">
                {formatCurrency(myExpenses.filter(e => e.status === 'Pending' || e.status === 'Approved').reduce((s, e) => s + e.amount, 0))}
              </p>
              <p className="text-[11px] text-[#6b7280] mt-1">{myExpenses.length} total claims filed</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Monthly Base Take-Home</span>
              <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">
                {formatCurrency(myPayslip ? myPayslip.netPay : (currentEmployee?.salary || 0) / 12 * 0.72)}
              </p>
              <p className="text-[11px] text-[#6b7280] mt-1">Next pay date: Aug 31, 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: My Active Projects & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Projects */}
              <Card
                title="My Assigned Engagements"
                subtitle="Active software milestones, deliverable progress, and team assignments"
                action={
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('projects')}>
                    View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                }
              >
                {myProjects.length === 0 ? (
                  <p className="text-xs text-[#6b7280] py-6 text-center">No active projects assigned</p>
                ) : (
                  <div className="space-y-3">
                    {myProjects.slice(0, 3).map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] hover:bg-white transition-colors space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-[#111827]">{p.name}</h4>
                              <span className="text-[10px] font-mono font-bold bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[#4b5563]">
                                {p.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6b7280] mt-0.5">{p.client} • Lead: {p.leadName}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(p.status)} size="sm">{p.status}</Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-[#6b7280]">
                            <span>Sprint Deliverable Progress</span>
                            <span className="font-mono font-semibold text-[#111827]">{p.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-[#e5e7eb] h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${p.progressPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* My Recent Leave Requests & Expense Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  title="My Leave Pipeline"
                  subtitle="Live HR approval review"
                  action={
                    <button onClick={() => setShowLeaveModal(true)} className="text-xs font-semibold text-black hover:underline">
                      + Request
                    </button>
                  }
                >
                  <div className="space-y-2.5 text-xs">
                    {myLeaveRequests.length === 0 ? (
                      <p className="text-xs text-[#6b7280] py-4 text-center">No leave requests submitted</p>
                    ) : (
                      myLeaveRequests.slice(0, 3).map((l) => (
                        <div key={l.id} className="p-2.5 rounded-lg border border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#111827]">{l.leaveType} ({l.daysCount}d)</p>
                            <p className="text-[10px] text-[#6b7280]">{formatDate(l.startDate)} - {formatDate(l.endDate)}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(l.status)} size="sm">{l.status}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                <Card
                  title="Recent Expense Claims"
                  subtitle="Finance review & ACH"
                  action={
                    <button onClick={() => setShowExpenseModal(true)} className="text-xs font-semibold text-black hover:underline">
                      + Claim
                    </button>
                  }
                >
                  <div className="space-y-2.5 text-xs">
                    {myExpenses.length === 0 ? (
                      <p className="text-xs text-[#6b7280] py-4 text-center">No expense claims filed</p>
                    ) : (
                      myExpenses.slice(0, 3).map((e) => (
                        <div key={e.id} className="p-2.5 rounded-lg border border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#111827]">{e.title}</p>
                            <p className="text-[10px] font-mono text-[#6b7280]">{formatCurrency(e.amount)} • {e.category}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(e.status)} size="sm">{e.status}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Right 1 Col: Profile Snapshot & Payslip Card */}
            <div className="space-y-6">
              <Card title="Personnel Profile Summary" subtitle="Verified Employee Credentials">
                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Role Position:</span>
                      <span className="font-semibold text-[#111827]">{currentEmployee?.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Department:</span>
                      <span className="font-semibold text-[#111827]">{currentEmployee?.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Start Date:</span>
                      <span className="font-mono text-[#111827]">{formatDate(currentEmployee?.startDate || '2023-01-01')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Direct Deposit:</span>
                      <span className="font-mono text-[#111827]">{currentEmployee?.bankAccount || '•••• 7123'}</span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveTab('profile')}
                  >
                    View & Update Permitted Info
                  </Button>
                </div>
              </Card>

              {/* Latest Digital Payslip Preview Card */}
              <Card title="August 2026 Earnings" subtitle="Direct ACH Settlement">
                <div className="p-4 bg-[#0c1017] text-white rounded-xl space-y-3">
                  <div className="flex justify-between items-baseline border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400">Net Take-Home Pay:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {formatCurrency(myPayslip?.netPay || 0)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-sans">Monthly Base:</span>
                      <span>{formatCurrency(myPayslip?.baseSalary || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-sans">Tax Withholdings:</span>
                      <span className="text-rose-400">-{formatCurrency(myPayslip?.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-sans">Benefits/401(k):</span>
                      <span className="text-rose-400">-{formatCurrency(myPayslip?.deductions || 0)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPayslipModal(true)}
                    className="w-full py-2 bg-white text-black hover:bg-zinc-100 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Open Formatted Payslip
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY PROFILE */}
      {activeTab === 'profile' && (
        <Card title="My Personal Profile & Employee Details" subtitle="View and maintain permitted employee information">
          <div className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={`${currentEmployee?.firstName} ${currentEmployee?.lastName}`}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs text-[#6b7280] font-medium"
                />
                <span className="text-[10px] text-[#9ca3af]">Legal name modifications require HR approval</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Corporate Email</label>
                <input
                  type="email"
                  disabled
                  value={currentEmployee?.email}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs text-[#6b7280]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Role Title</label>
                <input
                  type="text"
                  disabled
                  value={currentEmployee?.role}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs text-[#6b7280]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Department</label>
                <input
                  type="text"
                  disabled
                  value={currentEmployee?.department}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs text-[#6b7280]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Annual Compensation</label>
                <input
                  type="text"
                  disabled
                  value={formatCurrency(currentEmployee?.salary || 0)}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs font-mono text-[#6b7280]"
                />
              </div>
            </div>

            <div className="border-t border-[#e5e7eb] pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Editable Contact & Preferences</h4>
                {profileSuccessMsg && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {profileSuccessMsg}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fafbfc] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Office Location / Remote Hub</label>
                  <input
                    type="text"
                    value={locationVal}
                    onChange={(e) => setLocationVal(e.target.value)}
                    className="w-full px-3 py-2 bg-[#fafbfc] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Direct Deposit Account (Masked)</label>
                <input
                  type="text"
                  disabled
                  defaultValue={currentEmployee?.bankAccount || '•••• 7123 (Silicon Valley Bank Direct Checking)'}
                  className="w-full px-3 py-2 bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs font-mono text-[#6b7280]"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                  Save Permitted Changes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 3: MY PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#111827]">My Enterprise Project Allocations</h3>
              <p className="text-xs text-[#6b7280]">Projects where you are assigned as team member or technical lead</p>
            </div>
            <Badge variant="neutral">{myProjects.length} Engagements</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProjects.map((p) => (
              <div key={p.id} className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#111827]">{p.name}</h4>
                      <span className="text-[10px] font-mono font-bold bg-[#f3f4f6] px-1.5 py-0.5 rounded text-[#4b5563]">
                        {p.code}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7280] mt-0.5">Client: <span className="font-semibold text-[#111827]">{p.client}</span></p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(p.status)} size="sm">{p.status}</Badge>
                </div>

                {p.description && (
                  <p className="text-xs text-[#4b5563] line-clamp-2 leading-relaxed">{p.description}</p>
                )}

                <div className="p-3 bg-[#fafbfc] rounded-lg border border-[#f0f2f5] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Project Lead:</span>
                    <span className="font-semibold text-[#111827]">{p.leadName}</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Contract Window:</span>
                    <span className="font-mono text-[#111827]">{formatDate(p.startDate)} → {formatDate(p.endDate)}</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Total Team Size:</span>
                    <span className="font-mono text-[#111827]">{p.teamMembersCount} engineers</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#6b7280]">
                    <span>Sprint Milestone Completion</span>
                    <span className="font-mono font-bold text-[#111827]">{p.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: `${p.progressPercent}%` }} />
                  </div>
                </div>

                {/* Assigned Work & Task Status */}
                <div className="pt-2 border-t border-[#f0f2f5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#374151]">
                      My Assigned Sprint Work
                    </span>
                    <span className="text-[10px] text-[#6b7280]">Click badge to toggle status</span>
                  </div>
                  <div className="space-y-1.5">
                    {(projectTasks[p.id] || [
                      { id: `t-${p.id}-1`, title: 'Core implementation & unit testing', status: 'In Progress', dueDate: formatDate(p.endDate) }
                    ]).map(task => (
                      <div key={task.id} className="p-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#111827] font-medium text-[11px] truncate">{task.title}</span>
                        <button
                          onClick={() => toggleTaskStatus(p.id, task.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors shrink-0 ${
                            task.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                          title="Click to advance status"
                        >
                          {task.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#111827]">Today&rsquo;s Attendance Session</h3>
              <p className="text-xs text-[#6b7280]">Session logging for August 19, 2026</p>
            </div>
            <div className="flex items-center gap-3">
              {isClockedIn ? (
                <button
                  onClick={handleClockOut}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 cursor-pointer shadow-xs"
                >
                  Clock Out Session
                </button>
              ) : (
                <button
                  onClick={handleClockIn}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Clock In Now
                </button>
              )}
            </div>
          </div>

          <Card title="Monthly Attendance Log" subtitle="Clock-in timestamps, checkouts, and total working hours">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8f9fa] text-[#6b7280] font-semibold uppercase tracking-wider text-[10px] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-4 py-3">Check-In</th>
                    <th className="px-4 py-3">Check-Out</th>
                    <th className="px-4 py-3">Working Hours</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {myAttendance.map((att) => (
                    <tr key={att.id} className="hover:bg-[#fafbfc]">
                      <td className="px-5 py-3.5 font-mono text-[#111827]">{formatDate(att.date)}</td>
                      <td className="px-4 py-3.5 font-mono">{att.checkIn}</td>
                      <td className="px-4 py-3.5 font-mono text-[#6b7280]">
                        {att.checkOut || <span className="text-emerald-700 font-semibold">Active Now</span>}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold">
                        {att.totalHours ? `${att.totalHours} hrs` : 'In progress'}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={getStatusBadgeVariant(att.status)} size="sm">{att.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: MY LEAVE REQUESTS */}
      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#111827]">My Leave Requests & Balance</h3>
              <p className="text-xs text-[#6b7280]">Submit PTO and track live approval status by HR Manager</p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowLeaveModal(true)}>
              Apply for Leave
            </Button>
          </div>

          {/* Leave Entitlement Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Annual Vacation</span>
              <p className="text-xl font-bold text-[#111827] font-mono mt-1">16 <span className="text-xs text-[#6b7280] font-normal">/ 22 Days Left</span></p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Sick / Medical Leave</span>
              <p className="text-xl font-bold text-[#111827] font-mono mt-1">9 <span className="text-xs text-[#6b7280] font-normal">/ 10 Days Left</span></p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Personal / Emergency</span>
              <p className="text-xl font-bold text-[#111827] font-mono mt-1">4 <span className="text-xs text-[#6b7280] font-normal">/ 5 Days Left</span></p>
            </div>
          </div>

          <Card title="Submitted Leave Applications" subtitle="Real-time status updates from HR Manager">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8f9fa] text-[#6b7280] font-semibold uppercase tracking-wider text-[10px] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Reviewer Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {myLeaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#fafbfc]">
                      <td className="px-5 py-3.5 font-bold text-[#111827]">{req.leaveType}</td>
                      <td className="px-4 py-3.5 font-mono text-[#6b7280]">
                        {formatDate(req.startDate)} → {formatDate(req.endDate)}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold">{req.daysCount} Days</td>
                      <td className="px-4 py-3.5 text-[#4b5563] max-w-xs truncate">{req.reason}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getStatusBadgeVariant(req.status)} size="sm">{req.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right text-[#6b7280] text-[11px]">
                        <div className="flex items-center justify-end gap-2">
                          {req.status === 'Approved' ? (
                            <span className="text-emerald-700 font-semibold">Approved by HR Manager</span>
                          ) : req.status === 'Rejected' ? (
                            <span className="text-rose-600 font-semibold">{req.rejectionReason || 'Rejected by HR'}</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-amber-700 font-medium">Pending Review</span>
                              <button
                                onClick={() => cancelLeaveRequest(req.id)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-50 cursor-pointer"
                              >
                                Cancel Request
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 6: MY EXPENSES & CLAIMS */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#111827]">My Expense Claims & Reimbursements</h3>
              <p className="text-xs text-[#6b7280]">Submit corporate out-of-pocket expenses for Finance Manager approval & ACH payout</p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowExpenseModal(true)}>
              Submit Expense Claim
            </Button>
          </div>

          <Card title="Expense Reimbursement Pipeline" subtitle="Real-time Finance approval and settlement">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8f9fa] text-[#6b7280] font-semibold uppercase tracking-wider text-[10px] border-b border-[#e5e7eb]">
                  <tr>
                    <th className="px-5 py-3">Expense Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Project Link</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-right">Finance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {myExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[#fafbfc]">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-[#111827]">{exp.title}</p>
                        {exp.notes && <p className="text-[11px] text-[#6b7280] truncate max-w-xs">{exp.notes}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-[#4b5563]">{exp.category}</td>
                      <td className="px-4 py-3.5">
                        {exp.projectName ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-800">
                            {exp.projectName}
                          </span>
                        ) : (
                          <span className="text-[#9ca3af] text-[11px]">General OPEX</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[#6b7280]">{formatDate(exp.date)}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-[#111827]">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant={getStatusBadgeVariant(exp.status)} size="sm">{exp.status}</Badge>
                          {exp.status === 'Pending' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openEditExpense(exp)}
                                className="text-[10px] text-zinc-700 hover:text-black font-semibold px-2 py-0.5 rounded border border-[#e5e7eb] hover:bg-zinc-50 cursor-pointer"
                                title="Edit pending claim details"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => cancelExpense(exp.id)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-50 cursor-pointer"
                                title="Cancel pending claim"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 7: MY SALARY & PAYSLIPS */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Annual Base Salary</span>
              <p className="text-2xl font-bold font-mono text-[#111827]">{formatCurrency(currentEmployee?.salary || 0)}</p>
              <p className="text-[11px] text-[#6b7280]">Bi-weekly / Monthly direct ACH schedule</p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross Monthly Rate</span>
              <p className="text-2xl font-bold font-mono text-[#111827]">
                {formatCurrency(myPayslip?.baseSalary || (currentEmployee?.salary || 0) / 12)}
              </p>
              <p className="text-[11px] text-[#6b7280]">Pre-tax monthly earnings</p>
            </div>

            <div className="p-5 bg-emerald-950 text-white rounded-xl border border-emerald-900 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Net Monthly Take-Home</span>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                {formatCurrency(myPayslip?.netPay || 0)}
              </p>
              <p className="text-[11px] text-emerald-300/80">Direct deposit: {currentEmployee?.bankAccount || '•••• 7123'}</p>
            </div>
          </div>

          {/* Formatted Payslip View */}
          <Card
            title={`Digital Payslip — ${myPayslip?.periodName || 'August 2026'}`}
            subtitle="Official corporate earnings and tax withholding statement"
            action={
              <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print Payslip
              </Button>
            }
          >
            <div className="p-6 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#e5e7eb] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-0.5 rounded font-black text-xs">NX</span>
                    <span className="font-bold text-sm tracking-wider">NEXORA TECHNOLOGIES INC.</span>
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-0.5">500 Howard Street, Suite 1400, San Francisco, CA 94105</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold bg-[#f3f4f6] px-2 py-1 rounded text-[#111827]">
                    PAYSLIP #{myPayslip?.id || 'NX-PAY-2026-08'}
                  </span>
                  <p className="text-[11px] text-[#6b7280] mt-1 font-mono">Payment Date: {myPayslip?.paymentDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1.5">
                  <p className="font-bold text-[#111827] uppercase tracking-wider text-[10px] text-[#6b7280]">Employee Information</p>
                  <p className="font-semibold text-sm text-[#111827]">{myPayslip?.employeeName}</p>
                  <p className="text-[#6b7280]">{myPayslip?.employeeRole} • {myPayslip?.department}</p>
                  <p className="font-mono text-[#6b7280]">Employee ID: {myPayslip?.employeeId}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-bold text-[#111827] uppercase tracking-wider text-[10px] text-[#6b7280]">Payment Method</p>
                  <p className="font-semibold text-[#111827]">Direct Deposit (Automated Clearing House - ACH)</p>
                  <p className="font-mono text-[#6b7280]">Routing/Account: {currentEmployee?.bankAccount || '•••• 7123'}</p>
                  <Badge variant="success" size="sm">Disbursed & Settled</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Gross Earnings Table */}
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-[#111827] uppercase tracking-wider border-b border-[#e5e7eb] pb-1">
                    Earnings Breakdown
                  </h5>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#4b5563]">
                      <span>Base Salary:</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(myPayslip?.baseSalary || 0)}</span>
                    </div>
                    <div className="flex justify-between text-[#4b5563]">
                      <span>Performance Bonus:</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(myPayslip?.bonus || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#e5e7eb] font-bold text-[#111827]">
                      <span>Total Gross Pay:</span>
                      <span>{formatCurrency((myPayslip?.baseSalary || 0) + (myPayslip?.bonus || 0))}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Table */}
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-[#111827] uppercase tracking-wider border-b border-[#e5e7eb] pb-1">
                    Withholdings & Deductions
                  </h5>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-[#4b5563]">
                      <span>Federal & State Income Tax:</span>
                      <span className="text-rose-600">-{formatCurrency(myPayslip?.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between text-[#4b5563]">
                      <span>Healthcare & 401(k) Plan:</span>
                      <span className="text-rose-600">-{formatCurrency(myPayslip?.deductions || 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#e5e7eb] font-bold text-[#111827]">
                      <span>Total Deductions:</span>
                      <span className="text-rose-600">-{formatCurrency((myPayslip?.tax || 0) + (myPayslip?.deductions || 0))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Total Box */}
              <div className="p-4 bg-[#111827] text-white rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-400">NET REMITTANCE AMOUNT:</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Deposited directly into checking account</p>
                </div>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(myPayslip?.netPay || 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL: APPLY FOR LEAVE */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Apply for Time Off / Leave"
        subtitle="Submit a formal PTO request for HR Manager approval"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleApplyLeave} isLoading={isSubmitting}>
              Submit to HR
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Leave Category</label>
            <select
              value={leaveForm.leaveType}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="Annual Leave">Annual Vacation (16 days balance)</option>
              <option value="Sick Leave">Sick / Medical Leave (9 days balance)</option>
              <option value="Personal Leave">Personal / Emergency (4 days balance)</option>
              <option value="Maternity/Paternity">Parental Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Start Date</label>
              <input
                type="date"
                required
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">End Date</label>
              <input
                type="date"
                required
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Reason / Notes for HR</label>
            <textarea
              rows={3}
              placeholder="e.g. Scheduled family vacation, coverage coordinated with sprint team..."
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL: SUBMIT EXPENSE CLAIM */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Submit Out-of-Pocket Expense"
        subtitle="Claim reimbursement for Finance Manager review & payout"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleExpenseSubmit} isLoading={isSubmitting}>
              Submit to Finance
            </Button>
          </>
        }
      >
        <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Expense Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. JetBrains Enterprise IDE Annual Subscription"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Amount (USD)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              >
                <option value="Software Licenses">Software Licenses</option>
                <option value="Hardware & Equipment">Hardware & Equipment</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Travel & Client Meetings">Travel & Client Meetings</option>
                <option value="Office & Facilities">Office & Facilities</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Associated IT Project (Optional)</label>
            <select
              value={expenseForm.projectId}
              onChange={(e) => setExpenseForm({ ...expenseForm, projectId: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="">General Corporate OPEX</option>
              {myProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Justification / Notes</label>
            <textarea
              rows={2}
              placeholder="Business justification for reimbursement..."
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* MODAL: FULL PAYSLIP */}
      <Modal
        isOpen={showPayslipModal}
        onClose={() => setShowPayslipModal(false)}
        title="Official Monthly Remittance Payslip"
        subtitle={`Period: ${myPayslip?.periodName || 'August 2026'}`}
        footer={
          <Button variant="secondary" onClick={() => setShowPayslipModal(false)}>Close</Button>
        }
      >
        <div className="p-4 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-4 text-xs">
          <div className="flex justify-between border-b border-[#e5e7eb] pb-3">
            <div>
              <p className="font-bold text-[#111827]">{myPayslip?.employeeName}</p>
              <p className="text-[11px] text-[#6b7280]">{myPayslip?.employeeRole}</p>
            </div>
            <div className="text-right font-mono">
              <p className="font-bold text-emerald-700">{formatCurrency(myPayslip?.netPay || 0)}</p>
              <p className="text-[10px] text-[#6b7280]">Net Disbursed</p>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#4b5563]">
              <span className="font-sans">Gross Base Salary:</span>
              <span>{formatCurrency(myPayslip?.baseSalary || 0)}</span>
            </div>
            <div className="flex justify-between text-[#4b5563]">
              <span className="font-sans">Performance Bonus:</span>
              <span>{formatCurrency(myPayslip?.bonus || 0)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span className="font-sans">Tax Withholdings:</span>
              <span>-{formatCurrency(myPayslip?.tax || 0)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span className="font-sans">Healthcare & Benefits:</span>
              <span>-{formatCurrency(myPayslip?.deductions || 0)}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL: EDIT PENDING EXPENSE */}
      <Modal
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        title="Edit Pending Expense Claim"
        subtitle="Update claim amount, category, or justification before Finance review"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingExpense(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEditedExpense} isLoading={isSubmitting}>
              Save Updates
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveEditedExpense} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Expense Title</label>
            <input
              type="text"
              required
              value={editExpenseForm.title}
              onChange={(e) => setEditExpenseForm({ ...editExpenseForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Amount (USD)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={editExpenseForm.amount}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Category</label>
              <select
                value={editExpenseForm.category}
                onChange={(e) => setEditExpenseForm({ ...editExpenseForm, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              >
                <option value="Software Licenses">Software Licenses</option>
                <option value="Hardware & Equipment">Hardware & Equipment</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Travel & Client Meetings">Travel & Client Meetings</option>
                <option value="Office & Facilities">Office & Facilities</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Justification / Notes</label>
            <textarea
              rows={2}
              value={editExpenseForm.notes}
              onChange={(e) => setEditExpenseForm({ ...editExpenseForm, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
