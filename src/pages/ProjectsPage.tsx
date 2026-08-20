import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Download
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Project, ProjectStatus, ProjectPriority } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CreateProjectModal } from '../components/modals/CreateProjectModal';
import { ProjectDetailDrawer } from '../components/modals/ProjectDetailDrawer';

export const ProjectsPage: React.FC = () => {
  const { projects } = useData();
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const canCreateProject = hasPermission('create_project');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || p.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchTerm, selectedStatus, selectedPriority]);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progressPercent, 0) / projects.length)
    : 0;

  const exportCSV = () => {
    const headers = ['Code,Project Name,Client,Lead,Status,Priority,Start Date,End Date,Budget,Spent,Progress\n'];
    const rows = filteredProjects.map(p =>
      `"${p.code}","${p.name}","${p.client}","${p.leadName}","${p.status}","${p.priority}","${p.startDate}","${p.endDate}",${p.budget},${p.spent},${p.progressPercent}`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-projects-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Enterprise IT Projects & Client Engagements
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800">
              {projects.length} Active Engagements
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Architecture delivery timelines, client milestone tracking, and project-specific budget burn.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Portfolio CSV
          </Button>
          {canCreateProject && (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Launch Project
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Total Portfolio Budget</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalBudget, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{projects.length} contracted accounts</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Actual Spent / Burn</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalSpent, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilized
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Mean Sprint Progress</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{avgProgress}%</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">On schedule</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Active Deployments</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">
            {projects.filter(p => p.status === 'Active').length}
          </p>
          <p className="text-[11px] text-[#6b7280] mt-1">Core enterprise infra</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card noPadding>
        <div className="p-4 border-b border-[#f0f2f5] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by name, code, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <div className="flex bg-[#f3f4f6] p-0.5 rounded-lg border border-[#e5e7eb]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white text-black shadow-2xs' : 'text-[#6b7280]'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white text-black shadow-2xs' : 'text-[#6b7280]'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No client projects found"
            description="Adjust your search query or filters to find project records."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedStatus('All');
              setSelectedPriority('All');
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((p) => {
              const remaining = p.budget - p.spent;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="p-5 bg-white rounded-xl border border-[#e5e7eb] hover:border-zinc-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#6b7280]">
                        [{p.code}]
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getStatusBadgeVariant(p.status)} size="sm">
                          {p.status}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-[#111827] mt-2 group-hover:text-black leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[#6b7280] mt-0.5">
                      Client: <strong className="text-[#374151]">{p.client}</strong>
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6b7280]">Sprint Progress</span>
                      <span className="font-mono font-bold text-[#111827]">{p.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#f0f2f5] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-300"
                        style={{ width: `${p.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="pt-3 border-t border-[#f0f2f5] grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#6b7280] font-sans block">Budget</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(p.budget, true)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#6b7280] font-sans block">Spent</span>
                      <span className="font-bold text-[#374151]">{formatCurrency(p.spent, true)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6b7280] pt-1">
                    <span>Lead: {p.leadName.split(' ')[0]}</span>
                    <span>Due: {formatDate(p.endDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Code & Project</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3 text-right">Budget</th>
                  <th className="px-4 py-3 text-right">Spent</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className="hover:bg-[#fafbfc] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] font-bold text-[#6b7280] mr-2">[{p.code}]</span>
                      <strong className="text-[#111827] font-semibold">{p.name}</strong>
                    </td>
                    <td className="px-4 py-3.5 text-[#374151] font-medium">{p.client}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getStatusBadgeVariant(p.status)} size="sm">{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280]">{p.leadName}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">{p.progressPercent}%</td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold">{formatCurrency(p.budget)}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-[#6b7280]">{formatCurrency(p.spent)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-[#9ca3af] inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
