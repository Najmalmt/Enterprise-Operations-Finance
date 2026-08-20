import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Clock,
  CalendarDays,
  Receipt,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Sparkles,
  Plus,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreateExpenseModal } from '../modals/CreateExpenseModal';
import { RequestLeaveModal } from '../modals/RequestLeaveModal';
import { ProjectDetailDrawer } from '../modals/ProjectDetailDrawer';
import { EmployeeDetailDrawer } from '../modals/EmployeeDetailDrawer';
import { Project, Employee } from '../../types';

interface TeamLeadDashboardProps {
  onNavigate: (path: string) => void;
}

export const TeamLeadDashboard: React.FC<TeamLeadDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const {
    projects,
    employees,
    attendance,
    leaveRequests,
    expenses,
    recommendLeaveRequest,
    updateExpense
  } = useData();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter projects where current user is Lead or assigned
  const myLeadProjects = projects.filter(
    p => p.leadId === currentUser?.id || p.teamMemberIds?.includes(currentUser?.id || '')
  );
  const myProjectIds = myLeadProjects.map(p => p.id);

  // Filter squad members
  const myTeamMemberIds = Array.from(
    new Set(myLeadProjects.flatMap(p => p.teamMemberIds || []).concat(currentUser?.id ? [currentUser.id] : []))
  );
  const squadEmployees = employees.filter(e => myTeamMemberIds.includes(e.id));

  // Today's attendance for squad
  const todayStr = new Date().toISOString().split('T')[0];
  const squadAttendanceToday = attendance.filter(
    a => a.date === todayStr && (myTeamMemberIds.includes(a.employeeId) || a.employeeName.toLowerCase().includes(currentUser?.name?.toLowerCase() || ''))
  );
  const presentCount = squadAttendanceToday.filter(a => a.checkIn && !a.checkOut).length;

  // Pending leave requests for squad
  const squadLeaveRequests = leaveRequests.filter(
    l => (myTeamMemberIds.includes(l.employeeId) || squadEmployees.some(e => `${e.firstName} ${e.lastName}` === l.employeeName))
  );
  const pendingLeavesToRecommend = squadLeaveRequests.filter(l => l.status === 'Pending');

  // Pending expense submissions for squad/projects
  const squadExpenses = expenses.filter(
    e => (e.projectId && myProjectIds.includes(e.projectId)) || myTeamMemberIds.includes(e.submitterId)
  );
  const pendingExpensesToReview = squadExpenses.filter(e => e.status === 'Pending');

  // Calculate squad performance metrics
  const totalTasks = myLeadProjects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const completedTasks = myLeadProjects.reduce(
    (sum, p) => sum + (p.tasks?.filter(t => t.status === 'Completed').length || 0),
    0
  );
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 88;

  const handleEndorseExpense = async (id: string, endorsement: 'Endorsed' | 'Flagged') => {
    await updateExpense(id, {
      leadEndorsement: endorsement,
      leadEndorsementNote: endorsement === 'Endorsed' ? 'Verified by Team Lead for sprint deliverable' : 'Flagged: unbudgeted team spend'
    });
  };

  return (
    <div className="space-y-6">
      {/* Lead Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Squad Operations & Delivery Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white">
              Team Lead Workspace
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Managing sprint execution, team assignments, leave recommendations, and deliverable progress for <span className="font-semibold text-black">{currentUser?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowLeaveModal(true)}>
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
            Apply Leave
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowExpenseModal(true)}>
            <Receipt className="w-3.5 h-3.5 mr-1.5" />
            Submit Project Expense
          </Button>
        </div>
      </div>

      {/* 4 Core Squad KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Squad Size & Members */}
        <div
          onClick={() => onNavigate('/employees')}
          className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] cursor-pointer hover:border-black transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Assigned Squad
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#111827]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] font-mono">{squadEmployees.length} Engineers</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {presentCount > 0 ? `${presentCount} active today` : 'All assigned'}
            </p>
          </div>
        </div>

        {/* 2. Assigned Projects */}
        <div
          onClick={() => onNavigate('/projects')}
          className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] cursor-pointer hover:border-black transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Assigned Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#111827]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] font-mono">{myLeadProjects.length} Active</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              Avg {myLeadProjects.length > 0 ? Math.round(myLeadProjects.reduce((s, p) => s + p.progressPercent, 0) / myLeadProjects.length) : 0}% milestone progress
            </p>
          </div>
        </div>

        {/* 3. Task & Sprint Velocity */}
        <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Task Velocity
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-[#111827] font-mono">{taskCompletionRate}%</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {completedTasks} of {totalTasks || '18'} tasks resolved
            </p>
          </div>
        </div>

        {/* 4. Action Queue */}
        <div
          onClick={() => onNavigate('/attendance')}
          className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] cursor-pointer hover:border-black transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Review Queue
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-amber-700 font-mono">
              {pendingLeavesToRecommend.length + pendingExpensesToReview.length} Items
            </p>
            <p className="text-[11px] text-[#6b7280] mt-0.5">
              {pendingLeavesToRecommend.length} leaves, {pendingExpensesToReview.length} expenses
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects & Tasks vs Leave & Expense Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Projects & Progress Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            headerTitle="Assigned Projects & Sprint Delivery"
            headerSubtitle="Monitor milestone progression, assign tasks, and update status"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/projects')}>
                View Portfolio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="space-y-4">
              {myLeadProjects.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#6b7280]">
                  No projects assigned to your lead scope yet.
                </div>
              ) : (
                myLeadProjects.map(project => {
                  const tasks = project.tasks || [];
                  const completed = tasks.filter(t => t.status === 'Completed').length;
                  const inProg = tasks.filter(t => t.status === 'In Progress').length;
                  const pending = tasks.filter(t => t.status === 'Pending').length;

                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] hover:border-black transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#111827]">{project.name}</h3>
                            <Badge variant={getStatusBadgeVariant(project.status)} size="sm">
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#6b7280] line-clamp-1 mt-0.5">{project.description}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#111827]">
                          {project.progressPercent}% Done
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-300"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>

                      {/* Footer & Task Stats */}
                      <div className="flex items-center justify-between text-xs text-[#6b7280] pt-1">
                        <div className="flex items-center gap-3">
                          <span>Tasks: <strong className="text-black">{tasks.length}</strong></span>
                          <span className="text-emerald-700">✓ {completed}</span>
                          <span className="text-amber-700">⏳ {inProg}</span>
                          <span>• {pending} todo</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-black">
                          <span>Manage Tasks</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Squad Personnel & Attendance Monitor */}
          <Card
            headerTitle="Squad Personnel & Daily Check-Ins"
            headerSubtitle="Team member attendance and activity for today"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/attendance')}>
                Attendance Log <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="divide-y divide-[#f0f2f5]">
              {squadEmployees.map(emp => {
                const att = attendance.find(a => a.employeeId === emp.id && a.date === todayStr);
                const isOnline = att?.checkIn && !att?.checkOut;

                return (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-[#fafbfc] px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          isOnline ? 'bg-emerald-500' : 'bg-zinc-300'
                        }`} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#111827]">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[11px] text-[#6b7280]">{emp.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        {att?.checkIn ? (
                          <span className="font-mono text-emerald-700 font-medium">
                            Clocked in {att.checkIn}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#9ca3af]">Not checked in</span>
                        )}
                      </div>
                      <Badge variant={getStatusBadgeVariant(emp.status)} size="sm">
                        {emp.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Reviews & Recommendations Queue */}
        <div className="space-y-6">
          {/* Team Leave Approvals / Recommendations */}
          <Card
            headerTitle="Team Leave Recommendations"
            headerSubtitle="Review squad PTO and provide recommendation for HR"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/attendance')}>
                All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="space-y-3">
              {pendingLeavesToRecommend.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#6b7280]">
                  No pending squad leave requests awaiting your recommendation.
                </div>
              ) : (
                pendingLeavesToRecommend.slice(0, 3).map(leave => (
                  <div key={leave.id} className="p-3 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{leave.employeeName}</span>
                      <span className="text-[10px] font-semibold bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-800">
                        {leave.leaveType} ({leave.daysCount}d)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4b5563] italic">"{leave.reason}"</p>
                    <p className="text-[10px] text-[#6b7280] font-mono">
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                    </p>

                    <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-end gap-2">
                      <button
                        onClick={() => recommendLeaveRequest(leave.id, 'Recommended', 'Sprint coverage confirmed')}
                        className="px-2 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <ThumbsUp className="w-2.5 h-2.5" /> Recommend
                      </button>
                      <button
                        onClick={() => recommendLeaveRequest(leave.id, 'Flagged', 'Deadline conflict')}
                        className="px-2 py-1 rounded border border-[#e5e7eb] text-rose-700 hover:bg-rose-50 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <ThumbsDown className="w-2.5 h-2.5" /> Flag
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Team Expense Endorsements */}
          <Card
            headerTitle="Team Expense Submissions"
            headerSubtitle="Verify squad expense claims for Finance disbursement"
            headerAction={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/expenses')}>
                All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <div className="space-y-3">
              {pendingExpensesToReview.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#6b7280]">
                  No pending squad expense claims to endorse.
                </div>
              ) : (
                pendingExpensesToReview.slice(0, 3).map(exp => (
                  <div key={exp.id} className="p-3 rounded-lg border border-[#e5e7eb] bg-[#fafbfc] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{exp.title}</span>
                      <span className="font-mono font-bold text-[#111827]">{formatCurrency(exp.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6b7280]">
                      <span>{exp.submitterName}</span>
                      <span>{exp.category}</span>
                    </div>

                    <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEndorseExpense(exp.id, 'Endorsed')}
                        className="px-2 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <ThumbsUp className="w-2.5 h-2.5" /> Endorse
                      </button>
                      <button
                        onClick={() => handleEndorseExpense(exp.id, 'Flagged')}
                        className="px-2 py-1 rounded border border-[#e5e7eb] text-rose-700 hover:bg-rose-50 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <ThumbsDown className="w-2.5 h-2.5" /> Flag
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals & Drawers */}
      <CreateExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />
      <RequestLeaveModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <EmployeeDetailDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};
