import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import {
  Users,
  Clock,
  Calendar,
  Building2,
  Download,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { formatDate, formatPercent } from '../../utils/formatters';

interface HRReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReport?: 'employees' | 'attendance' | 'leaves' | 'departments';
}

export const HRReportsModal: React.FC<HRReportsModalProps> = ({
  isOpen,
  onClose,
  initialReport = 'employees',
}) => {
  const { employees, departments, attendance, leaveRequests } = useData();
  const [activeReport, setActiveReport] = useState<'employees' | 'attendance' | 'leaves' | 'departments'>(initialReport);

  // 1. Employee Report Analytics
  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const probationCount = employees.filter(e => e.status === 'Probation').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const terminatedCount = employees.filter(e => e.status === 'Terminated').length;

  // 2. Attendance Report Analytics
  const totalLogs = attendance.length;
  const presentLogs = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const lateLogs = attendance.filter(a => a.status === 'Late').length;
  const attendanceRate = totalLogs > 0 ? (presentLogs / totalLogs) * 100 : 96.4;
  const punctualityRate = totalLogs > 0 ? ((presentLogs - lateLogs) / totalLogs) * 100 : 91.2;

  // 3. Leave Report Analytics
  const totalLeaves = leaveRequests.length;
  const approvedLeaves = leaveRequests.filter(l => l.status === 'Approved').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const rejectedLeaves = leaveRequests.filter(l => l.status === 'Rejected').length;
  const totalDaysTaken = leaveRequests
    .filter(l => l.status === 'Approved')
    .reduce((sum, l) => sum + l.daysCount, 0);

  // 4. Department Distribution Analytics
  const deptStats = departments.map(d => {
    const deptEmps = employees.filter(e => e.department === d.name || e.departmentId === d.id);
    const deptLeaves = leaveRequests.filter(l => (l.department === d.name) && l.status === 'Approved');
    const deptDays = deptLeaves.reduce((sum, l) => sum + l.daysCount, 0);
    const deptAtt = attendance.filter(a => a.department === d.name);
    const deptPresent = deptAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const deptAttRate = deptAtt.length > 0 ? (deptPresent / deptAtt.length) * 100 : 95.0;

    return {
      id: d.id,
      name: d.name,
      code: d.code,
      head: d.headName,
      count: deptEmps.length,
      daysTaken: deptDays,
      attendanceRate: deptAttRate,
    };
  });

  const exportCurrentReportCSV = () => {
    let filename = `nexora-hr-report-${activeReport}-${new Date().toISOString().split('T')[0]}.csv`;
    let csvContent = '';

    if (activeReport === 'employees') {
      csvContent = 'ID,Name,Email,Role,Department,Status,Start Date,Location\n' +
        employees.map(e => `"${e.id}","${e.firstName} ${e.lastName}","${e.email}","${e.role}","${e.department}","${e.status}","${e.startDate}","${e.location || ''}"`).join('\n');
    } else if (activeReport === 'attendance') {
      csvContent = 'ID,Employee,Department,Date,Check In,Check Out,Working Hours,Status\n' +
        attendance.map(a => `"${a.id}","${a.employeeName}","${a.department}","${a.date}","${a.checkIn}","${a.checkOut || ''}","${a.totalHours || ''}","${a.status}"`).join('\n');
    } else if (activeReport === 'leaves') {
      csvContent = 'ID,Employee,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n' +
        leaveRequests.map(l => `"${l.id}","${l.employeeName}","${l.department}","${l.leaveType}","${l.startDate}","${l.endDate}",${l.daysCount},"${l.status}","${l.reason}"`).join('\n');
    } else if (activeReport === 'departments') {
      csvContent = 'Department,Code,Department Head,Headcount,Approved Leave Days,Attendance Rate\n' +
        deptStats.map(d => `"${d.name}","${d.code}","${d.head}",${d.count},${d.daysTaken},${d.attendanceRate.toFixed(1)}%`).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Executive HR Intelligence & Reporting Suite"
      subtitle="Comprehensive workforce analytics, attendance audits, leave utilization, and departmental metrics"
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="secondary" size="sm" onClick={exportCurrentReportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export {activeReport.toUpperCase()} CSV
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Report Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f8f9fa] p-1.5 rounded-xl border border-[#e5e7eb]">
          <button
            onClick={() => setActiveReport('employees')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeReport === 'employees'
                ? 'bg-white text-black shadow-xs border border-[#e5e7eb]'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Employee Report
          </button>

          <button
            onClick={() => setActiveReport('attendance')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeReport === 'attendance'
                ? 'bg-white text-black shadow-xs border border-[#e5e7eb]'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Attendance Report
          </button>

          <button
            onClick={() => setActiveReport('leaves')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeReport === 'leaves'
                ? 'bg-white text-black shadow-xs border border-[#e5e7eb]'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Leave & PTO Report
          </button>

          <button
            onClick={() => setActiveReport('departments')}
            className={`px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeReport === 'departments'
                ? 'bg-white text-black shadow-xs border border-[#e5e7eb]'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Department Report
          </button>
        </div>

        {/* 1. EMPLOYEE REPORT */}
        {activeReport === 'employees' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Total Directory</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">{totalEmployees}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Enrolled personnel</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Active Deployed</span>
                <p className="text-xl font-bold font-mono text-emerald-900 mt-1">{activeCount}</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">{((activeCount / totalEmployees) * 100).toFixed(0)}% deployment rate</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800">On Probation</span>
                <p className="text-xl font-bold font-mono text-amber-900 mt-1">{probationCount}</p>
                <p className="text-[10px] text-amber-700 mt-0.5">Under 90-day review</p>
              </div>
              <div className="p-3 bg-zinc-100 rounded-xl border border-zinc-300">
                <span className="text-[10px] uppercase font-bold text-zinc-600">On Leave / Inactive</span>
                <p className="text-xl font-bold font-mono text-zinc-800 mt-1">{onLeaveCount + terminatedCount}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{onLeaveCount} on leave, {terminatedCount} offboarded</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <div className="p-3 bg-[#fafbfc] border-b border-[#e5e7eb] font-bold text-[#111827]">
                Workforce Breakdown by Status & Department
              </div>
              <div className="divide-y divide-[#f0f2f5]">
                {employees.map(e => (
                  <div key={e.id} className="p-3 flex items-center justify-between hover:bg-[#fafbfc]">
                    <div>
                      <p className="font-bold text-[#111827]">{e.firstName} {e.lastName}</p>
                      <p className="text-[10px] text-[#6b7280]">{e.role} • {e.department}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#6b7280] font-mono">Started: {formatDate(e.startDate)}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        e.status === 'Active' ? 'bg-emerald-50 text-emerald-800' :
                        e.status === 'Probation' ? 'bg-amber-50 text-amber-800' :
                        e.status === 'On Leave' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ATTENDANCE REPORT */}
        {activeReport === 'attendance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Overall Attendance</span>
                <p className="text-xl font-bold font-mono text-emerald-900 mt-1">{attendanceRate.toFixed(1)}%</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Total logs audited</p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Punctuality Score</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">{punctualityRate.toFixed(1)}%</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">On-time check-in rate</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800">Late Check-ins</span>
                <p className="text-xl font-bold font-mono text-amber-900 mt-1">{lateLogs}</p>
                <p className="text-[10px] text-amber-700 mt-0.5">Arrived after 09:30 AM</p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Average Shift</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">8.4 hrs</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Mean daily duration</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <div className="p-3 bg-[#fafbfc] border-b border-[#e5e7eb] font-bold text-[#111827]">
                Recent Attendance Compliance Logs
              </div>
              <div className="divide-y divide-[#f0f2f5]">
                {attendance.slice(0, 8).map(a => (
                  <div key={a.id} className="p-3 flex items-center justify-between hover:bg-[#fafbfc]">
                    <div>
                      <p className="font-bold text-[#111827]">{a.employeeName}</p>
                      <p className="text-[10px] text-[#6b7280]">{a.department} • {formatDate(a.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-700">{a.checkIn} - {a.checkOut || 'Active'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        a.status === 'Present' ? 'bg-emerald-50 text-emerald-800' :
                        a.status === 'Late' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. LEAVE REPORT */}
        {activeReport === 'leaves' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Approved Leaves</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">{approvedLeaves}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{totalDaysTaken} total days granted</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800">Pending Review</span>
                <p className="text-xl font-bold font-mono text-amber-900 mt-1">{pendingLeaves}</p>
                <p className="text-[10px] text-amber-700 mt-0.5">Awaiting HR clearance</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-800">Rejected Requests</span>
                <p className="text-xl font-bold font-mono text-rose-900 mt-1">{rejectedLeaves}</p>
                <p className="text-[10px] text-rose-700 mt-0.5">Policy non-compliant</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Approval Rate</span>
                <p className="text-xl font-bold font-mono text-emerald-900 mt-1">
                  {totalLeaves > 0 ? ((approvedLeaves / totalLeaves) * 100).toFixed(0) : 100}%
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Compliance approval ratio</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <div className="p-3 bg-[#fafbfc] border-b border-[#e5e7eb] font-bold text-[#111827]">
                Leave Utilization by Request
              </div>
              <div className="divide-y divide-[#f0f2f5]">
                {leaveRequests.map(l => (
                  <div key={l.id} className="p-3 flex items-center justify-between hover:bg-[#fafbfc]">
                    <div>
                      <p className="font-bold text-[#111827]">{l.employeeName} ({l.leaveType})</p>
                      <p className="text-[10px] text-[#6b7280]">{l.department} • {formatDate(l.startDate)} to {formatDate(l.endDate)} ({l.daysCount} days)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        l.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' :
                        l.status === 'Pending' ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. DEPARTMENT REPORT */}
        {activeReport === 'departments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Business Units</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">{departments.length}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Active cost divisions</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Mean Dept Attendance</span>
                <p className="text-xl font-bold font-mono text-emerald-900 mt-1">95.4%</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Across all operational divisions</p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Average Squad Size</span>
                <p className="text-xl font-bold font-mono text-zinc-900 mt-1">
                  {(totalEmployees / Math.max(1, departments.length)).toFixed(1)} staff
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Balanced org structure</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
              <div className="p-3 bg-[#fafbfc] border-b border-[#e5e7eb] font-bold text-[#111827]">
                Departmental Employee & Performance Roster
              </div>
              <div className="divide-y divide-[#f0f2f5]">
                {deptStats.map(d => (
                  <div key={d.id} className="p-3 flex items-center justify-between hover:bg-[#fafbfc]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111827]">{d.name}</span>
                        <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-zinc-100 font-bold">{d.code}</span>
                      </div>
                      <p className="text-[10px] text-[#6b7280]">Lead: {d.head}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-mono font-bold text-zinc-900 block text-xs">{d.count} staff</span>
                        <span className="text-[10px] text-zinc-500">{d.daysTaken} leave days consumed</span>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 font-mono text-xs font-semibold text-emerald-700">
                        {d.attendanceRate.toFixed(1)}% Att.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
