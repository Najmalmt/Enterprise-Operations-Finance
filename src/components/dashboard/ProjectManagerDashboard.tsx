import React, { useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Receipt,
  Users,
  DollarSign,
  Calendar,
  ChevronRight,
  Filter,
  BarChart3,
  ListTodo,
  Layers,
  ArrowUpRight,
  Sparkles,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Project, ProjectStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { ProjectDetailDrawer } from '../modals/ProjectDetailDrawer';
import { CreateExpenseModal } from '../modals/CreateExpenseModal';

interface ProjectManagerDashboardProps {
  onNavigate: (path: string) => void;
}

export const ProjectManagerDashboard: React.FC<ProjectManagerDashboardProps> = ({ onNavigate }) => {
  const { projects, employees, expenses } = useData();
  const { currentUser, hasPermission } = useAuth();

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showLogExpense, setShowLogExpense] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'deadlines'>('all');

  const canCreateProject = hasPermission('create_project');
  const canSubmitExpense = hasPermission('submit_expense');

  // Metrics
  const activeProjects = projects.filter(p => p.status === 'Active');
  const completedProjects = projects.filter(p => p.status === 'Completed');
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalProfit = Math.max(0, totalBudget - totalSpent);
  const avgMargin = totalBudget > 0 ? Math.round((totalProfit / totalBudget) * 100) : 0;
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((s, p) => s + p.progressPercent, 0) / projects.length)
    : 0;

  // Sprints & Tasks aggregated across all projects
  const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectName: p.name, projectCode: p.code })));
  const completedTasks = allTasks.filter(t => t.status === 'Completed');
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
  const pendingTasks = allTasks.filter(t => t.status === 'Pending');

  // Filtered projects
  const displayProjects = projects.filter(p => {
    if (activeTab === 'critical') return p.priority === 'Critical' || p.priority === 'High';
    if (activeTab === 'deadlines') {
      const daysLeft = Math.ceil((new Date(p.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysLeft <= 60 && p.status === 'Active';
    }
    if (filterPriority !== 'All') return p.priority === filterPriority;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-900 text-white tracking-wide uppercase">
              Project Management Hub
            </span>
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Portfolio Delivery & Sprint Operations
            </h1>
          </div>
          <p className="text-xs text-[#6b7280] mt-1">
            Logged in as <strong className="text-[#111827]">{currentUser?.name}</strong> • Supervising {projects.length} enterprise IT client engagements and technical delivery teams.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canSubmitExpense && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLogExpense(true)}
            >
              <Receipt className="w-3.5 h-3.5 mr-1.5" />
              Log Project Cost
            </Button>
          )}
          {canCreateProject && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateProject(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Project
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Engagements</span>
            <Briefcase className="w-4 h-4 text-black" />
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-2">{activeProjects.length} Active</p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 mt-1">
            <span className="font-semibold">{completedProjects.length} completed</span>
            <span>• Avg {avgProgress}% progress</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Portfolio Budget</span>
            <DollarSign className="w-4 h-4 text-black" />
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-2">{formatCurrency(totalBudget, true)}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1">
            <span>{formatCurrency(totalRemaining, true)} remaining</span>
            <span>({totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% burn)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Estimated Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-2">{avgMargin}%</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280] mt-1">
            <span>Est. Profit: {formatCurrency(totalProfit, true)}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Sprint Work Items</span>
            <ListTodo className="w-4 h-4 text-black" />
          </div>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-2">{allTasks.length} Deliverables</p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 mt-1">
            <span className="text-emerald-700 font-semibold">{completedTasks.length} done</span>
            <span>• {inProgressTasks.length} in flight</span>
            <span>• {pendingTasks.length} pending</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Portfolio & Delivery Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Projects Portfolio Table & Health */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            headerTitle="Project Portfolio Delivery & Milestones"
            headerSubtitle="Active engineering contracts, milestones, burn rates, and technical leads"
            headerAction={
              <div className="flex items-center gap-1.5 bg-[#f3f4f6] p-0.5 rounded-lg border border-[#e5e7eb]">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'all' ? 'bg-white text-black shadow-2xs' : 'text-[#6b7280]'
                  }`}
                >
                  All ({projects.length})
                </button>
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'critical' ? 'bg-white text-black shadow-2xs' : 'text-[#6b7280]'
                  }`}
                >
                  Critical / High
                </button>
                <button
                  onClick={() => setActiveTab('deadlines')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeTab === 'deadlines' ? 'bg-white text-black shadow-2xs' : 'text-[#6b7280]'
                  }`}
                >
                  Upcoming Deadlines
                </button>
              </div>
            }
            noPadding
          >
            <div className="divide-y divide-[#f0f2f5]">
              {displayProjects.map((p) => {
                const remaining = p.budget - p.spent;
                const margin = p.budget > 0 ? Math.round((Math.max(0, remaining) / p.budget) * 100) : 0;
                const burnRate = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
                const daysUntilDeadline = Math.ceil(
                  (new Date(p.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                );

                const isAtRisk = burnRate > p.progressPercent + 20 && p.status === 'Active';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="p-4 hover:bg-[#fafbfc] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#6b7280]">[{p.code}]</span>
                        <h4 className="font-bold text-xs text-[#111827] group-hover:text-black truncate">
                          {p.name}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(p.status)} size="sm">
                          {p.status}
                        </Badge>
                        {isAtRisk && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> Burn Alert
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#6b7280] flex-wrap">
                        <span>Client: <strong className="text-[#374151]">{p.client}</strong></span>
                        <span>• Tech Lead: <strong className="text-[#374151]">{p.leadName}</strong></span>
                        <span>• Due: <strong>{formatDate(p.endDate)}</strong> ({daysUntilDeadline > 0 ? `${daysUntilDeadline}d left` : 'Past deadline'})</span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 bg-[#f0f2f5] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-black h-full rounded-full transition-all duration-300"
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#111827] shrink-0">
                          {p.progressPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f0f2f5]">
                      <div className="text-xs font-mono font-bold text-[#111827]">
                        {formatCurrency(p.spent, true)} <span className="text-[10px] text-[#6b7280] font-normal">/ {formatCurrency(p.budget, true)}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        {margin}% Profit Margin ({formatCurrency(remaining, true)} rem)
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-700 mt-1">
                        <Users className="w-3 h-3 text-[#9ca3af]" />
                        <span>{p.teamMemberIds?.length || p.teamMembersCount} Staff</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Project Financial Performance & Profitability Analysis */}
          <Card
            headerTitle="Project Financial Performance & Profitability Ledger"
            headerSubtitle="Authorized project budgets, direct spending, remaining capital, and estimated profit margins"
            headerAction={
              <button
                onClick={() => onNavigate('/projects')}
                className="text-xs font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                Full Portfolio <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                  <tr>
                    <th className="px-4 py-3">Project / Engagement</th>
                    <th className="px-3 py-3 text-right">Authorized Budget</th>
                    <th className="px-3 py-3 text-right">Actual Spent</th>
                    <th className="px-3 py-3 text-right">Remaining</th>
                    <th className="px-3 py-3 text-right">Profit Margin</th>
                    <th className="px-4 py-3 text-center">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f5]">
                  {projects.map((p) => {
                    const remaining = p.budget - p.spent;
                    const burnRate = p.budget > 0 ? (p.spent / p.budget) * 100 : 0;
                    const margin = p.budget > 0 ? Math.round((Math.max(0, remaining) / p.budget) * 100) : 0;
                    const isHealthy = burnRate <= p.progressPercent + 10;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className="hover:bg-[#fafbfc] transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#111827]">{p.name}</div>
                          <div className="text-[10px] text-[#6b7280] font-mono">{p.code} • {p.client}</div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-bold text-[#111827]">
                          {formatCurrency(p.budget, true)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-[#374151]">
                          {formatCurrency(p.spent, true)}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-bold ${remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {formatCurrency(remaining, true)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-semibold text-emerald-800">
                          {margin}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isHealthy ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              On Track
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              Watch Burn
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Sprint Velocity, Direct Expenses & Team Workload */}
        <div className="space-y-6">
          {/* Active Deliverables & Sprint Velocity */}
          <Card
            headerTitle="Active Sprint Deliverables"
            headerSubtitle="Cross-project work items and technical milestones"
            headerAction={
              <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                {allTasks.length} Total
              </span>
            }
            noPadding
          >
            <div className="p-4 divide-y divide-[#f0f2f5] space-y-3">
              {allTasks.slice(0, 6).map((task) => (
                <div key={task.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold text-[#111827] leading-snug ${task.status === 'Completed' ? 'line-through text-[#9ca3af]' : ''}`}>
                      {task.title}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      task.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#6b7280]">
                    <span>Assignee: <strong className="text-[#374151]">{task.assigneeName}</strong></span>
                    <span className="font-mono font-bold text-zinc-500">[{task.projectCode}]</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Project Direct Costs & Claims */}
          <Card
            headerTitle="Direct Project Expenses"
            headerSubtitle="Recent cost line items tagged to active projects"
            headerAction={
              <button
                onClick={() => onNavigate('/expenses')}
                className="text-xs font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                All Costs <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
            noPadding
          >
            <div className="divide-y divide-[#f0f2f5]">
              {expenses.filter(e => e.projectId).slice(0, 5).map((exp) => (
                <div key={exp.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#fafbfc] transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-[#111827] truncate">{exp.title}</p>
                    <p className="text-[10px] text-[#6b7280]">{exp.projectName || 'Project Cost'} • {formatDate(exp.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-[#111827]">{formatCurrency(exp.amount)}</span>
                    <div>
                      <Badge variant={getStatusBadgeVariant(exp.status)} size="sm">{exp.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Technical Leads & Squad Allocations */}
          <Card
            headerTitle="Technical Leads & Squad Leads"
            headerSubtitle="Engineers heading active client architecture projects"
            noPadding
          >
            <div className="divide-y divide-[#f0f2f5]">
              {Array.from(new Set(projects.map(p => p.leadId))).map((leadId) => {
                const leadProjects = projects.filter(p => p.leadId === leadId);
                const leadEmp = employees.find(e => e.id === leadId) || {
                  id: leadId,
                  firstName: leadProjects[0]?.leadName?.split(' ')[0] || 'Technical',
                  lastName: leadProjects[0]?.leadName?.split(' ')[1] || 'Lead',
                  role: 'Engineering Lead',
                  department: 'Engineering & DevOps'
                };

                return (
                  <div key={leadId} className="p-3.5 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {leadEmp.firstName[0]}{leadEmp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[#111827]">{leadEmp.firstName} {leadEmp.lastName}</p>
                        <p className="text-[10px] text-[#6b7280]">{leadProjects.length} Projects assigned</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                      {leadProjects.map(p => p.code).join(', ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals & Drawers */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />

      <CreateExpenseModal
        isOpen={showLogExpense}
        onClose={() => setShowLogExpense(false)}
      />

      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
