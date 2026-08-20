import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  Trash2,
  Edit,
  Check,
  Lock,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  UserX
} from 'lucide-react';
import { Employee, EmployeeStatus, EmployeeDocument, LeaveRequest } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { UploadDocumentModal } from './UploadDocumentModal';

interface EmployeeDetailDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const {
    expenses,
    projects,
    attendance,
    documents,
    leaveRequests,
    departments,
    updateEmployee,
    deleteEmployee,
    deactivateEmployee,
    deleteEmployeeDocument
  } = useData();
  const { role, hasPermission, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'leaves' | 'payroll' | 'expenses' | 'projects' | 'attendance'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Edit form state
  const [editStatus, setEditStatus] = useState<EmployeeStatus>('Active');
  const [editSalary, setEditSalary] = useState(0);
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editManagerName, setEditManagerName] = useState('');
  const [editJoiningDate, setEditJoiningDate] = useState('');
  const [editEmploymentType, setEditEmploymentType] = useState<'Full-Time' | 'Contract' | 'Part-Time' | 'Intern'>('Full-Time');
  const [editContractNotes, setEditContractNotes] = useState('');

  if (!isOpen || !employee) return null;

  const isSelf = currentUser?.id === employee.id;
  const canEditEmployee = hasPermission('edit_employee');
  const canEditSalary = role === 'Super Admin';
  const canDeleteEmployee = role === 'Super Admin';
  const canDeactivateEmployee = role === 'Super Admin' || role === 'HR Manager';
  // Financial access is restricted from HR Executive & HR Manager (HR Manager cannot access complete finance)
  const canViewFinancials = role === 'Super Admin' || role === 'Finance Manager' || role === 'Accountant' || isSelf;

  const empExpenses = expenses.filter(e => e.submitterId === employee.id || e.submitterName.includes(employee.lastName));
  const empProjects = projects.filter(p => p.teamMemberIds.includes(employee.id) || p.leadId === employee.id);
  const empAttendance = attendance.filter(a => a.employeeId === employee.id);
  const empDocuments = documents.filter(d => d.employeeId === employee.id);
  const empLeaves = leaveRequests.filter(l => l.employeeId === employee.id);

  // Calculate PTO balances
  const approvedAnnualLeaves = empLeaves.filter(l => l.status === 'Approved' && l.leaveType === 'Annual Leave');
  const usedAnnualDays = approvedAnnualLeaves.reduce((acc, l) => acc + l.daysCount, 0);
  const totalAnnualAllowance = 20;
  const remainingAnnualDays = Math.max(0, totalAnnualAllowance - usedAnnualDays);

  const approvedSickLeaves = empLeaves.filter(l => l.status === 'Approved' && l.leaveType === 'Sick Leave');
  const usedSickDays = approvedSickLeaves.reduce((acc, l) => acc + l.daysCount, 0);
  const totalSickAllowance = 10;
  const remainingSickDays = Math.max(0, totalSickAllowance - usedSickDays);

  const availableTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'documents', label: `Documents (${empDocuments.length})` },
    { key: 'leaves', label: `Leaves (${empLeaves.length})` },
    ...(canViewFinancials ? [{ key: 'payroll', label: 'Payroll' }] : []),
    { key: 'expenses', label: `Expenses (${empExpenses.length})` },
    { key: 'projects', label: `Projects (${empProjects.length})` },
    { key: 'attendance', label: `Attendance (${empAttendance.length})` },
  ];

  const handleStartEdit = () => {
    setEditStatus(employee.status);
    setEditSalary(employee.salary);
    setEditPhone(employee.phone || '');
    setEditLocation(employee.location || '');
    setEditDepartment(employee.department);
    setEditTitle(employee.role);
    setEditManagerName(employee.managerName || 'David Vance');
    setEditJoiningDate(employee.joiningDate || employee.startDate || '2025-01-15');
    setEditEmploymentType(employee.employmentType || 'Full-Time');
    setEditContractNotes(employee.contractNotes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const foundDept = departments.find(d => d.name === editDepartment);
    const payload: Partial<Employee> = {
      status: editStatus,
      phone: editPhone,
      location: editLocation,
      role: editTitle,
      department: editDepartment,
      departmentId: foundDept?.id || employee.departmentId,
      managerName: editManagerName,
      joiningDate: editJoiningDate,
      startDate: editJoiningDate,
      employmentType: editEmploymentType,
      contractNotes: editContractNotes,
    };
    if (canEditSalary) {
      payload.salary = editSalary;
    }
    await updateEmployee(employee.id, payload);
    setIsEditing(false);
  };

  const handleDeactivate = async () => {
    if (!canDeactivateEmployee) return;
    const reason = prompt(`Enter reason for deactivating ${employee.firstName} ${employee.lastName}:`, 'Employment termination / Resignation');
    if (reason !== null) {
      await deactivateEmployee(employee.id, reason);
    }
  };

  const handleDelete = async () => {
    if (!canDeleteEmployee) return;
    if (confirm(`Are you sure you want to permanently remove records for ${employee.firstName} ${employee.lastName}?`)) {
      await deleteEmployee(employee.id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

        {/* Slide-in drawer container */}
        <div className="relative w-full max-w-xl bg-white h-full shadow-2xl z-10 flex flex-col border-l border-[#e5e7eb]">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#111827]">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <Badge variant={getStatusBadgeVariant(employee.status)}>
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#6b7280]">{employee.role} • {employee.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {canEditEmployee && (
                !isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
                    title="Edit Personnel Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveEdit}
                    className="p-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 cursor-pointer"
                    title="Save changes"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )
              )}
              {canDeactivateEmployee && employee.status !== 'Terminated' && (
                <button
                  onClick={handleDeactivate}
                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer"
                  title="Deactivate / Offboard Employee"
                >
                  <UserX className="w-4 h-4" />
                </button>
              )}
              {canDeleteEmployee && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Delete Employee Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 border-b border-[#f0f2f5] flex items-center gap-4 text-xs font-medium overflow-x-auto">
            {availableTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-[#6b7280] hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Edit Banner */}
            {isEditing && (
              <div className="p-4 rounded-xl border border-zinc-300 bg-zinc-50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-[#111827]">Edit Employee Information</h4>
                  <span className="text-[10px] text-[#6b7280]">HR Manager / Authorized updates</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Job Title / Role</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Assign Department</label>
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Assigned Manager</label>
                    <input
                      type="text"
                      value={editManagerName}
                      onChange={(e) => setEditManagerName(e.target.value)}
                      placeholder="e.g. David Vance"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Employment Type</label>
                    <select
                      value={editEmploymentType}
                      onChange={(e) => setEditEmploymentType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Joining / Start Date</label>
                    <input
                      type="date"
                      value={editJoiningDate}
                      onChange={(e) => setEditJoiningDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Employment Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as EmployeeStatus)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Probation">Probation</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Office Location</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    />
                  </div>
                  {canEditSalary ? (
                    <div className="col-span-2">
                      <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Annual Base Salary (Super Admin Only)</label>
                      <input
                        type="number"
                        value={editSalary}
                        onChange={(e) => setEditSalary(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <div className="col-span-2 p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Salary modification locked. Requires authorized Finance/Admin clearance.</span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-[11px] text-[#6b7280] mb-1 font-medium">Contract / Joining Notes</label>
                    <textarea
                      rows={2}
                      value={editContractNotes}
                      onChange={(e) => setEditContractNotes(e.target.value)}
                      placeholder="Special clauses, probation duration, onboarding notes..."
                      className="w-full px-2.5 py-1.5 bg-white border border-[#d1d5db] rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" variant="primary" onClick={handleSaveEdit}>Save Updates</Button>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#fafbfc] border border-[#f0f2f5]">
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wider font-semibold">Compensation</p>
                    {canViewFinancials ? (
                      <>
                        <p className="text-base font-bold font-mono text-[#111827] mt-1">
                          {formatCurrency(employee.salary)}
                        </p>
                        <p className="text-[10px] text-[#6b7280] mt-0.5">
                          {formatCurrency(employee.salary / 12)} / month base
                        </p>
                      </>
                    ) : (
                      <div className="mt-2 text-[#9ca3af]">
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span className="text-[11px] font-medium text-zinc-600">Confidential Finance Data</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Salary locked to Finance/Super Admin</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fafbfc] border border-[#f0f2f5]">
                    <p className="text-[11px] text-[#6b7280] uppercase tracking-wider font-semibold">Joining & Tenure</p>
                    <p className="text-sm font-semibold text-[#111827] mt-1">
                      {formatDate(employee.joiningDate || employee.startDate)}
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {employee.employmentType || 'Full-Time'} Staff Record
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px]">Basic Information & Management</h4>
                  <div className="space-y-2.5 text-xs bg-white border border-[#e5e7eb] p-4 rounded-xl">
                    <div className="flex items-center justify-between py-1 border-b border-[#f0f2f5]">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#9ca3af]" /> Enterprise Email
                      </span>
                      <span className="font-medium text-[#111827]">{employee.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f0f2f5]">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#9ca3af]" /> Phone Number
                      </span>
                      <span className="font-medium text-[#111827]">{employee.phone || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f0f2f5]">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#9ca3af]" /> Office Location
                      </span>
                      <span className="font-medium text-[#111827]">{employee.location}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f0f2f5]">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#9ca3af]" /> Assigned Department
                      </span>
                      <span className="font-medium text-[#111827]">{employee.department}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f0f2f5]">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-[#9ca3af]" /> Assigned Manager
                      </span>
                      <span className="font-medium text-[#111827]">{employee.managerName || 'David Vance'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#6b7280] flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" /> Employment Category
                      </span>
                      <span className="font-medium text-[#111827]">{employee.employmentType || 'Full-Time'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Leave Quota Summary */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-[#111827] text-xs">PTO Quota & Balance</h4>
                    <button
                      onClick={() => setActiveTab('leaves')}
                      className="text-[11px] text-zinc-800 font-bold hover:underline cursor-pointer"
                    >
                      View Full Details →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 bg-white rounded-lg border border-[#e5e7eb]">
                      <span className="text-[#6b7280] block">Annual Leave Balance</span>
                      <span className="font-bold text-emerald-700 font-mono text-sm">{remainingAnnualDays} / {totalAnnualAllowance} Days</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#e5e7eb]">
                      <span className="text-[#6b7280] block">Sick Leave Balance</span>
                      <span className="font-bold text-zinc-800 font-mono text-sm">{remainingSickDays} / {totalSickAllowance} Days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-[#111827]">Compliance & Onboarding Documents</h4>
                    <p className="text-[11px] text-[#6b7280]">Official contracts, IDs, tax slips, and credentials</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => setShowUploadModal(true)}>
                    <Upload className="w-3.5 h-3.5 mr-1" /> Attach Document
                  </Button>
                </div>

                {empDocuments.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-2">
                    <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
                    <p className="font-semibold text-zinc-700">No documents cataloged yet</p>
                    <p className="text-zinc-500 text-[11px]">Attach contracts, tax certificates, or identity verification records.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {empDocuments.map(doc => (
                      <div key={doc.id} className="p-3.5 rounded-xl border border-[#e5e7eb] bg-white flex items-center justify-between hover:border-zinc-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#111827]">{doc.name}</p>
                            <p className="text-[10px] text-[#6b7280] mt-0.5">
                              {doc.type} • {doc.fileSize} • Uploaded {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} size="sm">
                            {doc.status}
                          </Badge>
                          <button
                            onClick={() => deleteEmployeeDocument(doc.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LEAVES & PTO TAB */}
            {activeTab === 'leaves' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">Leave Allowance & Historical Requests</h4>
                  <p className="text-[11px] text-[#6b7280]">Accrued PTO entitlements and clearance logs</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-emerald-800 text-[11px] font-semibold block">Annual Vacation / PTO</span>
                    <p className="text-xl font-bold font-mono text-emerald-900 mt-1">{remainingAnnualDays} <span className="text-xs font-normal">days left</span></p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">{usedAnnualDays} days consumed of {totalAnnualAllowance}d quota</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="text-zinc-700 text-[11px] font-semibold block">Sick & Medical Leave</span>
                    <p className="text-xl font-bold font-mono text-zinc-900 mt-1">{remainingSickDays} <span className="text-xs font-normal">days left</span></p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{usedSickDays} days consumed of {totalSickAllowance}d quota</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-[#111827] text-xs">Past Requests</h5>
                  {empLeaves.length === 0 ? (
                    <p className="text-center text-zinc-400 py-4 text-xs">No leave requests on record.</p>
                  ) : (
                    empLeaves.map(leave => (
                      <div key={leave.id} className="p-3 rounded-lg border border-[#e5e7eb] bg-white space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#111827]">{leave.leaveType} ({leave.daysCount} days)</span>
                          <Badge variant={getStatusBadgeVariant(leave.status)} size="sm">{leave.status}</Badge>
                        </div>
                        <p className="text-[11px] text-[#6b7280]">{formatDate(leave.startDate)} to {formatDate(leave.endDate)}</p>
                        <p className="text-[11px] text-[#374151] italic">"{leave.reason}"</p>
                        {leave.hrReviewStatus && (
                          <div className="mt-1 pt-1 border-t border-[#f0f2f5] text-[10px] text-zinc-600 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-zinc-500" />
                            HR Executive Review: <span className="font-medium">{leave.hrReviewStatus}</span> ({leave.hrReviewNote})
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PAYROLL TAB (Guarded from HR Executive) */}
            {activeTab === 'payroll' && canViewFinancials && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#f0f2f5] space-y-3">
                  <h4 className="font-semibold text-[#111827]">Monthly Compensation Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6b7280]">Gross Base (Monthly):</span>
                      <span className="font-mono font-bold">{formatCurrency(employee.salary / 12)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Federal & State Taxes (26%):</span>
                      <span>-{formatCurrency((employee.salary / 12) * 0.26)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Healthcare & Benefits (7%):</span>
                      <span>-{formatCurrency((employee.salary / 12) * 0.07)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#f0f2f5] text-emerald-700 font-bold text-sm">
                      <span>Est. Net Take-home:</span>
                      <span>{formatCurrency((employee.salary / 12) * 0.67)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPENSES TAB */}
            {activeTab === 'expenses' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#111827]">Claims Filed by {employee.firstName}</h4>
                {empExpenses.length === 0 ? (
                  <p className="text-xs text-[#6b7280] py-6 text-center">No expense claims filed yet.</p>
                ) : (
                  empExpenses.map(exp => (
                    <div key={exp.id} className="p-3 rounded-lg border border-[#e5e7eb] text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#111827]">{exp.title}</span>
                        <span className="font-mono font-bold">{formatCurrency(exp.amount)}</span>
                      </div>
                      <div className="flex justify-between text-[#6b7280] text-[11px]">
                        <span>{exp.category} • {formatDate(exp.date)}</span>
                        <Badge variant={getStatusBadgeVariant(exp.status)} size="sm">{exp.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#111827]">Active Project Deployments</h4>
                {empProjects.length === 0 ? (
                  <p className="text-xs text-[#6b7280] py-6 text-center">Not currently allocated to any IT projects.</p>
                ) : (
                  empProjects.map(p => (
                    <div key={p.id} className="p-3 rounded-lg border border-[#e5e7eb] text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#111827]">{p.name}</span>
                        <Badge variant={getStatusBadgeVariant(p.status)} size="sm">{p.status}</Badge>
                      </div>
                      <div className="w-full bg-[#f0f2f5] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-black h-full rounded-full" style={{ width: `${p.progressPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#6b7280]">
                        <span>Client: {p.client}</span>
                        <span>Progress: {p.progressPercent}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#111827]">Time Logs & Clock History</h4>
                {empAttendance.length === 0 ? (
                  <p className="text-xs text-[#6b7280] py-6 text-center">No attendance logs found.</p>
                ) : (
                  empAttendance.map(att => (
                    <div key={att.id} className="p-3 rounded-lg border border-[#e5e7eb] text-xs flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#111827]">{formatDate(att.date)}</p>
                        <p className="text-[11px] text-[#6b7280]">In: {att.checkIn} | Out: {att.checkOut || 'Active'}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(att.status)} size="sm">{att.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        employeeId={employee.id}
        employeeName={`${employee.firstName} ${employee.lastName}`}
      />
    </>
  );
};
