import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  MoreVertical,
  Mail,
  Building2,
  DollarSign,
  Briefcase,
  ChevronRight,
  BarChart3,
  Edit,
  Plus,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Employee, EmployeeStatus, Department } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { AddEmployeeModal } from '../components/modals/AddEmployeeModal';
import { EmployeeDetailDrawer } from '../components/modals/EmployeeDetailDrawer';
import { EditDepartmentModal } from '../components/modals/EditDepartmentModal';
import { HRReportsModal } from '../components/modals/HRReportsModal';

export const EmployeesPage: React.FC = () => {
  const { employees, departments, projects, addDepartment } = useData();
  const { currentUser, hasPermission, role } = useAuth();

  const [activeMainTab, setActiveMainTab] = useState<'personnel' | 'departments'>('personnel');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'salary' | 'startDate'>('name');
  const [viewScope, setViewScope] = useState<'all' | 'my_team'>('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showHRReportsModal, setShowHRReportsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const canCreateEmployee = hasPermission('create_employee');
  const canManageDepartments = role === 'Super Admin' || role === 'HR Manager';
  const canViewReports = role === 'Super Admin' || role === 'HR Manager' || role === 'HR Executive';
  const canViewSalaries = role === 'Super Admin' || role === 'Finance Manager' || role === 'Accountant';
  const isTeamLead = role === 'Team Lead';

  // Find squad member IDs
  const myLeadProjects = projects.filter(p => p.leadId === currentUser?.id || p.teamMemberIds?.includes(currentUser?.id || ''));
  const myTeamMemberIds = Array.from(
    new Set(myLeadProjects.flatMap(p => p.teamMemberIds || []).concat(currentUser?.id ? [currentUser.id] : []))
  );

  // Filtered & Sorted employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
        const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

        const matchesScope =
          viewScope === 'all' ||
          myTeamMemberIds.includes(emp.id) ||
          emp.id === currentUser?.id;

        return matchesSearch && matchesDept && matchesStatus && matchesScope;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.lastName.localeCompare(b.lastName);
        if (sortBy === 'salary') return b.salary - a.salary;
        if (sortBy === 'startDate') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        return 0;
      });
  }, [employees, searchTerm, selectedDept, selectedStatus, sortBy, viewScope, myTeamMemberIds, currentUser]);

  // Statistics
  const activeCount = filteredEmployees.filter(e => e.status === 'Active').length;
  const totalPayroll = filteredEmployees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = filteredEmployees.length > 0 ? totalPayroll / filteredEmployees.length : 0;

  const exportCSV = () => {
    const headers = canViewSalaries
      ? ['ID,First Name,Last Name,Email,Role,Department,Salary,Status,Start Date\n']
      : ['ID,First Name,Last Name,Email,Role,Department,Status,Start Date\n'];
    const rows = filteredEmployees.map(e =>
      canViewSalaries
        ? `"${e.id}","${e.firstName}","${e.lastName}","${e.email}","${e.role}","${e.department}",${e.salary},"${e.status}","${e.startDate}"`
        : `"${e.id}","${e.firstName}","${e.lastName}","${e.email}","${e.role}","${e.department}","${e.status}","${e.startDate}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-employee-directory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleCreateDepartment = async () => {
    const deptName = prompt('Enter new department name:');
    if (!deptName || !deptName.trim()) return;
    const deptHead = prompt('Enter Department Head / Manager name:', 'David Vance') || 'David Vance';
    const description = prompt('Enter brief department mission / description:', 'Core operational division') || 'Core operational division';
    await addDepartment({
      name: deptName.trim(),
      code: deptName.trim().substring(0, 3).toUpperCase(),
      headName: deptHead.trim(),
      headEmail: `${deptHead.toLowerCase().replace(/\s+/g, '.')}@nexora.io`,
      description: description.trim(),
      budget: 250000,
      color: '#3b82f6'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Human Capital & Organization Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800">
              {filteredEmployees.length} Personnel • {departments.length} Departments
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Enterprise workforce roster, departmental structures, and HR operational records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(isTeamLead || role === 'Project Manager') && (
            <div className="flex items-center gap-1 border border-[#e5e7eb] rounded-lg p-0.5 bg-[#f8f9fa]">
              <button
                onClick={() => setViewScope('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewScope === 'all'
                    ? 'bg-black text-white'
                    : 'text-[#4b5563] hover:text-black'
                }`}
              >
                All Personnel
              </button>
              <button
                onClick={() => setViewScope('my_team')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  viewScope === 'my_team'
                    ? 'bg-black text-white'
                    : 'text-[#4b5563] hover:text-black'
                }`}
              >
                <Users className="w-3 h-3" /> My Squad ({myTeamMemberIds.length})
              </button>
            </div>
          )}

          {canViewReports && (
            <Button variant="secondary" size="sm" onClick={() => setShowHRReportsModal(true)}>
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              HR Reports
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Directory
          </Button>

          {canManageDepartments && activeMainTab === 'departments' && (
            <Button variant="primary" size="sm" onClick={handleCreateDepartment}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Department
            </Button>
          )}

          {canCreateEmployee && activeMainTab === 'personnel' && (
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Onboard Employee
            </Button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-[#e5e7eb] flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveMainTab('personnel')}
          className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === 'personnel'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Personnel Roster ({filteredEmployees.length})
        </button>
        <button
          onClick={() => setActiveMainTab('departments')}
          className={`py-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeMainTab === 'departments'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Department Structure ({departments.length})
        </button>
      </div>

      {activeMainTab === 'personnel' ? (
        <>
          {/* Roster Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
                {viewScope === 'my_team' ? 'Squad Headcount' : 'Total Headcount'}
              </span>
              <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{filteredEmployees.length}</p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">{activeCount} actively deployed</p>
            </div>

            {canViewSalaries ? (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Annualized Payroll</span>
                  <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalPayroll, true)}</p>
                  <p className="text-[11px] text-[#6b7280] mt-1">{formatCurrency(totalPayroll / 12, true)} / month gross</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Average Compensation</span>
                  <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(avgSalary, true)}</p>
                  <p className="text-[11px] text-[#6b7280] mt-1">Market percentile: 85th</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Squad Projects</span>
                  <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{myLeadProjects.length}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">In progress & on schedule</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
                  <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Sprint Velocity</span>
                  <p className="text-2xl font-bold text-[#111827] font-mono mt-1">94.2%</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">Task completion reliability</p>
                </div>
              </>
            )}

            <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
              <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Business Units</span>
              <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{departments.length}</p>
              <p className="text-[11px] text-[#6b7280] mt-1">Cross-functional divisions</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <Card noPadding>
            <div className="p-4 border-b border-[#f0f2f5] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by engineer name, title, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Terminated">Terminated</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
                >
                  <option value="name">Sort by Name</option>
                  {canViewSalaries && <option value="salary">Sort by Compensation</option>}
                  <option value="startDate">Sort by Start Date</option>
                </select>
              </div>
            </div>

            {/* Employees Table */}
            {filteredEmployees.length === 0 ? (
              <EmptyState
                title="No personnel found"
                description="Adjust your search query or department filter to find employees."
                actionLabel="Reset Search Filters"
                onAction={() => {
                  setSearchTerm('');
                  setSelectedDept('All');
                  setSelectedStatus('All');
                  setViewScope('all');
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                    <tr>
                      <th className="px-5 py-3">Employee & Role</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned Manager</th>
                      <th className="px-4 py-3">Tenure</th>
                      <th className="px-4 py-3 text-right">{canViewSalaries ? 'Base Salary' : 'Category'}</th>
                      <th className="px-5 py-3 text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="hover:bg-[#fafbfc] transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#111827] group-hover:text-black">
                                {emp.firstName} {emp.lastName}
                              </p>
                              <p className="text-[11px] text-[#6b7280]">{emp.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#f3f4f6] text-[11px] font-medium text-[#374151]">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={getStatusBadgeVariant(emp.status)} size="sm">
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-[#4b5563]">
                          {emp.managerName || 'David Vance'}
                        </td>
                        <td className="px-4 py-3.5 text-[#6b7280] font-mono">
                          {formatDate(emp.joiningDate || emp.startDate)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono">
                          {canViewSalaries ? (
                            <span className="font-bold text-[#111827]">{formatCurrency(emp.salary)}</span>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{emp.employmentType || 'Full-Time'}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmployee(emp);
                            }}
                            className="p-1 rounded text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : (
        /* DEPARTMENTS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const members = employees.filter(e => e.department === dept.name || e.departmentId === dept.id);
              return (
                <div key={dept.id} className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-xs space-y-4 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-sm text-[#111827]">{dept.name}</h3>
                      </div>
                      {canManageDepartments && (
                        <button
                          onClick={() => setEditingDepartment(dept)}
                          className="p-1.5 rounded-lg text-[#6b7280] hover:text-black hover:bg-zinc-100 cursor-pointer"
                          title="Edit department"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#6b7280] mt-2">
                      {dept.description || 'Enterprise department division'}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f0f2f5] text-xs">
                    <div className="flex justify-between items-center text-[#6b7280]">
                      <span>Department Head:</span>
                      <span className="font-semibold text-[#111827]">{dept.headName}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#6b7280]">
                      <span>Total Members:</span>
                      <span className="font-mono font-bold text-black">{members.length} Engineers</span>
                    </div>
                  </div>

                  {/* Members preview */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Department Members</p>
                    <div className="flex flex-wrap gap-1.5">
                      {members.slice(0, 4).map(m => (
                        <span
                          key={m.id}
                          onClick={() => setSelectedEmployee(m)}
                          className="px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded text-[11px] text-zinc-700 hover:border-zinc-400 cursor-pointer"
                        >
                          {m.firstName} {m.lastName[0]}.
                        </span>
                      ))}
                      {members.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-zinc-400">
                          +{members.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Onboard Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Detail & Edit Drawer */}
      <EmployeeDetailDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      {/* Edit Department Modal */}
      <EditDepartmentModal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        department={editingDepartment}
      />

      {/* HR Reports Modal */}
      <HRReportsModal
        isOpen={showHRReportsModal}
        onClose={() => setShowHRReportsModal(false)}
      />
    </div>
  );
};
