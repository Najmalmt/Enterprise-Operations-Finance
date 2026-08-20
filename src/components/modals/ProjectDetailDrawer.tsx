import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Receipt,
  UserPlus,
  ShieldCheck,
  Percent,
  CheckSquare,
  ListTodo,
  AlertCircle,
  Archive,
  Edit,
  Save,
  BarChart3,
  FileText,
  Activity
} from 'lucide-react';
import { Project, ProjectStatus, ProjectPriority, ExpenseCategory, Employee, ProjectTask, Expense } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { expenses, employees, updateProject, deleteProject, addExpense } = useData();
  const { currentUser, hasPermission, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'squad' | 'finances' | 'reports'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editClient, setEditClient] = useState('');
  const [editPriority, setEditPriority] = useState<ProjectPriority>('Medium');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editBudget, setEditBudget] = useState(0);
  const [editDescription, setEditDescription] = useState('');

  // Progress slider state
  const [progress, setProgress] = useState(project?.progressPercent || 0);

  // Add Member state
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // Task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Expense form state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Software Licenses');
  const [expenseNotes, setExpenseNotes] = useState('');

  if (!isOpen || !project) return null;

  const canEditProject = hasPermission('edit_project');
  const canAssignTeam = hasPermission('assign_team');
  const canManageBudget = hasPermission('manage_project_budget');
  const canViewExpenses = hasPermission('view_project_expenses');
  const canSubmitExpense = hasPermission('submit_expense');
  const canDeleteProject = role === 'Super Admin';

  const handleDeleteProject = async () => {
    if (!canDeleteProject) return;
    if (confirm(`Are you sure you want to permanently delete project "${project.name}"? This action cannot be undone.`)) {
      await deleteProject(project.id);
      onClose();
    }
  };

  const projectExpenses = expenses.filter(e => e.projectId === project.id);
  const remainingBudget = project.budget - project.spent;
  const burnRate = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const estimatedProfit = Math.max(0, project.budget - project.spent);
  const profitMarginPercent = project.budget > 0 ? Math.round((estimatedProfit / project.budget) * 100) : 0;

  // Team & Employees
  const teamMembers = employees.filter(e => project.teamMemberIds?.includes(e.id));
  const availableEmployees = employees.filter(e => !project.teamMemberIds?.includes(e.id));

  // Tasks
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  const daysRemaining = Math.ceil(
    (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const isAtRisk = burnRate > project.progressPercent + 20 && project.status === 'Active';

  const handleStartEdit = () => {
    setEditName(project.name);
    setEditClient(project.client);
    setEditPriority(project.priority);
    setEditStartDate(project.startDate);
    setEditEndDate(project.endDate);
    setEditBudget(project.budget);
    setEditDescription(project.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!canEditProject) return;
    setIsUpdating(true);
    const payload: Partial<Project> = {
      name: editName.trim() || project.name,
      client: editClient.trim() || project.client,
      priority: editPriority,
      startDate: editStartDate || project.startDate,
      endDate: editEndDate || project.endDate,
      description: editDescription.trim()
    };
    if (canManageBudget && editBudget > 0) {
      payload.budget = Number(editBudget);
    }
    await updateProject(project.id, payload);
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleSetTeamLead = async (member: Employee) => {
    if (!canAssignTeam) return;
    await updateProject(project.id, {
      leadId: member.id,
      leadName: `${member.firstName} ${member.lastName}`
    });
  };

  const handleArchiveProject = async () => {
    if (!canEditProject) return;
    const newStatus: ProjectStatus = project.status === 'Completed' ? 'Active' : 'Completed';
    await updateProject(project.id, { status: newStatus });
  };

  const handleUpdateStatus = async (status: ProjectStatus) => {
    if (!canEditProject) return;
    await updateProject(project.id, { status });
  };

  const handleUpdateProgress = async () => {
    if (!canEditProject) return;
    setIsUpdating(true);
    await updateProject(project.id, { progressPercent: Number(progress) });
    setIsUpdating(false);
  };

  const handleAddMember = async () => {
    if (!canAssignTeam || !selectedMemberId) return;
    const updatedIds = [...(project.teamMemberIds || []), selectedMemberId];
    await updateProject(project.id, {
      teamMemberIds: updatedIds,
      teamMembersCount: updatedIds.length
    });
    setSelectedMemberId('');
    setShowAddMember(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!canAssignTeam) return;
    const updatedIds = (project.teamMemberIds || []).filter(id => id !== memberId);
    await updateProject(project.id, {
      teamMemberIds: updatedIds,
      teamMembersCount: updatedIds.length
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditProject || !taskTitle.trim() || !taskAssigneeId) return;

    const assignee = employees.find(e => e.id === taskAssigneeId);
    const newTask: ProjectTask = {
      id: `tsk-${Date.now()}`,
      projectId: project.id,
      title: taskTitle.trim(),
      assigneeId: taskAssigneeId,
      assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Assigned Engineer',
      status: 'Pending',
      priority: taskPriority,
      dueDate: taskDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    };

    const updatedTasks = [...tasks, newTask];
    const newProgress = Math.round((updatedTasks.filter(t => t.status === 'Completed').length / updatedTasks.length) * 100);

    await updateProject(project.id, {
      tasks: updatedTasks,
      progressPercent: newProgress > 0 ? newProgress : project.progressPercent
    });

    setTaskTitle('');
    setTaskAssigneeId('');
    setShowAddTask(false);
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    if (!canEditProject) return;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus: 'Pending' | 'In Progress' | 'Completed' =
          t.status === 'Pending' ? 'In Progress' :
          t.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    const newProgress = Math.round((updatedTasks.filter(t => t.status === 'Completed').length / updatedTasks.length) * 100);

    await updateProject(project.id, {
      tasks: updatedTasks,
      progressPercent: updatedTasks.length > 0 ? newProgress : project.progressPercent
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!canEditProject) return;
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    const newProgress = updatedTasks.length > 0
      ? Math.round((updatedTasks.filter(t => t.status === 'Completed').length / updatedTasks.length) * 100)
      : project.progressPercent;

    await updateProject(project.id, {
      tasks: updatedTasks,
      progressPercent: newProgress
    });
  };

  const handleCreateProjectExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitExpense || !expenseTitle.trim() || !expenseAmount) return;

    const parsedAmount = parseFloat(expenseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: expenseTitle.trim(),
      amount: parsedAmount,
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0],
      submitterId: currentUser?.id || 'emp-4',
      submitterName: currentUser?.name || 'Sarah Jenkins',
      submitterDepartment: 'Engineering & DevOps',
      projectId: project.id,
      projectName: project.name,
      status: 'Pending',
      notes: expenseNotes.trim() || `Direct project cost logged for ${project.code}.`
    };

    await addExpense(newExpense);

    // Update project spent
    await updateProject(project.id, {
      spent: project.spent + parsedAmount
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNotes('');
    setShowAddExpense(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col border-l border-[#e5e7eb]">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f2f5] bg-[#fafbfc] flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#6b7280]">[{project.code}]</span>
              <h2 className="text-base font-bold text-[#111827] truncate">{project.name}</h2>
              <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
              {isAtRisk && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> High Burn Rate
                </span>
              )}
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5 truncate">
              Client: <strong className="text-[#374151]">{project.client}</strong> • Lead: <strong className="text-[#374151]">{project.leadName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canDeleteProject && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProject}
                title="Delete Project permanently"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            )}
            {canEditProject && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleArchiveProject}
                title={project.status === 'Completed' ? 'Unarchive Project' : 'Archive Project'}
              >
                <Archive className="w-3.5 h-3.5 mr-1" />
                {project.status === 'Completed' ? 'Restore' : 'Archive'}
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#6b7280] hover:text-[#111827] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-white border-b border-[#f0f2f5] overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Edit' },
            { id: 'deliverables', label: `Deliverables (${tasks.length})` },
            { id: 'squad', label: `Team Squad (${teamMembers.length})` },
            { id: 'finances', label: `Finances & Costs (${projectExpenses.length})` },
            { id: 'reports', label: 'Project Report' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-[#6b7280] hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB: OVERVIEW & EDIT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#f0f2f5]">
                  <span className="text-[10px] text-[#6b7280] font-semibold uppercase">Authorized Budget</span>
                  <p className="text-xs font-bold font-mono text-[#111827] mt-1">
                    {formatCurrency(project.budget, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#f0f2f5]">
                  <span className="text-[10px] text-[#6b7280] font-semibold uppercase">Actual Spent</span>
                  <p className="text-xs font-bold font-mono text-[#111827] mt-1">
                    {formatCurrency(project.spent, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#f0f2f5]">
                  <span className="text-[10px] text-[#6b7280] font-semibold uppercase">Remaining</span>
                  <p className={`text-xs font-bold font-mono mt-1 ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatCurrency(remainingBudget, true)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-semibold uppercase">Est. Margin</span>
                  <p className="text-xs font-bold font-mono text-emerald-800 mt-1">
                    {profitMarginPercent}%
                  </p>
                </div>
              </div>

              {/* Progress & Milestone Tracking */}
              <div className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
                  <span>Delivery Milestone Completion</span>
                  <span className="font-mono font-bold">{project.progressPercent}%</span>
                </div>
                <div className="w-full bg-[#e5e7eb] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-300"
                    style={{ width: `${project.progressPercent}%` }}
                  />
                </div>
                {canEditProject && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full accent-black"
                    />
                    <Button size="sm" variant="secondary" onClick={handleUpdateProgress} isLoading={isUpdating}>
                      Save ({progress}%)
                    </Button>
                  </div>
                )}
              </div>

              {/* Project Status Shift */}
              {canEditProject && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#e5e7eb] bg-white">
                  <span className="font-semibold text-[#111827]">Set Project Status:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['Planning', 'Active', 'On Hold', 'Completed'] as ProjectStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                          project.status === st
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:bg-[#f3f4f6]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Project Details Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px]">
                    Project Specifications & Dates
                  </h4>
                  {canEditProject && !isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" /> Edit Details & Dates
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="p-4 bg-[#fafbfc] border border-[#e5e7eb] rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">Project Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">Client / Engagement</label>
                        <input
                          type="text"
                          value={editClient}
                          onChange={(e) => setEditClient(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">Priority</label>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as ProjectPriority)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">Start Date</label>
                        <input
                          type="date"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">Target Delivery Date</label>
                        <input
                          type="date"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>

                    {canManageBudget && (
                      <div>
                        <label className="block text-[11px] font-medium text-[#374151] mb-1">
                          Authorized Project Budget ($)
                        </label>
                        <input
                          type="number"
                          value={editBudget}
                          onChange={(e) => setEditBudget(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-medium text-[#374151] mb-1">Description & Scope</label>
                      <textarea
                        rows={2}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleSaveEdit} isLoading={isUpdating}>
                        <Save className="w-3.5 h-3.5 mr-1" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-[#f0f2f5] bg-[#fafbfc] space-y-3">
                    <p className="text-[#374151] leading-relaxed">
                      {project.description || 'Enterprise architecture and implementation deliverable.'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f0f2f5] text-[#6b7280]">
                      <div>Tech Lead: <strong className="text-[#111827]">{project.leadName}</strong></div>
                      <div>Priority: <strong className="text-[#111827]">{project.priority}</strong></div>
                      <div>Start Date: <strong>{formatDate(project.startDate)}</strong></div>
                      <div>
                        Target Delivery: <strong>{formatDate(project.endDate)}</strong>{' '}
                        <span className="font-semibold text-zinc-900">
                          ({daysRemaining > 0 ? `${daysRemaining} days left` : 'Past deadline'})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: DELIVERABLES & SPRINTS */}
          {activeTab === 'deliverables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ListTodo className="w-3.5 h-3.5 text-[#6b7280]" />
                    Sprint Deliverables & Work Items ({tasks.length})
                  </h4>
                  <p className="text-[10px] text-[#6b7280]">
                    {completedTasks} completed • {inProgressTasks} in flight • {pendingTasks} pending
                  </p>
                </div>
                {canEditProject && (
                  <button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> New Work Item
                  </button>
                )}
              </div>

              {/* Add Task Form */}
              {showAddTask && canEditProject && (
                <form onSubmit={handleCreateTask} className="p-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl space-y-3">
                  <p className="font-semibold text-[#111827] text-xs">Assign Work Item to Squad Engineer</p>
                  <input
                    type="text"
                    placeholder="Work item description (e.g. Implement API Gateway Rate Limiter)..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={taskAssigneeId}
                      onChange={(e) => setTaskAssigneeId(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    >
                      <option value="">Select Assignee...</option>
                      {teamMembers.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                      ))}
                    </select>

                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    >
                      <option value="Critical">Critical Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>

                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setShowAddTask(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" type="submit">
                      Assign Item
                    </Button>
                  </div>
                </form>
              )}

              {/* Task list */}
              <div className="divide-y divide-[#f0f2f5] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                {tasks.length === 0 ? (
                  <p className="p-4 text-center text-xs text-[#6b7280]">No deliverables assigned to this project yet.</p>
                ) : (
                  tasks.map(task => (
                    <div key={task.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-[#fafbfc] transition-colors">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleTaskStatus(task.id)}
                          className="mt-0.5 text-[#9ca3af] hover:text-black transition-colors cursor-pointer"
                        >
                          {task.status === 'Completed' ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <div className={`w-4 h-4 rounded border ${task.status === 'In Progress' ? 'border-amber-600 bg-amber-50' : 'border-zinc-300'}`} />
                          )}
                        </button>
                        <div className="space-y-1 min-w-0">
                          <p className={`font-semibold text-xs text-[#111827] leading-snug ${task.status === 'Completed' ? 'line-through text-[#9ca3af]' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#6b7280] flex-wrap">
                            <span>Assignee: <strong className="text-[#374151]">{task.assigneeName}</strong></span>
                            <span>• Due: <strong>{formatDate(task.dueDate || '')}</strong></span>
                            <span className={`px-1.5 py-0.2 rounded font-semibold ${
                              task.priority === 'Critical' ? 'bg-rose-50 text-rose-700' :
                              task.priority === 'High' ? 'bg-amber-50 text-amber-800' :
                              'bg-zinc-100 text-zinc-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleTaskStatus(task.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer ${
                            task.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            task.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          {task.status}
                        </button>
                        {canEditProject && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-[#9ca3af] hover:text-rose-600 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: TEAM SQUAD */}
          {activeTab === 'squad' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#6b7280]" />
                    Assigned Project Squad ({teamMembers.length})
                  </h4>
                  <p className="text-[10px] text-[#6b7280]">
                    Manage project squad allocations, assign Team Leads, and adjust staffing
                  </p>
                </div>
                {canAssignTeam && (
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Assign Engineer
                  </button>
                )}
              </div>

              {showAddMember && canAssignTeam && (
                <div className="p-3 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl flex items-center gap-2">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                  >
                    <option value="">Select available engineer from directory...</option>
                    {availableEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
                    ))}
                  </select>
                  <Button size="sm" variant="primary" onClick={handleAddMember} disabled={!selectedMemberId}>
                    Assign to Squad
                  </Button>
                </div>
              )}

              <div className="divide-y divide-[#f0f2f5] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                {teamMembers.length === 0 ? (
                  <p className="p-4 text-center text-xs text-[#6b7280]">No engineers assigned to squad yet.</p>
                ) : (
                  teamMembers.map(member => (
                    <div key={member.id} className="p-3.5 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[#111827]">{member.firstName} {member.lastName}</p>
                          <p className="text-[10px] text-[#6b7280]">{member.role} • {member.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.leadId === member.id ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Team Lead
                          </span>
                        ) : (
                          canAssignTeam && (
                            <button
                              onClick={() => handleSetTeamLead(member)}
                              className="px-2.5 py-1 text-[10px] font-semibold text-[#4b5563] hover:text-black border border-[#e5e7eb] hover:bg-[#f3f4f6] rounded-md cursor-pointer transition-colors"
                              title="Assign as Technical Lead for this project"
                            >
                              Assign Team Lead
                            </button>
                          )
                        )}
                        {canAssignTeam && project.leadId !== member.id && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 text-[#9ca3af] hover:text-rose-600 rounded transition-colors cursor-pointer"
                            title="Remove from squad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: FINANCES & COSTS */}
          {activeTab === 'finances' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#6b7280]" />
                    Direct Project Expenses ({projectExpenses.length})
                  </h4>
                  <p className="text-[10px] text-[#6b7280]">
                    Total Logged Costs: {formatCurrency(project.spent, true)} • Remaining: {formatCurrency(remainingBudget, true)}
                  </p>
                </div>
                {canSubmitExpense && (
                  <button
                    onClick={() => setShowAddExpense(!showAddExpense)}
                    className="text-[11px] font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Log Project Cost
                  </button>
                )}
              </div>

              {/* Log Expense Form */}
              {showAddExpense && canSubmitExpense && (
                <form onSubmit={handleCreateProjectExpense} className="p-4 bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl space-y-3">
                  <p className="font-semibold text-[#111827] text-xs">Submit Direct Project Expense</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Cost description (e.g. AWS DirectConnect link)..."
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      required
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    >
                      <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                      <option value="Hardware & Equipment">Hardware & Equipment</option>
                      <option value="Software Licenses">Software Licenses</option>
                      <option value="Travel & Client Meetings">Travel & Client Meetings</option>
                      <option value="Consulting & Legal">Consulting & Legal</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Notes / justification..."
                      value={expenseNotes}
                      onChange={(e) => setExpenseNotes(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setShowAddExpense(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" type="submit">
                      Submit Cost Claim
                    </Button>
                  </div>
                </form>
              )}

              {/* Expense List */}
              <div className="divide-y divide-[#f0f2f5] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                {projectExpenses.length === 0 ? (
                  <p className="text-xs text-[#6b7280] py-6 text-center">
                    No direct expenses tagged to this project yet.
                  </p>
                ) : (
                  projectExpenses.map(exp => (
                    <div key={exp.id} className="p-3.5 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                      <div>
                        <p className="font-semibold text-[#111827]">{exp.title}</p>
                        <p className="text-[10px] text-[#6b7280]">{exp.category} • {formatDate(exp.date)} • Submitter: {exp.submitterName}</p>
                        {exp.notes && <p className="text-[10px] text-[#4b5563] italic mt-0.5">{exp.notes}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-xs text-[#111827]">{formatCurrency(exp.amount)}</span>
                        <div>
                          <Badge variant={getStatusBadgeVariant(exp.status)} size="sm">{exp.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: PROJECT REPORTS & PERFORMANCE */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#111827] flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-black" />
                    Delivery & Financial Performance Assessment
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAtRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isAtRisk ? 'At Risk (High Burn)' : 'On Track (Healthy)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="space-y-1">
                    <span className="text-[#6b7280]">Burn vs Progress Ratio:</span>
                    <p className="font-mono font-bold text-[#111827]">
                      {Math.round(burnRate)}% Spent vs {project.progressPercent}% Completed
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#6b7280]">Target Margin Retention:</span>
                    <p className="font-mono font-bold text-emerald-700">
                      {profitMarginPercent}% Margin ({formatCurrency(estimatedProfit, true)} Est. Profit)
                    </p>
                  </div>
                </div>
              </div>

              {/* Workload Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-[#111827] uppercase tracking-wider text-[11px]">
                  Squad Workload & Velocity
                </h4>
                <div className="divide-y divide-[#f0f2f5] border border-[#e5e7eb] rounded-xl overflow-hidden bg-white">
                  {teamMembers.map(emp => {
                    const empTasks = tasks.filter(t => t.assigneeId === emp.id);
                    const empCompleted = empTasks.filter(t => t.status === 'Completed').length;

                    return (
                      <div key={emp.id} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#111827]">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] text-[#6b7280]">{emp.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-[#111827]">
                            {empCompleted} / {empTasks.length} Done
                          </span>
                          <p className="text-[10px] text-[#6b7280]">
                            {empTasks.length > 0 ? `${Math.round((empCompleted / empTasks.length) * 100)}% velocity` : 'No tasks assigned'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
