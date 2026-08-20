import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Department,
  Employee,
  Expense,
  Transaction,
  PayrollRecord,
  Invoice,
  Project,
  BudgetCategory,
  LeaveRequest,
  AttendanceRecord,
  AuditLog,
  NotificationItem,
  ExpenseStatus,
  LeaveStatus,
  InvoiceStatus,
  EmployeeDocument,
  LeaveTypePolicy,
  User,
  CompanyInfo,
  SystemSettings
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_EXPENSES,
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_PAYROLL,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_BUDGETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_LEAVE_POLICIES,
  INITIAL_USERS,
  INITIAL_COMPANY_INFO,
  INITIAL_SYSTEM_SETTINGS
} from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface DataContextType {
  // Data lists
  departments: Department[];
  employees: Employee[];
  projects: Project[];
  expenses: Expense[];
  transactions: Transaction[];
  invoices: Invoice[];
  payrolls: PayrollRecord[];
  payrollRuns: PayrollRecord[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  budgets: BudgetCategory[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  documents: EmployeeDocument[];
  leavePolicies: LeaveTypePolicy[];
  users: User[];
  companyInfo: CompanyInfo;
  systemSettings: SystemSettings;
  
  // Loading & sync status
  isLoading: boolean;
  isLoaded: boolean;
  isSyncing: boolean;
  supabaseConnected: boolean;
  lastSyncTime: Date | null;
  refreshData: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  resetDemoData: () => void;

  // Financial calculated metrics
  financialSummary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    cashBalance: number;
    monthlyPayroll: number;
    pendingApprovalsCount: number;
    activeProjectsCount: number;
    totalHeadcount: number;
  };

  // Actions / Mutations
  // User Accounts & RBAC
  addUserAccount: (user: Omit<User, 'id'>) => Promise<void>;
  updateUserAccount: (id: string, partial: Partial<User>) => Promise<void>;
  deleteUserAccount: (id: string) => Promise<void>;

  // Employees
  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  deactivateEmployee: (id: string, reason?: string) => Promise<void>;
  assignEmployeeManager: (employeeId: string, managerId: string, managerName: string) => Promise<void>;
  assignEmployeeToDepartment: (employeeId: string, departmentId: string, departmentName: string) => Promise<void>;

  // Departments
  addDepartment: (dept: Omit<Department, 'id' | 'spent' | 'employeeCount'>) => Promise<void>;
  updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  
  // Leave Policies
  addLeavePolicy: (policy: Omit<LeaveTypePolicy, 'id'>) => Promise<void>;
  updateLeavePolicy: (id: string, policy: Partial<LeaveTypePolicy>) => Promise<void>;
  deleteLeavePolicy: (id: string) => Promise<void>;
  toggleLeavePolicyStatus: (id: string) => Promise<void>;
  
  // Projects
  addProject: (proj: Omit<Project, 'id' | 'spent' | 'progressPercent'>) => Promise<void>;
  updateProject: (id: string, proj: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Expenses
  addExpense: (exp: Omit<Expense, 'id' | 'status'>) => Promise<void>;
  updateExpense: (id: string, exp: Partial<Expense>) => Promise<void>;
  cancelExpense: (id: string) => Promise<void>;
  approveExpense: (id: string) => Promise<void>;
  rejectExpense: (id: string, reason: string) => Promise<void>;
  payExpense: (id: string) => Promise<void>;
  reimburseExpense: (id: string) => Promise<void>;

  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  reconcileTransaction: (id: string, notes?: string) => Promise<void>;

  // Invoices
  addInvoice: (inv: Omit<Invoice, 'id' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'status'>) => Promise<void>;
  updateInvoice: (id: string, inv: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  markInvoicePaid: (id: string) => Promise<void>;

  // Payroll
  runPayroll: (month: string, periodName: string) => Promise<void>;
  processPayrollPayment: (id: string) => Promise<void>;
  disbursePayroll: (id: string) => Promise<void>;

  // Leaves & Attendance
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => Promise<void>;
  cancelLeaveRequest: (id: string) => Promise<void>;
  reviewLeaveRequest: (id: string, status: LeaveStatus, rejectionReason?: string) => Promise<void>;
  recommendLeaveRequest: (id: string, recommendation: 'Recommended' | 'Flagged', note?: string) => Promise<void>;
  prepareLeaveRequestForManager: (id: string, notes: string, status?: 'Prepared for HR Manager' | 'Incomplete Documentation') => Promise<void>;
  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  recordManualAttendance: (record: Omit<AttendanceRecord, 'id'>, reason?: string) => Promise<void>;
  correctAttendance: (id: string, updated: Partial<AttendanceRecord>, reason?: string) => Promise<void>;
  clockIn: (employeeId: string, employeeName: string, department: string) => Promise<void>;
  clockOut: (employeeId: string) => Promise<void>;

  // Employee Documents
  addEmployeeDocument: (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => Promise<void>;
  deleteEmployeeDocument: (id: string) => Promise<void>;

  // Budgets
  addBudget: (bgt: Omit<BudgetCategory, 'id' | 'spent' | 'status'>) => Promise<void>;
  updateBudget: (id: string, partial: Partial<BudgetCategory>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Notifications & Audit
  sendNotification: (notif: { title: string; message: string; type?: 'approval' | 'finance' | 'project' | 'system'; linkTo?: string }) => void;
  deleteNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  logAction: (action: string, module: AuditLog['module'], details: string) => void;

  // Company Information & Settings
  updateCompanyInfo: (partial: Partial<CompanyInfo>) => Promise<void>;
  updateSystemSettings: (partial: Partial<SystemSettings>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'nexora_db_';

function loadOrInitial<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (item) return JSON.parse(item);
  } catch (err) {
    console.warn(`Error loading localStorage key ${key}:`, err);
  }
  return initial;
}

function saveLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error saving localStorage key ${key}:`, err);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // States with localStorage persistence
  const [departments, setDepartments] = useState<Department[]>(() => loadOrInitial('departments', INITIAL_DEPARTMENTS));
  const [employees, setEmployees] = useState<Employee[]>(() => loadOrInitial('employees', INITIAL_EMPLOYEES));
  const [projects, setProjects] = useState<Project[]>(() => loadOrInitial('projects', INITIAL_PROJECTS));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadOrInitial('expenses', INITIAL_EXPENSES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadOrInitial('transactions', INITIAL_TRANSACTIONS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadOrInitial('invoices', INITIAL_INVOICES));
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => loadOrInitial('payrolls', INITIAL_PAYROLL));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadOrInitial('leaveRequests', INITIAL_LEAVE_REQUESTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadOrInitial('attendance', INITIAL_ATTENDANCE));
  const [documents, setDocuments] = useState<EmployeeDocument[]>(() => loadOrInitial('documents', INITIAL_DOCUMENTS));
  const [leavePolicies, setLeavePolicies] = useState<LeaveTypePolicy[]>(() => loadOrInitial('leavePolicies', INITIAL_LEAVE_POLICIES));
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => loadOrInitial('budgets', INITIAL_BUDGETS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadOrInitial('auditLogs', INITIAL_AUDIT_LOGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadOrInitial('notifications', INITIAL_NOTIFICATIONS));
  const [users, setUsers] = useState<User[]>(() => loadOrInitial('users', INITIAL_USERS));
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => loadOrInitial('companyInfo', INITIAL_COMPANY_INFO));
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => loadOrInitial('systemSettings', INITIAL_SYSTEM_SETTINGS));

  // Sync to local storage
  useEffect(() => { saveLocal('departments', departments); }, [departments]);
  useEffect(() => { saveLocal('employees', employees); }, [employees]);
  useEffect(() => { saveLocal('projects', projects); }, [projects]);
  useEffect(() => { saveLocal('expenses', expenses); }, [expenses]);
  useEffect(() => { saveLocal('transactions', transactions); }, [transactions]);
  useEffect(() => { saveLocal('invoices', invoices); }, [invoices]);
  useEffect(() => { saveLocal('payrolls', payrolls); }, [payrolls]);
  useEffect(() => { saveLocal('leaveRequests', leaveRequests); }, [leaveRequests]);
  useEffect(() => { saveLocal('attendance', attendance); }, [attendance]);
  useEffect(() => { saveLocal('documents', documents); }, [documents]);
  useEffect(() => { saveLocal('leavePolicies', leavePolicies); }, [leavePolicies]);
  useEffect(() => { saveLocal('budgets', budgets); }, [budgets]);
  useEffect(() => { saveLocal('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveLocal('notifications', notifications); }, [notifications]);
  useEffect(() => { saveLocal('users', users); }, [users]);
  useEffect(() => { saveLocal('companyInfo', companyInfo); }, [companyInfo]);
  useEffect(() => { saveLocal('systemSettings', systemSettings); }, [systemSettings]);

  // Supabase Fetch Function
  const fetchSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    setIsSyncing(true);
    try {
      // Parallel fetch from Supabase tables
      const [
        empRes,
        deptRes,
        projRes,
        expRes,
        txRes,
      ] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('departments').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('transactions').select('*'),
      ]);

      if (empRes.data && empRes.data.length > 0) {
        setEmployees(empRes.data.map(d => ({
          id: d.id,
          firstName: d.first_name,
          lastName: d.last_name,
          email: d.email,
          phone: d.phone || '',
          role: d.role,
          department: d.department,
          departmentId: d.department_id || '',
          salary: Number(d.salary) || 0,
          startDate: d.start_date,
          status: d.status,
          location: d.location || 'Headquarters',
          bankAccount: d.bank_account || '•••• 0000',
          assignedProjectIds: [],
        })));
      }

      if (deptRes.data && deptRes.data.length > 0) {
        setDepartments(deptRes.data.map(d => ({
          id: d.id,
          name: d.name,
          code: d.code,
          headName: d.head_name || '',
          headEmail: d.head_email || '',
          budget: Number(d.budget) || 0,
          spent: Number(d.spent) || 0,
          employeeCount: Number(d.employee_count) || 0,
        })));
      }

      if (projRes.data && projRes.data.length > 0) {
        setProjects(projRes.data.map(d => ({
          id: d.id,
          name: d.name,
          code: d.code,
          client: d.client,
          budget: Number(d.budget) || 0,
          spent: Number(d.spent) || 0,
          status: d.status,
          priority: d.priority,
          startDate: d.start_date,
          endDate: d.end_date,
          leadId: d.lead_id || '',
          leadName: d.lead_name || '',
          teamMemberIds: [],
          teamMembersCount: 8,
          progressPercent: Number(d.progress_percent) || 0,
          description: d.description,
        })));
      }

      if (expRes.data && expRes.data.length > 0) {
        setExpenses(expRes.data.map(d => ({
          id: d.id,
          title: d.title,
          amount: Number(d.amount) || 0,
          category: d.category,
          date: d.date,
          submitterId: d.submitter_id,
          submitterName: d.submitter_name,
          submitterDepartment: d.submitter_department,
          projectId: d.project_id,
          projectName: d.project_name,
          status: d.status,
          approvedBy: d.approved_by,
          approvalDate: d.approval_date,
          rejectionReason: d.rejection_reason,
          notes: d.notes,
        })));
      }

      if (txRes.data && txRes.data.length > 0) {
        setTransactions(txRes.data.map(d => ({
          id: d.id,
          reference: d.reference,
          title: d.title,
          type: d.type,
          category: d.category,
          amount: Number(d.amount) || 0,
          date: d.date,
          status: d.status,
          account: d.account,
          notes: d.notes,
        })));
      }

      setLastSyncTime(new Date());
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local state:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [fetchSupabaseData]);

  // Reset function
  const resetDemoData = useCallback(() => {
    setDepartments(INITIAL_DEPARTMENTS);
    setEmployees(INITIAL_EMPLOYEES);
    setProjects(INITIAL_PROJECTS);
    setExpenses(INITIAL_EXPENSES);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvoices(INITIAL_INVOICES);
    setPayrolls(INITIAL_PAYROLL);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setAttendance(INITIAL_ATTENDANCE);
    setBudgets(INITIAL_BUDGETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Logging utility
  const logAction = useCallback((action: string, module: AuditLog['module'], details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'sys-admin',
      userName: currentUser?.name || 'Mohammed Najmal',
      userRole: currentUser?.role || 'Super Admin',
      action,
      module,
      details,
      ipAddress: '192.168.1.104',
    };

    setAuditLogs(prev => [newLog, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        supabase.from('audit_logs').insert([{
          user_id: newLog.userId,
          user_name: newLog.userName,
          user_role: newLog.userRole,
          action: newLog.action,
          module: newLog.module,
          details: newLog.details,
          ip_address: newLog.ipAddress,
        }]).then(() => {});
      } catch (e) {
        // ignore
      }
    }
  }, [currentUser]);

  // Computed Financial Metrics
  const financialSummary = useMemo(() => {
    const totalRevenue = transactions
      .filter(t => t.type === 'Income' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0) + 3835000;

    const totalExpenses = transactions
      .filter(t => t.type === 'Expense' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0) + 1434100;

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const cashBalance = 5420000 + (totalRevenue - totalExpenses);

    const latestPayroll = payrolls[0];
    const monthlyPayroll = latestPayroll ? latestPayroll.totalGross : 1248000;

    const pendingApprovalsCount = 
      expenses.filter(e => e.status === 'Pending').length +
      leaveRequests.filter(l => l.status === 'Pending').length;

    const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
    const totalHeadcount = employees.length > 0 ? 240 + employees.length : 248;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      cashBalance,
      monthlyPayroll,
      pendingApprovalsCount,
      activeProjectsCount,
      totalHeadcount,
    };
  }, [transactions, expenses, leaveRequests, projects, employees, payrolls]);

  // Mutations
  const addEmployee = async (emp: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmp: Employee = { ...emp, id: newId };
    setEmployees(prev => [newEmp, ...prev]);

    setDepartments(prev => prev.map(d => {
      if (d.name === emp.department || d.id === emp.departmentId) {
        return { ...d, employeeCount: d.employeeCount + 1 };
      }
      return d;
    }));

    logAction('EMPLOYEE_ONBOARDED', 'Employees', `Onboarded ${emp.firstName} ${emp.lastName} as ${emp.role} in ${emp.department}.`);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('employees').insert([{
          first_name: emp.firstName,
          last_name: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          role: emp.role,
          department: emp.department,
          salary: emp.salary,
          start_date: emp.startDate,
          status: emp.status,
          location: emp.location,
        }]);
      } catch {
        // local persistence active
      }
    }
  };

  const updateEmployee = async (id: string, partial: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...partial } : e));
    logAction('EMPLOYEE_UPDATED', 'Employees', `Updated profile records for employee ID ${id}.`);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('employees').update({
          role: partial.role,
          department: partial.department,
          salary: partial.salary,
          status: partial.status,
        }).eq('id', id);
      } catch {
        // local persistence active
      }
    }
  };

  const deleteEmployee = async (id: string) => {
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    logAction('EMPLOYEE_REMOVED', 'Employees', `Offboarded employee ${target ? target.firstName + ' ' + target.lastName : id}.`);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('employees').delete().eq('id', id);
      } catch {
        // local persistence active
      }
    }
  };

  const deactivateEmployee = async (id: string, reason?: string) => {
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'Terminated' as const } : e));
    logAction('EMPLOYEE_DEACTIVATED', 'Employees', `Deactivated employee ${target ? target.firstName + ' ' + target.lastName : id}. Reason: ${reason || 'Administrative Action'}`);
  };

  const assignEmployeeManager = async (employeeId: string, managerId: string, managerName: string) => {
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, managerId, managerName } : e));
    logAction('MANAGER_ASSIGNED', 'Employees', `Assigned manager ${managerName} to employee ID ${employeeId}.`);
  };

  const assignEmployeeToDepartment = async (employeeId: string, departmentId: string, departmentName: string) => {
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, departmentId, department: departmentName } : e));
    logAction('DEPARTMENT_ASSIGNED', 'Employees', `Transferred employee ID ${employeeId} to department ${departmentName}.`);
  };

  const addDepartment = async (dept: Omit<Department, 'id' | 'spent' | 'employeeCount'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
      spent: 0,
      employeeCount: 0,
    };
    setDepartments(prev => [...prev, newDept]);
    logAction('DEPARTMENT_CREATED', 'Employees', `Created new organizational department: ${dept.name} (${dept.code}).`);
  };

  const updateDepartment = async (id: string, partial: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...partial } : d));
    logAction('DEPARTMENT_UPDATED', 'Employees', `Updated department parameters for ${id}.`);
  };

  const deleteDepartment = async (id: string) => {
    const target = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(d => d.id !== id));
    logAction('DEPARTMENT_DELETED', 'Employees', `Removed organizational department ${target ? target.name : id}.`);
  };

  const addLeavePolicy = async (policy: Omit<LeaveTypePolicy, 'id'>) => {
    const newPolicy: LeaveTypePolicy = {
      ...policy,
      id: `policy-${Date.now()}`,
    };
    setLeavePolicies(prev => [...prev, newPolicy]);
    logAction('LEAVE_POLICY_CREATED', 'Employees', `Established new leave policy: ${policy.name} (${policy.daysPerYear} days/year).`);
  };

  const updateLeavePolicy = async (id: string, partial: Partial<LeaveTypePolicy>) => {
    setLeavePolicies(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
    logAction('LEAVE_POLICY_UPDATED', 'Employees', `Updated leave policy parameters for ID ${id}.`);
  };

  const deleteLeavePolicy = async (id: string) => {
    const target = leavePolicies.find(p => p.id === id);
    setLeavePolicies(prev => prev.filter(p => p.id !== id));
    logAction('LEAVE_POLICY_DELETED', 'Employees', `Removed leave policy ${target ? target.name : id}.`);
  };

  const toggleLeavePolicyStatus = async (id: string) => {
    setLeavePolicies(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    logAction('LEAVE_POLICY_TOGGLED', 'Employees', `Toggled activation status for leave policy ID ${id}.`);
  };

  const addProject = async (proj: Omit<Project, 'id' | 'spent' | 'progressPercent'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      spent: 0,
      progressPercent: 0,
    };
    setProjects(prev => [newProj, ...prev]);
    logAction('PROJECT_INITIALIZED', 'Projects', `Launched project ${proj.name} [${proj.code}] with allocated budget of $${proj.budget.toLocaleString()}.`);
  };

  const updateProject = async (id: string, partial: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
    logAction('PROJECT_UPDATED', 'Projects', `Updated project parameters for ID ${id}.`);
  };

  const deleteProject = async (id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    logAction('PROJECT_DELETED', 'Projects', `Terminated and removed project ${target ? target.name : id}.`);
  };

  const addExpense = async (exp: Omit<Expense, 'id' | 'status'>) => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      status: 'Pending',
    };
    setExpenses(prev => [newExp, ...prev]);

    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      title: 'New Expense Claim Submitted',
      message: `${exp.submitterName} submitted claim for $${exp.amount.toFixed(2)} (${exp.title}).`,
      timestamp: 'Just now',
      read: false,
      type: 'approval',
      linkTo: '/expenses'
    }, ...prev]);

    logAction('EXPENSE_SUBMITTED', 'Expenses', `Submitted expense "${exp.title}" ($${exp.amount.toFixed(2)}) by ${exp.submitterName}.`);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('expenses').insert([{
          title: exp.title,
          amount: exp.amount,
          category: exp.category,
          date: exp.date,
          submitter_id: exp.submitterId,
          submitter_name: exp.submitterName,
          submitter_department: exp.submitterDepartment,
          status: 'Pending',
          notes: exp.notes,
        }]);
      } catch {
        // fallback
      }
    }
  };

  const updateExpense = async (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    logAction('EXPENSE_UPDATED', 'Expenses', `Updated expense "${id}".`);
  };

  const cancelExpense = async (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;
    setExpenses(prev => prev.filter(e => e.id !== id));
    logAction('EXPENSE_CANCELLED', 'Expenses', `Cancelled pending expense "${exp.title}" ($${exp.amount.toFixed(2)}).`);
  };

  const approveExpense = async (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    setExpenses(prev => prev.map(e => e.id === id ? {
      ...e,
      status: 'Approved',
      approvedBy: currentUser?.name || 'Authorized Officer',
      approvalDate: new Date().toISOString(),
    } : e));

    logAction('EXPENSE_APPROVED', 'Expenses', `Approved expense "${exp.title}" ($${exp.amount.toFixed(2)}) submitted by ${exp.submitterName}.`);
  };

  const rejectExpense = async (id: string, reason: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    setExpenses(prev => prev.map(e => e.id === id ? {
      ...e,
      status: 'Rejected',
      approvedBy: currentUser?.name || 'Authorized Officer',
      approvalDate: new Date().toISOString(),
      rejectionReason: reason,
    } : e));

    logAction('EXPENSE_REJECTED', 'Expenses', `Rejected expense "${exp.title}" ($${exp.amount.toFixed(2)}). Reason: ${reason}.`);
  };

  const payExpense = async (id: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Paid' } : e));

    const newTx: Transaction = {
      id: `tx-exp-${Date.now()}`,
      reference: `TX-${new Date().getFullYear()}-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Disbursement: ${exp.title}`,
      type: 'Expense',
      category: exp.category,
      amount: exp.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      account: 'Corporate Treasury Wire Direct ••8912',
      notes: `Reimbursement settled for ${exp.submitterName}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    if (exp.projectId) {
      setProjects(prev => prev.map(p => {
        if (p.id === exp.projectId) {
          const newSpent = p.spent + exp.amount;
          return {
            ...p,
            spent: newSpent,
            progressPercent: Math.min(100, Math.round((newSpent / p.budget) * 100)),
          };
        }
        return p;
      }));
    }

    setDepartments(prev => prev.map(d => {
      if (d.name === exp.submitterDepartment) {
        return { ...d, spent: d.spent + exp.amount };
      }
      return d;
    }));

    logAction('EXPENSE_DISBURSED', 'Finance', `Settled payment of $${exp.amount.toFixed(2)} for expense "${exp.title}". Created TX: ${newTx.reference}.`);
  };

  const reimburseExpense = payExpense;

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions(prev => [newTx, ...prev]);
    logAction('TRANSACTION_RECORDED', 'Finance', `Recorded ${tx.type} of $${tx.amount.toFixed(2)} [Ref: ${tx.reference}].`);
  };

  const updateTransaction = async (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    logAction('TRANSACTION_UPDATED', 'Finance', `Updated transaction record "${id}".`);
  };

  const deleteTransaction = async (id: string) => {
    const target = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    logAction('TRANSACTION_VOIDED', 'Finance', `Voided/removed transaction ${target ? target.reference : id}.`);
  };

  const reconcileTransaction = async (id: string, notes?: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { 
      ...t, 
      status: 'Completed',
      notes: notes ? `${t.notes ? t.notes + ' | ' : ''}Reconciled: ${notes}` : t.notes 
    } : t));
    logAction('TRANSACTION_RECONCILED', 'Finance', `Reconciled transaction ID ${id} with treasury account.`);
  };

  const addInvoice = async (invData: Omit<Invoice, 'id' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'status'>) => {
    const subtotal = invData.items.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = subtotal * invData.taxRate;
    const totalAmount = subtotal + taxAmount;

    const newInvoice: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'Sent',
    };

    setInvoices(prev => [newInvoice, ...prev]);
    logAction('INVOICE_ISSUED', 'Invoices', `Issued invoice ${newInvoice.invoiceNumber} to ${newInvoice.clientName} for $${totalAmount.toFixed(2)}.`);
  };

  const updateInvoice = async (id: string, updated: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const merged = { ...inv, ...updated };
      if (updated.items || updated.taxRate !== undefined) {
        const items = updated.items || inv.items;
        const taxRate = updated.taxRate !== undefined ? updated.taxRate : inv.taxRate;
        const subtotal = items.reduce((acc, item) => acc + item.total, 0);
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;
        merged.subtotal = subtotal;
        merged.taxAmount = taxAmount;
        merged.totalAmount = totalAmount;
      }
      return merged;
    }));
    logAction('INVOICE_UPDATED', 'Invoices', `Updated billing details for invoice ${id}.`);
  };

  const deleteInvoice = async (id: string) => {
    const target = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(i => i.id !== id));
    logAction('INVOICE_DELETED', 'Invoices', `Deleted invoice ${target ? target.invoiceNumber : id}.`);
  };

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    if (status === 'Paid') {
      await markInvoicePaid(id);
      return;
    }
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    logAction('INVOICE_STATUS_UPDATED', 'Invoices', `Invoice ${id} status shifted to ${status}.`);
  };

  const markInvoicePaid = async (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;

    setInvoices(prev => prev.map(i => i.id === id ? {
      ...i,
      status: 'Paid',
      paidDate: new Date().toISOString().split('T')[0]
    } : i));

    const newTx: Transaction = {
      id: `tx-inv-${Date.now()}`,
      reference: `TX-${new Date().getFullYear()}-REV-${inv.invoiceNumber}`,
      title: `Client Payment: ${inv.clientName} (${inv.invoiceNumber})`,
      type: 'Income',
      category: 'Client Retainer / Invoicing',
      amount: inv.totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      account: 'JPMorgan Chase Corporate Treasury ••8912',
      notes: `Reconciled settlement for Invoice ${inv.invoiceNumber}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    logAction('INVOICE_SETTLED', 'Finance', `Invoice ${inv.invoiceNumber} paid in full ($${inv.totalAmount.toFixed(2)}). Generated Income TX: ${newTx.reference}.`);
  };

  const runPayroll = async (month: string, periodName: string) => {
    const totalGross = employees.reduce((sum, e) => sum + (e.salary / 12), 0);
    const totalTax = totalGross * 0.26;
    const totalBenefits = totalGross * 0.07;
    const totalNet = totalGross - totalTax - totalBenefits;

    const newPayroll: PayrollRecord = {
      id: `pay-${month}`,
      month,
      periodName,
      totalGross,
      totalTax,
      totalBenefits,
      totalNet,
      employeeCount: employees.length,
      status: 'Processing',
      processedBy: currentUser?.name || 'Finance Officer',
      items: employees.map(e => ({
        id: `pitem-${e.id}-${month}`,
        employeeId: e.id,
        employeeName: `${e.firstName} ${e.lastName}`,
        employeeRole: e.role,
        department: e.department,
        baseSalary: e.salary / 12,
        bonus: 0,
        deductions: (e.salary / 12) * 0.07,
        tax: (e.salary / 12) * 0.26,
        netPay: (e.salary / 12) * 0.67,
        status: 'Pending',
      }))
    };

    setPayrolls(prev => [newPayroll, ...prev]);
    logAction('PAYROLL_INITIATED', 'Payroll', `Calculated and queued payroll run for ${periodName} ($${totalGross.toFixed(2)}).`);
  };

  const processPayrollPayment = async (id: string) => {
    const payroll = payrolls.find(p => p.id === id);
    if (!payroll) return;

    setPayrolls(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Paid',
      paymentDate: new Date().toISOString().split('T')[0],
      items: p.items.map(item => ({ ...item, status: 'Paid' }))
    } : p));

    const newTx: Transaction = {
      id: `tx-pay-${Date.now()}`,
      reference: `TX-${new Date().getFullYear()}-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Direct Payroll Disbursement: ${payroll.periodName}`,
      type: 'Expense',
      category: 'Payroll & Benefits',
      amount: payroll.totalGross,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      account: 'Silicon Valley Bank Payroll Direct ••1102',
      notes: `Automated ACH salary distribution for ${payroll.employeeCount} personnel.`,
    };
    setTransactions(prev => [newTx, ...prev]);

    logAction('PAYROLL_DISBURSED', 'Payroll', `Disbursed complete payroll batch for ${payroll.periodName} ($${payroll.totalGross.toFixed(2)}). TX: ${newTx.reference}.`);
  };

  const disbursePayroll = processPayrollPayment;

  const submitLeaveRequest = async (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests(prev => [newReq, ...prev]);

    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      title: 'New Leave Request Queued',
      message: `${req.employeeName} requested ${req.daysCount} days of ${req.leaveType}.`,
      timestamp: 'Just now',
      read: false,
      type: 'approval',
      linkTo: '/attendance'
    }, ...prev]);

    logAction('LEAVE_REQUESTED', 'Employees', `${req.employeeName} applied for ${req.daysCount} days ${req.leaveType} (${req.startDate} to ${req.endDate}).`);
  };

  const cancelLeaveRequest = async (id: string) => {
    const req = leaveRequests.find(l => l.id === id);
    if (!req) return;
    setLeaveRequests(prev => prev.filter(l => l.id !== id));
    logAction('LEAVE_CANCELLED', 'Employees', `Cancelled pending leave application for ${req.employeeName} (${req.daysCount} days).`);
  };

  const reviewLeaveRequest = async (id: string, status: LeaveStatus, rejectionReason?: string) => {
    const req = leaveRequests.find(l => l.id === id);
    if (!req) return;

    setLeaveRequests(prev => prev.map(l => l.id === id ? {
      ...l,
      status,
      reviewedBy: currentUser?.name || 'HR Officer',
      reviewedDate: new Date().toISOString(),
      rejectionReason,
    } : l));

    logAction(`LEAVE_${status.toUpperCase()}`, 'Employees', `${status} leave application for ${req.employeeName} (${req.daysCount} days).`);
  };

  const recommendLeaveRequest = async (id: string, recommendation: 'Recommended' | 'Flagged', note?: string) => {
    const req = leaveRequests.find(l => l.id === id);
    if (!req) return;

    setLeaveRequests(prev => prev.map(l => l.id === id ? {
      ...l,
      leadRecommendation: recommendation,
      leadRecommendationNote: note || (recommendation === 'Recommended' ? 'Endorsed by Technical Team Lead' : 'Flagged for managerial review'),
    } : l));

    logAction('LEAVE_RECOMMENDED', 'Employees', `Team Lead marked leave application for ${req.employeeName} as ${recommendation}. Note: ${note || 'None'}`);
  };

  const prepareLeaveRequestForManager = async (id: string, notes: string, status: 'Prepared for HR Manager' | 'Incomplete Documentation' = 'Prepared for HR Manager') => {
    const req = leaveRequests.find(l => l.id === id);
    if (!req) return;

    setLeaveRequests(prev => prev.map(l => l.id === id ? {
      ...l,
      hrReviewStatus: status,
      hrReviewNote: notes,
      hrReviewedBy: currentUser?.name || 'HR Executive',
      hrReviewedDate: new Date().toISOString(),
    } : l));

    logAction('LEAVE_PREPARED_FOR_MANAGER', 'Employees', `HR Executive prepared leave request for ${req.employeeName} (${req.daysCount} days). Status: ${status}. Note: ${notes}`);
  };

  const recordAttendance = async (record: Omit<AttendanceRecord, 'id'>) => {
    const newAtt: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
    };
    setAttendance(prev => [newAtt, ...prev]);
  };

  const recordManualAttendance = async (record: Omit<AttendanceRecord, 'id'>, reason?: string) => {
    const newAtt: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
    };
    setAttendance(prev => [newAtt, ...prev]);
    logAction('ATTENDANCE_RECORDED', 'Employees', `Recorded attendance for ${record.employeeName} on ${record.date} (${record.status}). Reason: ${reason || 'HR entry'}`);
  };

  const correctAttendance = async (id: string, updated: Partial<AttendanceRecord>, reason?: string) => {
    const att = attendance.find(a => a.id === id);
    if (!att) return;

    setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    logAction('ATTENDANCE_CORRECTED', 'Employees', `Corrected attendance record for ${att.employeeName} (${att.date}). Reason: ${reason || 'HR correction'}`);
  };

  const addEmployeeDocument = async (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const newDoc: EmployeeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUser?.name || 'HR Officer',
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAction('DOCUMENT_UPLOADED', 'Employees', `Uploaded ${doc.type} document "${doc.name}" for employee ${doc.employeeId}.`);
  };

  const deleteEmployeeDocument = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    setDocuments(prev => prev.filter(d => d.id !== id));
    logAction('DOCUMENT_DELETED', 'Employees', `Removed ${doc.type} document "${doc.name}" for employee ${doc.employeeId}.`);
  };

  const clockIn = async (employeeId: string, employeeName: string, department: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newAtt: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName,
      department,
      date: dateStr,
      checkIn: timeStr,
      status: 'Present',
    };
    setAttendance(prev => [newAtt, ...prev]);
    logAction('CLOCK_IN', 'Employees', `${employeeName} clocked in at ${timeStr}.`);
  };

  const clockOut = async (employeeId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    setAttendance(prev => prev.map(att => {
      if (att.employeeId === employeeId && att.date === dateStr && !att.checkOut) {
        return {
          ...att,
          checkOut: timeStr,
          totalHours: 8.5,
        };
      }
      return att;
    }));
    logAction('CLOCK_OUT', 'Employees', `Employee ${employeeId} clocked out at ${timeStr}.`);
  };

  const addUserAccount = async (newUser: Omit<User, 'id'>) => {
    const created: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      status: 'Active',
    };
    setUsers(prev => [created, ...prev]);
    logAction('USER_ACCOUNT_CREATED', 'Settings', `Provisioned system access for ${newUser.name} (${newUser.email}) with role ${newUser.role}.`);
  };

  const updateUserAccount = async (id: string, partial: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
    logAction('USER_ACCOUNT_UPDATED', 'Settings', `Modified system credentials & role permissions for user ID ${id}.`);
  };

  const deleteUserAccount = async (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    logAction('USER_ACCOUNT_DELETED', 'Settings', `Revoked system credentials and removed user account ${target ? target.name : id}.`);
  };

  const addBudget = async (bgt: Omit<BudgetCategory, 'id' | 'spent' | 'status'>) => {
    const newBgt: BudgetCategory = {
      ...bgt,
      id: `bgt-${Date.now()}`,
      spent: 0,
      status: 'On Track',
    };
    setBudgets(prev => [newBgt, ...prev]);
    logAction('BUDGET_ALLOCATED', 'Finance', `Allocated budget of $${bgt.allocated.toLocaleString()} for ${bgt.departmentName} (${bgt.period}).`);
  };

  const updateBudget = async (id: string, partial: Partial<BudgetCategory>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...partial } : b));
    logAction('BUDGET_UPDATED', 'Finance', `Modified budget allocation parameters for ID ${id}.`);
  };

  const deleteBudget = async (id: string) => {
    const target = budgets.find(b => b.id === id);
    setBudgets(prev => prev.filter(b => b.id !== id));
    logAction('BUDGET_DELETED', 'Finance', `Removed budget category ${target ? target.departmentName : id}.`);
  };

  const sendNotification = (notif: { title: string; message: string; type?: 'approval' | 'finance' | 'project' | 'system'; linkTo?: string }) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: notif.title,
      message: notif.message,
      timestamp: 'Just now',
      read: false,
      type: notif.type || 'system',
      linkTo: notif.linkTo,
    };
    setNotifications(prev => [newNotif, ...prev]);
    logAction('BROADCAST_SENT', 'Settings', `Dispatched broadcast alert: "${notif.title}".`);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateCompanyInfo = async (partial: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => ({ ...prev, ...partial }));
    logAction('COMPANY_PROFILE_UPDATED', 'Settings', `Updated enterprise profile parameters for ${partial.legalName || 'Corporate Entity'}.`);
  };

  const updateSystemSettings = async (partial: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...partial }));
    logAction('SYSTEM_SETTINGS_UPDATED', 'Settings', 'Updated global governance parameters and system thresholds.');
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        employees,
        projects,
        expenses,
        transactions,
        invoices,
        payrolls,
        payrollRuns: payrolls,
        leaveRequests,
        attendance,
        documents,
        leavePolicies,
        budgets,
        auditLogs,
        notifications,
        users,
        companyInfo,
        systemSettings,
        isLoading,
        isLoaded: !isLoading,
        isSyncing,
        supabaseConnected: isSupabaseConfigured,
        lastSyncTime,
        refreshData: fetchSupabaseData,
        syncWithSupabase: fetchSupabaseData,
        resetDemoData,
        financialSummary,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        deactivateEmployee,
        assignEmployeeManager,
        assignEmployeeToDepartment,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addLeavePolicy,
        updateLeavePolicy,
        deleteLeavePolicy,
        toggleLeavePolicyStatus,
        addProject,
        updateProject,
        deleteProject,
        addExpense,
        updateExpense,
        cancelExpense,
        approveExpense,
        rejectExpense,
        payExpense,
        reimburseExpense,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        reconcileTransaction,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        markInvoicePaid,
        runPayroll,
        processPayrollPayment,
        disbursePayroll,
        submitLeaveRequest,
        cancelLeaveRequest,
        reviewLeaveRequest,
        recommendLeaveRequest,
        prepareLeaveRequestForManager,
        recordAttendance,
        recordManualAttendance,
        correctAttendance,
        clockIn,
        clockOut,
        addEmployeeDocument,
        deleteEmployeeDocument,
        addBudget,
        updateBudget,
        deleteBudget,
        sendNotification,
        deleteNotification,
        markNotificationRead,
        clearNotifications,
        logAction,
        updateCompanyInfo,
        updateSystemSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
