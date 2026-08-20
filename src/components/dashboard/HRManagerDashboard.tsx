import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BarChart3,
  Settings2,
  ArrowRight,
  ChevronRight,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Layers,
  FileCheck
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';
import { AddEmployeeModal } from '../modals/AddEmployeeModal';
import { EditDepartmentModal } from '../modals/EditDepartmentModal';
import { ManageLeaveTypesModal } from '../modals/ManageLeaveTypesModal';
import { HRReportsModal } from '../modals/HRReportsModal';
import { EmployeeDetailDrawer } from '../modals/EmployeeDetailDrawer';
import { Employee, Department } from '../../types';

interface HRManagerDashboardProps {
  onNavigate: (path: string) => void;
}

export const HRManagerDashboard: React.FC<HRManagerDashboardProps> = ({ onNavigate }) => {
  const {
    employees,
    departments,
    leaveRequests,
    attendance,
    reviewLeaveRequest
  } = useData();

  // Modals state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showManageLeaveTypes, setShowManageLeaveTypes] = useState(false);
  const [showHRReports, setShowHRReports] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Workforce stats
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const probationCount = employees.filter(e => e.status === 'Probation').length;

  // Leave approval queues
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const preparedLeaves = pendingLeaves.filter(l => l.hrReviewStatus === 'Prepared for HR Manager');

  // Attendance stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = attendance.filter(a => a.date === todayStr);
  const presentToday = todayLogs.filter(a => a.status === 'Present' || a.status === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              HR Operations & Governance Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white">
              HR Manager
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Workforce personnel lifecycle, department structures, leave clearance, and HR operational reports.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowHRReports(true)}>
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            HR Reports
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setShowManageLeaveTypes(true)}>
            <Settings2 className="w-3.5 h-3.5 mr-1.5" />
            Leave Policies
          </Button>

          <Button variant="primary" size="sm" onClick={() => setShowAddEmployee(true)}>
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Onboard Employee
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Total Headcount</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{employees.length}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">{activeCount} actively deployed</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Departments</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{departments.length}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Cross-functional units</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Pending Leave Decisions</span>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{pendingLeaves.length}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{preparedLeaves.length} prepped by HR Exec</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb] shadow-xs">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Workforce Present Today</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{presentToday}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{onLeaveCount} on approved PTO</p>
        </div>
      </div>

      {/* Leave Approvals Queue & Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Requests Clearance Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card noPadding>
            <div className="p-4 border-b border-[#f0f2f5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-black" />
                <h3 className="font-bold text-xs text-black">Leave Approvals & Clearance Queue</h3>
                {pendingLeaves.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    {pendingLeaves.length} Action Needed
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigate('/leave-requests')}
                className="text-xs font-semibold text-[#6b7280] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                View Full Roster <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6b7280]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No pending leave requests requiring clearance. All requests are processed.
              </div>
            ) : (
              <div className="divide-y divide-[#f0f2f5]">
                {pendingLeaves.slice(0, 5).map((leave) => (
                  <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-black">{leave.employeeName}</span>
                        <span className="text-[11px] text-[#6b7280]">({leave.department})</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-medium text-zinc-800">
                          {leave.leaveType} • {leave.daysCount} days
                        </span>
                      </div>
                      <p className="text-xs text-[#4b5563] mt-1">{leave.reason}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#6b7280]">
                        <span>{formatDate(leave.startDate)} to {formatDate(leave.endDate)}</span>
                        {leave.hrReviewStatus && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> {leave.hrReviewStatus}
                          </span>
                        )}
                        {leave.leadRecommendation && (
                          <span className="text-zinc-700 font-semibold flex items-center gap-0.5">
                            <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" /> Lead: {leave.leadRecommendation}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => reviewLeaveRequest(leave.id, 'Approved')}
                        className="px-3 py-1.5 rounded bg-black text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewLeaveRequest(leave.id, 'Rejected', 'Rejected by HR Manager')}
                        className="px-3 py-1.5 rounded border border-[#e5e7eb] text-rose-600 text-xs font-semibold hover:bg-rose-50 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Joiners & Personnel */}
          <Card noPadding>
            <div className="p-4 border-b border-[#f0f2f5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-black" />
                <h3 className="font-bold text-xs text-black">Active Workforce Directory</h3>
              </div>
              <button
                onClick={() => onNavigate('/employees')}
                className="text-xs font-semibold text-[#6b7280] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                Manage Directory <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-[#f0f2f5]">
              {employees.slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="p-3.5 px-4 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-black">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[11px] text-[#6b7280]">{emp.role} • {emp.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(emp.status)} size="sm">
                      {emp.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-[#9ca3af]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Departments Roster & Quick Actions */}
        <div className="space-y-6">
          <Card noPadding>
            <div className="p-4 border-b border-[#f0f2f5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-black" />
                <h3 className="font-bold text-xs text-black">Departmental Structure</h3>
              </div>
              <button
                onClick={() => onNavigate('/departments')}
                className="text-xs font-semibold text-[#6b7280] hover:text-black flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {departments.map((dept) => {
                const members = employees.filter(e => e.department === dept.name || e.departmentId === dept.id);
                return (
                  <div
                    key={dept.id}
                    onClick={() => setEditingDepartment(dept)}
                    className="p-3 rounded-lg border border-[#e5e7eb] hover:border-zinc-300 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-black">{dept.name}</span>
                      <span className="text-[11px] font-mono font-semibold text-zinc-800">{members.length} members</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280]">Head: {dept.headName}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* HR Governance Quick Links */}
          <div className="p-5 rounded-xl bg-zinc-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">HR Governance</span>
            </div>
            <h4 className="font-bold text-sm">Personnel Policy & Audit Compliance</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ensure departmental staffing limits, PTO caps, contract documentation, and active leave records adhere to company guidelines.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setShowHRReports(true)}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Generate Comprehensive HR Audit</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => setShowManageLeaveTypes(true)}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors text-left flex items-center justify-between cursor-pointer"
              >
                <span>Modify Annual Leave Quota Rules</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboard Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
      />

      {/* Edit Department Modal */}
      <EditDepartmentModal
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        department={editingDepartment}
      />

      {/* Manage Leave Types Modal */}
      <ManageLeaveTypesModal
        isOpen={showManageLeaveTypes}
        onClose={() => setShowManageLeaveTypes(false)}
      />

      {/* HR Reports Modal */}
      <HRReportsModal
        isOpen={showHRReports}
        onClose={() => setShowHRReports(false)}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDetailDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
