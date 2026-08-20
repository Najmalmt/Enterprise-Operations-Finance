import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  UserCheck,
  Check,
  X,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Users,
  Edit2,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Settings2,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { RequestLeaveModal } from '../components/modals/RequestLeaveModal';
import { ManualAttendanceModal } from '../components/modals/ManualAttendanceModal';
import { PrepareLeaveModal } from '../components/modals/PrepareLeaveModal';
import { ManageLeaveTypesModal } from '../components/modals/ManageLeaveTypesModal';
import { HRReportsModal } from '../components/modals/HRReportsModal';
import { AttendanceRecord, LeaveRequest } from '../types';

export const AttendancePage: React.FC = () => {
  const {
    attendance,
    leaveRequests,
    leavePolicies,
    projects,
    employees,
    clockIn,
    clockOut,
    reviewLeaveRequest,
    recommendLeaveRequest
  } = useData();
  const { currentUser, hasPermission, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'balances'>('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showManualAttendanceModal, setShowManualAttendanceModal] = useState(false);
  const [showManageLeaveTypesModal, setShowManageLeaveTypesModal] = useState(false);
  const [showHRReportsModal, setShowHRReportsModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);
  const [preparingLeave, setPreparingLeave] = useState<LeaveRequest | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [viewScope, setViewScope] = useState<'all' | 'my_team'>('all');

  const canApproveLeaves = hasPermission('approve_leave');
  const isTeamLead = role === 'Team Lead';
  const isHRExecutive = role === 'HR Executive';
  const canManageAttendance = role === 'Super Admin' || role === 'HR Manager' || role === 'HR Executive';
  const canManageLeavePolicies = role === 'Super Admin' || role === 'HR Manager';
  const canViewReports = role === 'Super Admin' || role === 'HR Manager' || role === 'HR Executive';

  // Find team member IDs for the current user (if Team Lead or PM)
  const myLeadProjects = projects.filter(p => p.leadId === currentUser?.id || p.teamMemberIds?.includes(currentUser?.id || ''));
  const myTeamMemberIds = Array.from(
    new Set(myLeadProjects.flatMap(p => p.teamMemberIds || []).concat(currentUser?.id ? [currentUser.id] : []))
  );

  // Check if current user is clocked in
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayAttendance = attendance.find(
    a => a.employeeId === currentUser?.id && a.date === todayStr
  );
  const isClockedIn = !!userTodayAttendance && !userTodayAttendance.checkOut;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockToggle = async () => {
    if (!currentUser) return;
    if (isClockedIn) {
      await clockOut(currentUser.id);
    } else {
      await clockIn(currentUser.id, currentUser.name, currentUser.departmentName || 'Engineering');
    }
  };

  const displayedAttendance = attendance.filter(att => {
    if (viewScope === 'my_team' && myTeamMemberIds.length > 0) {
      return myTeamMemberIds.includes(att.employeeId) || att.employeeName.toLowerCase().includes(currentUser?.name?.toLowerCase() || '');
    }
    return true;
  });

  const displayedLeaves = leaveRequests.filter(leave => {
    if (viewScope === 'my_team' && myTeamMemberIds.length > 0) {
      return myTeamMemberIds.includes(leave.employeeId) || leave.employeeName.toLowerCase().includes(currentUser?.name?.toLowerCase() || '');
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Workforce Attendance & Leave Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 font-mono">
              {currentTime}
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Real-time biometric & remote check-in logs, HR Executive preparation queues, and PTO records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Reports (HR Manager & Executive) */}
          {canViewReports && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowHRReportsModal(true)}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
              HR Reports
            </Button>
          )}

          {/* Manage Leave Types & Policies (HR Manager & Admin) */}
          {canManageLeavePolicies && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowManageLeaveTypesModal(true)}
            >
              <Settings2 className="w-3.5 h-3.5 mr-1.5" />
              Leave Policies
            </Button>
          )}

          {/* Record / Correct Attendance (HR Executive / Manager) */}
          {canManageAttendance && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditingAttendance(null);
                setShowManualAttendanceModal(true);
              }}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Record / Correct
            </Button>
          )}

          {/* Clock In / Out Banner */}
          <button
            onClick={handleClockToggle}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isClockedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                : 'bg-black hover:bg-zinc-800 text-white shadow-xs'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isClockedIn ? 'Clock Out for Day' : 'Clock In Now'}
          </button>

          <Button variant="primary" size="sm" onClick={() => setShowLeaveModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Request Time Off
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Present Today</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">94.8%</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">235 engineers on deck</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Remote Hub Deployments</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">42</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Verified VPN session</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">On Approved Leave</span>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">13</p>
          <p className="text-[11px] text-[#6b7280] mt-1">PTO & medical coverage</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Mean Shift Duration</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">8.2 hrs</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Productivity baseline</p>
        </div>
      </div>

      {/* Tabs and Team Scope Filter */}
      <div className="border-b border-[#e5e7eb] flex items-center justify-between gap-4 text-xs font-semibold">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'attendance'
                ? 'border-black text-black'
                : 'border-transparent text-[#6b7280] hover:text-black'
            }`}
          >
            Daily Attendance Logs ({displayedAttendance.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'leaves'
                ? 'border-black text-black'
                : 'border-transparent text-[#6b7280] hover:text-black'
            }`}
          >
            Leave & PTO Requests ({displayedLeaves.length})
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'balances'
                ? 'border-black text-black'
                : 'border-transparent text-[#6b7280] hover:text-black'
            }`}
          >
            Employee Leave Balances & Policies
          </button>
        </div>

        {/* Scope selector */}
        {(isTeamLead || role === 'Project Manager') && (
          <div className="flex items-center gap-1.5 pb-2">
            <button
              onClick={() => setViewScope('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                viewScope === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f3f4f6]'
              }`}
            >
              All Workforce
            </button>
            <button
              onClick={() => setViewScope('my_team')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors flex items-center gap-1 ${
                viewScope === 'my_team'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f3f4f6]'
              }`}
            >
              <Users className="w-3 h-3" /> My Squad ({myTeamMemberIds.length})
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: ATTENDANCE LOGS */}
      {activeTab === 'attendance' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Check In</th>
                  <th className="px-4 py-3">Check Out</th>
                  <th className="px-4 py-3">Working Hours</th>
                  <th className="px-5 py-3">Status</th>
                  {canManageAttendance && <th className="px-5 py-3 text-right">Adjustment</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {displayedAttendance.map((att) => (
                  <tr key={att.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#111827]">
                      {att.employeeName}
                    </td>
                    <td className="px-4 py-3.5 text-[#4b5563]">
                      {att.department}
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280] font-mono">
                      {formatDate(att.date)}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-medium text-[#111827]">
                      {att.checkIn}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#6b7280]">
                      {att.checkOut || <span className="text-emerald-700 font-semibold">Active Session</span>}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold">
                      {att.totalHours ? `${att.totalHours} hrs` : 'In progress'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={getStatusBadgeVariant(att.status)} size="sm">
                        {att.status}
                      </Badge>
                    </td>
                    {canManageAttendance && (
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setEditingAttendance(att);
                            setShowManualAttendanceModal(true);
                          }}
                          className="px-2 py-1 rounded border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[11px] font-semibold text-[#374151] cursor-pointer inline-flex items-center gap-1"
                          title="Correct attendance record"
                        >
                          <Edit2 className="w-3 h-3 text-[#6b7280]" /> Correct
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Employee & Department</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Duration & Dates</th>
                  <th className="px-4 py-3">Reason / Context</th>
                  <th className="px-4 py-3">Review & Endorsements</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {displayedLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#111827]">{leave.employeeName}</p>
                      <p className="text-[10px] text-[#6b7280]">{leave.department}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#111827]">
                      {leave.leaveType}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#111827]">{leave.daysCount} days</span>
                      <p className="text-[10px] text-[#6b7280] font-mono mt-0.5">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[#4b5563] max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3.5 space-y-1">
                      {/* HR Executive Preparation Status */}
                      {leave.hrReviewStatus ? (
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            leave.hrReviewStatus === 'Prepared for HR Manager'
                              ? 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {leave.hrReviewStatus}
                          </span>
                          {leave.hrReviewNote && (
                            <p className="text-[10px] text-[#6b7280] italic truncate max-w-xs" title={leave.hrReviewNote}>
                              {leave.hrReviewNote}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#9ca3af] italic block">Awaiting HR prep</span>
                      )}

                      {/* Lead Recommendation */}
                      {leave.leadRecommendation && (
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            leave.leadRecommendation === 'Recommended'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            {leave.leadRecommendation === 'Recommended' ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                            Lead: {leave.leadRecommendation}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getStatusBadgeVariant(leave.status)} size="sm">
                        {leave.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {leave.status === 'Pending' ? (
                        canApproveLeaves ? (
                          /* HR Manager / Super Admin Final Clearance */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => reviewLeaveRequest(leave.id, 'Approved')}
                              className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer"
                              title="Grant final HR approval"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reviewLeaveRequest(leave.id, 'Rejected', 'Managerial policy conflict')}
                              className="px-2.5 py-1 rounded border border-[#e5e7eb] text-rose-600 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer"
                              title="Reject leave"
                            >
                              Reject
                            </button>
                          </div>
                        ) : isHRExecutive ? (
                          /* HR Executive Prepare for HR Manager Action */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreparingLeave(leave)}
                              className="px-2.5 py-1 rounded bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                              title="Review & Prepare for HR Manager"
                            >
                              <FileCheck className="w-3 h-3" /> Prepare for Manager
                            </button>
                          </div>
                        ) : isTeamLead ? (
                          /* Team Lead Recommendation Actions */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => recommendLeaveRequest(leave.id, 'Recommended', 'Sprint coverage confirmed')}
                              className="px-2.5 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                              title="Recommend leave to HR"
                            >
                              <ThumbsUp className="w-2.5 h-2.5" /> Recommend
                            </button>
                            <button
                              onClick={() => recommendLeaveRequest(leave.id, 'Flagged', 'Critical delivery deadline')}
                              className="px-2.5 py-1 rounded border border-[#e5e7eb] text-rose-700 hover:bg-rose-50 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                              title="Flag concern for HR"
                            >
                              <ThumbsDown className="w-2.5 h-2.5" /> Flag
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Pending Clearance
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-[#6b7280]">{leave.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: EMPLOYEE LEAVE BALANCES & POLICY OVERVIEW */}
      {activeTab === 'balances' && (
        <div className="space-y-6">
          {/* Active Policies Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {leavePolicies.map(policy => (
              <div key={policy.id} className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black">{policy.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${policy.isPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-zinc-100 text-zinc-700'}`}>
                    {policy.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <p className="text-xl font-bold font-mono text-black mt-2">
                  {policy.daysPerYear} <span className="text-xs font-normal text-[#6b7280]">days / year</span>
                </p>
                <p className="text-[11px] text-[#6b7280] mt-1 truncate">{policy.description}</p>
              </div>
            ))}
          </div>

          {/* Employee Balances Table */}
          <Card noPadding>
            <div className="p-4 border-b border-[#f0f2f5] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-black">Workforce Leave Balances Roster</h3>
                <p className="text-[11px] text-[#6b7280]">Real-time accrued, consumed, and remaining PTO quotas across all personnel</p>
              </div>
              {canManageLeavePolicies && (
                <Button variant="secondary" size="sm" onClick={() => setShowManageLeaveTypesModal(true)}>
                  <Settings2 className="w-3 h-3 mr-1" /> Configure Allowances
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                  <tr>
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Paid Annual Leave</th>
                    <th className="px-4 py-3">Sick Leave</th>
                    <th className="px-4 py-3">Casual Leave</th>
                    <th className="px-4 py-3">Total Taken (YTD)</th>
                    <th className="px-5 py-3 text-right">Quota Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {employees.map((emp) => {
                    const empLeaves = leaveRequests.filter(l => l.employeeId === emp.id && l.status === 'Approved');
                    const totalDaysTaken = empLeaves.reduce((acc, curr) => acc + curr.daysCount, 0);
                    const annualTaken = empLeaves.filter(l => l.leaveType.toLowerCase().includes('annual') || l.leaveType.toLowerCase().includes('vacation')).reduce((acc, curr) => acc + curr.daysCount, 0);
                    const sickTaken = empLeaves.filter(l => l.leaveType.toLowerCase().includes('sick') || l.leaveType.toLowerCase().includes('medical')).reduce((acc, curr) => acc + curr.daysCount, 0);
                    const casualTaken = empLeaves.filter(l => l.leaveType.toLowerCase().includes('casual')).reduce((acc, curr) => acc + curr.daysCount, 0);

                    const annualRemaining = Math.max(0, 18 - annualTaken);
                    const sickRemaining = Math.max(0, 10 - sickTaken);
                    const casualRemaining = Math.max(0, 6 - casualTaken);

                    return (
                      <tr key={emp.id} className="hover:bg-[#fafbfc] transition-colors">
                        <td className="px-5 py-3 font-bold text-black">
                          {emp.firstName} {emp.lastName}
                        </td>
                        <td className="px-4 py-3 text-[#4b5563]">{emp.department}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-black">{annualRemaining}</span>
                          <span className="text-[#9ca3af] font-mono"> / 18 left</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-black">{sickRemaining}</span>
                          <span className="text-[#9ca3af] font-mono"> / 10 left</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold text-black">{casualRemaining}</span>
                          <span className="text-[#9ca3af] font-mono"> / 6 left</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-zinc-800">
                          {totalDaysTaken} days
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            annualRemaining > 5 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {annualRemaining > 5 ? 'Healthy Quota' : 'Low Quota'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <RequestLeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />

      <ManualAttendanceModal
        isOpen={showManualAttendanceModal}
        onClose={() => {
          setShowManualAttendanceModal(false);
          setEditingAttendance(null);
        }}
        initialRecord={editingAttendance}
      />

      <PrepareLeaveModal
        isOpen={!!preparingLeave}
        onClose={() => setPreparingLeave(null)}
        leaveRequest={preparingLeave}
      />

      <ManageLeaveTypesModal
        isOpen={showManageLeaveTypesModal}
        onClose={() => setShowManageLeaveTypesModal(false)}
      />

      <HRReportsModal
        isOpen={showHRReportsModal}
        onClose={() => setShowHRReportsModal(false)}
      />
    </div>
  );
};
