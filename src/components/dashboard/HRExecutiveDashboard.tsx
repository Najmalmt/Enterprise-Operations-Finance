import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Edit2,
  Plus,
  Eye,
  Filter,
  Check,
  X
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';
import { AddEmployeeModal } from '../modals/AddEmployeeModal';
import { ManualAttendanceModal } from '../modals/ManualAttendanceModal';
import { PrepareLeaveModal } from '../modals/PrepareLeaveModal';
import { EmployeeDetailDrawer } from '../modals/EmployeeDetailDrawer';
import { Employee, LeaveRequest, AttendanceRecord } from '../../types';

interface HRExecutiveDashboardProps {
  onNavigate: (path: string) => void;
}

export const HRExecutiveDashboard: React.FC<HRExecutiveDashboardProps> = ({ onNavigate }) => {
  const {
    employees,
    attendance,
    leaveRequests,
    departments,
    documents
  } = useData();

  // Modals state
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);
  const [preparingLeave, setPreparingLeave] = useState<LeaveRequest | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Workforce metrics
  const activeEmployees = employees.filter(e => e.status === 'Active');
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave');
  const probationEmployees = employees.filter(e => e.status === 'Probation');

  // Leave vetting metrics
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');
  const unvettedLeaves = pendingLeaves.filter(l => !l.hrReviewStatus);
  const preparedLeaves = pendingLeaves.filter(l => l.hrReviewStatus === 'Prepared for HR Manager');

  // Today's attendance metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = attendance.filter(a => a.date === todayStr);
  const presentCount = todayLogs.filter(a => a.status === 'Present' || a.status === 'Late').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              HR Operations & Personnel Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white">
              HR Executive Console
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Day-to-day employee lifecycle management, document verification, leave preparation, and attendance logging.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button variant="primary" size="sm" onClick={() => setShowAddEmployee(true)}>
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Employee
          </Button>

          <Button variant="secondary" size="sm" onClick={() => {
            setEditingAttendance(null);
            setShowManualAttendance(true);
          }}>
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Record Attendance
          </Button>

          <Button variant="secondary" size="sm" onClick={() => onNavigate('employees')}>
            <Users className="w-3.5 h-3.5 mr-1.5" />
            Directory
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Workforce</span>
            <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-800">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-2">{employees.length}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">
            <span className="text-emerald-700 font-semibold">{activeEmployees.length} active</span> • {probationEmployees.length} probation
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Today's Check-ins</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-2">
            {presentCount > 0 ? `${presentCount} / ${employees.length}` : '94.8%'}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">
            {onLeaveEmployees.length} scheduled on leave
          </p>
        </div>

        {/* Leave Queue Pending Prep */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Leave Prep Queue</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-2">{unvettedLeaves.length}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">
            {preparedLeaves.length} prepared for HR Manager
          </p>
        </div>

        {/* Compliance Documents */}
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Employee Documents</span>
            <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-2">{documents.length}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">
            Contracts, I-9, W-4 files on record
          </p>
        </div>
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leave Preparation Queue & Attendance Corrections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Requests Vetting Queue */}
          <Card
            title="Leave Requests Vetting & Preparation Queue"
            subtitle="Preliminary review, balance verification, and preparation for HR Manager"
            headerAction={
              <Button size="sm" variant="secondary" onClick={() => onNavigate('attendance')}>
                View All Leaves <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-zinc-800">All leave requests vetted & clear</p>
                <p className="text-zinc-500 text-[11px] mt-0.5">No pending employee leave requests requiring preparation.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0f2f5]">
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]">{leave.employeeName}</span>
                        <span className="text-[10px] text-[#6b7280]">• {leave.department}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold font-mono text-[10px]">
                          {leave.daysCount}d ({leave.leaveType})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4b5563]">
                        {formatDate(leave.startDate)} to {formatDate(leave.endDate)} — <span className="italic">"{leave.reason}"</span>
                      </p>
                      {leave.hrReviewStatus ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-700 font-medium pt-0.5">
                          <ShieldCheck className="w-3 h-3 text-zinc-600" />
                          Status: <span className="font-bold">{leave.hrReviewStatus}</span> ({leave.hrReviewNote})
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Awaiting HR Executive endorsement
                        </span>
                      )}
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => setPreparingLeave(leave)}
                        className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        {leave.hrReviewStatus ? 'Edit Prep Notes' : 'Prepare for Manager'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Daily Attendance Logs & Fast Correction */}
          <Card
            title="Workforce Daily Attendance Logs"
            subtitle="Real-time shift recordings and manual audit corrections"
            headerAction={
              <Button size="sm" variant="secondary" onClick={() => onNavigate('attendance')}>
                Full Attendance Log <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Check In / Out</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {attendance.slice(0, 6).map(att => (
                    <tr key={att.id} className="hover:bg-[#fafbfc]">
                      <td className="py-2.5 px-3 font-semibold text-[#111827]">{att.employeeName}</td>
                      <td className="py-2.5 px-3 text-[#6b7280]">{att.department}</td>
                      <td className="py-2.5 px-3 text-[#6b7280] font-mono">{formatDate(att.date)}</td>
                      <td className="py-2.5 px-3 font-mono text-[#374151]">
                        {att.checkIn} - {att.checkOut || 'Active'}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={getStatusBadgeVariant(att.status)} size="sm">
                          {att.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setEditingAttendance(att);
                            setShowManualAttendance(true);
                          }}
                          className="px-2 py-0.5 rounded border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[10px] font-semibold text-[#374151] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-2.5 h-2.5 text-[#6b7280]" /> Correct
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Employee Directory Quick Access & Document Compliance */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <Card title="Department Allocation" subtitle="Workforce headcounts by business unit">
            <div className="space-y-2.5 text-xs">
              {departments.map(dept => {
                const count = employees.filter(e => e.department === dept.name || e.departmentId === dept.id).length;
                return (
                  <div key={dept.id} className="p-3 rounded-lg border border-[#e5e7eb] bg-white flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#111827]">{dept.name}</p>
                      <p className="text-[10px] text-[#6b7280]">Lead: {dept.headName || 'Assigned'}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-zinc-100 font-mono font-bold text-zinc-800 text-xs">
                      {count} staff
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Compliance Documents Summary */}
          <Card
            title="Recent Personnel Documents"
            subtitle="Cataloged contracts & I-9 slips"
            headerAction={
              <Button size="sm" variant="secondary" onClick={() => onNavigate('employees')}>
                Manage <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            }
          >
            <div className="space-y-2.5 text-xs">
              {documents.slice(0, 5).map(doc => (
                <div key={doc.id} className="p-2.5 rounded-lg border border-[#e5e7eb] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-[#111827] truncate">{doc.name}</p>
                      <p className="text-[10px] text-[#6b7280]">{doc.employeeName} • {doc.type}</p>
                    </div>
                  </div>
                  <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} size="sm">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Roster Drawer View */}
          <Card title="Quick Profile Search" subtitle="Click to inspect documents or adjust basic info">
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {employees.slice(0, 8).map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="p-2 rounded-lg hover:bg-[#fafbfc] border border-transparent hover:border-[#e5e7eb] cursor-pointer flex items-center justify-between transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[10px] text-[#6b7280]">{emp.role}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
      />

      <ManualAttendanceModal
        isOpen={showManualAttendance}
        onClose={() => {
          setShowManualAttendance(false);
          setEditingAttendance(null);
        }}
        initialRecord={editingAttendance}
      />

      <PrepareLeaveModal
        isOpen={!!preparingLeave}
        onClose={() => setPreparingLeave(null)}
        leaveRequest={preparingLeave}
      />

      <EmployeeDetailDrawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />
    </div>
  );
};
