import React, { useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  Trash2,
  Lock,
  Edit2,
  Mail,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { User, UserRole, Permission } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ManageUserAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_ROLES: UserRole[] = [
  'Super Admin',
  'Finance Manager',
  'HR Manager',
  'Project Manager',
  'Team Lead',
  'Accountant',
  'HR Executive',
  'Employee',
];

const ALL_PERMISSIONS: { key: Permission; label: string; group: string }[] = [
  { key: 'view_all_employees', label: 'View All Employees', group: 'HR & Directory' },
  { key: 'create_employee', label: 'Onboard Employee', group: 'HR & Directory' },
  { key: 'edit_employee', label: 'Edit Employee Information', group: 'HR & Directory' },
  { key: 'manage_employee_status', label: 'Deactivate / Manage Status', group: 'HR & Directory' },
  { key: 'manage_departments', label: 'Manage Departments', group: 'HR & Directory' },
  { key: 'view_all_payslips', label: 'View All Salaries & Payslips', group: 'Payroll' },
  { key: 'process_payroll', label: 'Execute & Disburse Payroll', group: 'Payroll' },
  { key: 'view_company_finance', label: 'View Financial Dashboard', group: 'Finance & Treasury' },
  { key: 'manage_transactions', label: 'Manage Ledger Transactions', group: 'Finance & Treasury' },
  { key: 'manage_invoices', label: 'Create & Edit Invoices', group: 'Finance & Treasury' },
  { key: 'manage_budgets', label: 'Manage Company Budgets', group: 'Finance & Treasury' },
  { key: 'approve_expenses', label: 'Approve/Reject Expenses', group: 'Expenses' },
  { key: 'disburse_expenses', label: 'Disburse & Reimburse Claims', group: 'Expenses' },
  { key: 'submit_expense', label: 'Submit Personal Expense', group: 'Expenses' },
  { key: 'create_project', label: 'Create Enterprise Projects', group: 'Projects' },
  { key: 'edit_project', label: 'Edit Project Parameters', group: 'Projects' },
  { key: 'assign_team', label: 'Assign Project Leads & Squad', group: 'Projects' },
  { key: 'manage_project_budget', label: 'Manage Project Budgets', group: 'Projects' },
  { key: 'view_project_expenses', label: 'View Project Cost Details', group: 'Projects' },
  { key: 'view_company_attendance', label: 'View Enterprise Attendance', group: 'Workforce & Leave' },
  { key: 'approve_leave', label: 'Approve/Reject PTO Leaves', group: 'Workforce & Leave' },
  { key: 'view_financial_reports', label: 'View Executive & Financial Reports', group: 'Analytics & Reports' },
  { key: 'manage_roles', label: 'Assign & Modify User Roles', group: 'Governance & Security' },
  { key: 'view_audit_logs', label: 'View Immutable Audit Ledger', group: 'Governance & Security' },
  { key: 'manage_system_settings', label: 'Manage Global System Settings', group: 'Governance & Security' },
];

export const ManageUserAccountsModal: React.FC<ManageUserAccountsModalProps> = ({ isOpen, onClose }) => {
  const { users, employees, addUserAccount, updateUserAccount, deleteUserAccount } = useData();
  const { role: actingRole } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states for creating new user
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Employee');
  const [newTitle, setNewTitle] = useState('');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');

  // Editing custom permissions state
  const [customPerms, setCustomPerms] = useState<Permission[]>([]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    await addUserAccount({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      title: newTitle.trim() || `${newRole} Specialist`,
      employeeId: newEmployeeId || undefined,
      departmentName: newDepartmentName || undefined,
      status: 'Active',
    });

    setNewName('');
    setNewEmail('');
    setNewRole('Employee');
    setNewTitle('');
    setNewEmployeeId('');
    setNewDepartmentName('');
    setIsCreating(false);
  };

  const handleRoleChange = async (userId: string, targetRole: UserRole) => {
    await updateUserAccount(userId, { role: targetRole });
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    await updateUserAccount(user.id, { status: nextStatus });
  };

  const handleDeleteUser = async (user: User) => {
    if (user.role === 'Super Admin' && users.filter(u => u.role === 'Super Admin').length <= 1) {
      alert('Cannot delete the primary Super Admin account.');
      return;
    }
    if (confirm(`Are you sure you want to permanently revoke credentials for ${user.name}?`)) {
      await deleteUserAccount(user.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#e5e7eb] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f2f5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111827]">
                  User Accounts, Roles & Security Governance
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Super Admin Console
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                Provision enterprise login access, grant role privileges, and enforce access control policies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="p-4 bg-[#fafbfc] border-b border-[#f0f2f5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search user, email, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-semibold text-[#374151] focus:outline-hidden"
            >
              <option value="all">All Roles ({users.length})</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            {isCreating ? 'Cancel Provisioning' : 'Create User Account'}
          </Button>
        </div>

        {/* CREATE USER FORM ACCORDION */}
        {isCreating && (
          <form onSubmit={handleCreateUser} className="p-5 bg-zinc-50 border-b border-[#e5e7eb] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-4 h-4 text-purple-600" />
                Provision New Portal Account
              </span>
              <span className="text-[11px] text-[#6b7280]">Assign corporate identity and credentials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.m@nexora.internal"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">System Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-bold text-[#111827] focus:outline-hidden focus:border-black"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Staff Security Architect"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">Link Directory Employee</label>
                <select
                  value={newEmployeeId}
                  onChange={(e) => {
                    setNewEmployeeId(e.target.value);
                    const emp = employees.find(em => em.id === e.target.value);
                    if (emp) {
                      setNewName(`${emp.firstName} ${emp.lastName}`);
                      setNewEmail(emp.email);
                      setNewDepartmentName(emp.department);
                      setNewTitle(emp.role);
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                >
                  <option value="">-- Optional: Link to Existing Staff --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.role} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering & DevOps"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm & Create Account
              </Button>
            </div>
          </form>
        )}

        {/* USER LIST TABLE */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3">User & Identity</th>
                <th className="px-4 py-3">Role Assignment</th>
                <th className="px-4 py-3">Title & Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#111827] flex items-center gap-1.5">
                          {user.name}
                          {user.role === 'Super Admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              CEO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#9ca3af]" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 bg-white border border-[#e5e7eb] rounded-lg text-xs font-bold text-[#111827] shadow-2xs hover:border-black cursor-pointer focus:outline-hidden"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-[#374151] font-medium">{user.title || 'Enterprise Specialist'}</div>
                    <div className="text-[11px] text-[#6b7280]">{user.departmentName || 'Corporate Operations'}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={user.status === 'Suspended' ? 'danger' : 'success'}>
                        {user.status === 'Suspended' ? 'Suspended' : 'Active'}
                      </Badge>
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6b7280]">
                    <Users className="w-8 h-8 mx-auto text-[#9ca3af] mb-2" />
                    <p className="font-semibold">No user accounts found</p>
                    <p className="text-xs text-[#9ca3af]">Try adjusting your search query or role filter</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0f2f5] bg-white flex items-center justify-between text-xs text-[#6b7280]">
          <span>
            Total Registered Users: <strong className="text-[#111827]">{users.length}</strong> (Super Admins: {users.filter(u => u.role === 'Super Admin').length})
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
