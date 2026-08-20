export type UserRole = 
  | 'Super Admin' 
  | 'HR Manager' 
  | 'Finance Manager' 
  | 'Project Manager' 
  | 'Team Lead' 
  | 'Accountant' 
  | 'HR Executive' 
  | 'Employee';

export type UserPosition =
  | 'Super Admin / CEO'
  | 'HR Manager'
  | 'Finance Manager'
  | 'Project Manager'
  | 'Team Lead'
  | 'Accountant'
  | 'HR Executive'
  | 'Employee';

export type Permission =
  // Personal / Employee Permissions
  | 'view_own_profile'
  | 'edit_own_profile'
  | 'view_own_projects'
  | 'view_own_attendance'
  | 'clock_in_out'
  | 'apply_leave'
  | 'view_own_leave'
  | 'submit_expense'
  | 'view_own_expenses'
  | 'view_own_payslips'
  | 'view_notifications'
  
  // HR Module Permissions
  | 'view_all_employees'
  | 'create_employee'
  | 'edit_employee'
  | 'manage_departments'
  | 'view_company_attendance'
  | 'approve_leave'
  | 'manage_employee_status'
  
  // Finance Module Permissions
  | 'view_company_finance'
  | 'approve_expenses'
  | 'disburse_expenses'
  | 'process_payroll'
  | 'view_all_payslips'
  | 'manage_invoices'
  | 'manage_transactions'
  | 'manage_budgets'
  | 'view_financial_reports'
  
  // Project Module Permissions
  | 'create_project'
  | 'edit_project'
  | 'assign_team'
  | 'manage_project_budget'
  | 'view_project_expenses'
  
  // Governance / CEO Permissions
  | 'manage_roles'
  | 'view_audit_logs'
  | 'manage_system_settings';

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  taxId: string; // EIN / Tax ID
  registrationNumber: string;
  headquartersAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  currencySymbol: string;
  fiscalYearStart: string;
  taxRateDefault: number;
  ceoName: string;
  ceoTitle: string;
  foundedYear: number;
}

export interface SystemSettings {
  companyInfo: CompanyInfo;
  autoApproveExpensesUnder: number;
  requireTwoFactorForFinance: boolean;
  allowOvertimeTracking: boolean;
  strictIPAttendance: boolean;
  notifyOnNewLeaveRequest: boolean;
  notifyOnExpenseSubmission: boolean;
  notifyOnInvoiceOverdue: boolean;
}

export interface User {
  id: string;
  employeeId?: string; // Corresponds to Employee ID in directory
  name: string;
  email: string;
  role: UserRole;
  position?: UserPosition;
  avatarUrl?: string;
  departmentId?: string;
  departmentName?: string;
  title: string;
  customPermissions?: Permission[];
  status?: 'Active' | 'Suspended';
}

export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated' | 'Probation';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  departmentId: string;
  salary: number;
  startDate: string;
  joiningDate?: string;
  employmentType?: 'Full-Time' | 'Contract' | 'Part-Time' | 'Intern';
  contractNotes?: string;
  managerId?: string;
  managerName?: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  location: string;
  bankAccount?: string;
  assignedProjectIds: string[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headEmail: string;
  budget: number;
  spent: number;
  employeeCount: number;
  color?: string;
  description?: string;
  location?: string;
}

export interface LeaveTypePolicy {
  id: string;
  name: string;
  code: string;
  daysPerYear: number;
  isPaid: boolean;
  requiresApproval: boolean;
  carryForwardDays: number;
  description: string;
  isActive: boolean;
}

export type ExpenseCategory = 
  | 'Cloud & Infrastructure'
  | 'Hardware & Equipment'
  | 'Software Licenses'
  | 'Office & Facilities'
  | 'Travel & Client Meetings'
  | 'Marketing & Events'
  | 'Consulting & Legal'
  | 'Miscellaneous';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  submitterId: string;
  submitterName: string;
  submitterDepartment: string;
  projectId?: string;
  projectName?: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  notes?: string;
  leadEndorsement?: 'Endorsed' | 'Flagged';
  leadEndorsementNote?: string;
}

export type TransactionType = 'Income' | 'Expense';
export type TransactionStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface Transaction {
  id: string;
  reference: string;
  title: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  account: string;
  notes?: string;
}

export type PayrollStatus = 'Draft' | 'Processing' | 'Paid' | 'Failed';

export interface PayrollRecord {
  id: string;
  month: string; // e.g. "2026-08"
  periodName: string; // e.g. "August 2026"
  totalGross: number;
  totalTax: number;
  totalBenefits: number;
  totalNet: number;
  employeeCount: number;
  status: PayrollStatus;
  paymentDate?: string;
  processedBy?: string;
  items: PayrollItem[];
}

export interface PayrollItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: 'Pending' | 'Paid';
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.10 for 10%
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paidDate?: string;
  notes?: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  budget: number;
  spent: number;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  leadId: string;
  leadName: string;
  teamMemberIds: string[];
  teamMembersCount: number;
  progressPercent: number;
  description?: string;
  tasks?: ProjectTask[];
}

export interface BudgetCategory {
  id: string;
  departmentId: string;
  departmentName: string;
  period: string; // e.g., "Q3 2026" or "FY 2026"
  allocated: number;
  spent: number;
  forecasted: number;
  status: 'On Track' | 'At Risk' | 'Exceeded';
}

export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Maternity/Paternity' | 'Bereavement' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  leadRecommendation?: 'Recommended' | 'Flagged';
  leadRecommendationNote?: string;
  hrReviewStatus?: 'Pending Review' | 'Prepared for HR Manager' | 'Incomplete Documentation';
  hrReviewNote?: string;
  hrReviewedBy?: string;
  hrReviewedDate?: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  employeeName?: string;
  name: string;
  type: 'Contract' | 'ID Proof' | 'Tax Form W-4' | 'Certificate' | 'NDA' | 'Emergency Contact';
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Expired';
  uploadedBy: string;
  fileUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalHours?: number;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: 'Finance' | 'Employees' | 'Projects' | 'Payroll' | 'Expenses' | 'Invoices' | 'Auth' | 'System';
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'finance' | 'project' | 'system';
  linkTo?: string;
}
