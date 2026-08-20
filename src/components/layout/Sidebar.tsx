import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  Wallet,
  ArrowLeftRight,
  Receipt,
  Banknote,
  FileText,
  PieChart,
  Briefcase,
  Layers,
  DollarSign,
  CheckSquare,
  BarChart3,
  Bell,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
  HelpCircle,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badgeCount?: number;
  module?: 'finance' | 'employees' | 'projects' | 'payroll' | 'expenses' | 'management' | 'settings';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { role, position, hasAccess } = useAuth();
  const { financialSummary, notifications, leaveRequests, expenses } = useData();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').length;

  const isStandardEmployee = role === 'Employee';

  const employeeWorkspaceGroup: NavGroup = {
    title: 'MY WORKSPACE',
    items: [
      { id: 'workspace', label: 'My Workspace', icon: Sparkles, path: '/workspace' },
      { id: 'my-profile', label: 'My Profile', icon: UserIcon, path: '/my-profile' },
      { id: 'my-projects', label: 'My Projects', icon: Briefcase, path: '/my-projects' },
      { id: 'my-attendance', label: 'My Attendance', icon: Clock, path: '/my-attendance' },
      { id: 'my-leave', label: 'Apply / My Leave', icon: CalendarDays, path: '/my-leave' },
      { id: 'my-expenses', label: 'Submit / My Claims', icon: Receipt, path: '/my-expenses' },
      { id: 'my-salary', label: 'My Salary / Payslips', icon: Banknote, path: '/my-salary' },
      { 
        id: 'notifications', 
        label: 'Notifications', 
        icon: Bell, 
        path: '/notifications',
        badgeCount: unreadNotifs > 0 ? unreadNotifs : undefined
      },
    ],
  };

  const managementGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'personal-workspace', label: 'My Personal Portal', icon: Sparkles, path: '/workspace' },
      ],
    },
    {
      title: 'PEOPLE & HR',
      items: [
        { id: 'employees', label: 'Employee Directory', icon: Users, path: '/employees', module: 'employees' },
        { id: 'departments', label: 'Departments Roster', icon: Building2, path: '/departments', module: 'employees' },
        { id: 'attendance', label: 'Attendance Monitor', icon: Clock, path: '/attendance', module: 'employees' },
        { 
          id: 'leave-requests', 
          label: 'Leave Approvals', 
          icon: CalendarDays, 
          path: '/leave-requests', 
          badgeCount: pendingLeaves > 0 ? pendingLeaves : undefined,
          module: 'employees' 
        },
      ],
    },
    {
      title: 'TREASURY & FINANCE',
      items: [
        { id: 'finance', label: 'Finance Ledger', icon: Wallet, path: '/finance', module: 'finance' },
        { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, path: '/transactions', module: 'finance' },
        { 
          id: 'expenses', 
          label: 'Expense Claims', 
          icon: Receipt, 
          path: '/expenses', 
          badgeCount: pendingExpenses > 0 ? pendingExpenses : undefined,
          module: 'expenses' 
        },
        { id: 'payroll', label: 'Payroll Processing', icon: Banknote, path: '/payroll', module: 'payroll' },
        { id: 'invoices', label: 'Client Invoices', icon: FileText, path: '/invoices', module: 'finance' },
        { id: 'budgets', label: 'Budgets & OPEX', icon: PieChart, path: '/budgets', module: 'finance' },
      ],
    },
    {
      title: 'PROJECTS & DELIVERY',
      items: [
        { id: 'projects', label: 'Projects Portfolio', icon: Briefcase, path: '/projects', module: 'projects' },
        { id: 'project-budgets', label: 'Project Budgets', icon: Layers, path: '/project-budgets', module: 'projects' },
        { id: 'project-expenses', label: 'Project Costs', icon: DollarSign, path: '/project-expenses', module: 'projects' },
      ],
    },
    {
      title: 'MANAGEMENT & AUDIT',
      items: [
        { 
          id: 'approvals', 
          label: 'Approvals Hub', 
          icon: CheckSquare, 
          path: '/approvals', 
          badgeCount: financialSummary.pendingApprovalsCount,
          module: 'management' 
        },
        { id: 'reports', label: 'Financial Reports', icon: BarChart3, path: '/reports', module: 'management' },
        { 
          id: 'notifications', 
          label: 'Alerts & Activity', 
          icon: Bell, 
          path: '/notifications',
          badgeCount: unreadNotifs > 0 ? unreadNotifs : undefined,
        },
        { id: 'audit-logs', label: 'Audit Trail', icon: ScrollText, path: '/audit-logs', module: 'management' },
      ],
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { id: 'settings', label: 'System Settings', icon: Settings, path: '/settings', module: 'settings' },
      ],
    },
  ];

  const navigationGroups: NavGroup[] = isStandardEmployee ? [employeeWorkspaceGroup] : managementGroups;

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0c1017] text-white border-r border-[#1e2633] transition-all duration-300 ease-in-out select-none
          ${isCollapsed ? 'w-18' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e2633] shrink-0">
          <div
            onClick={() => handleItemClick('/dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
          >
            {/* Logo Mark */}
            <div className="w-8.5 h-8.5 rounded-lg bg-white flex items-center justify-center text-black font-bold text-base shadow-sm shrink-0 tracking-tighter">
              <span className="bg-black text-white px-1 py-0.5 rounded text-xs font-black">NX</span>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-white tracking-wider flex items-center gap-1.5">
                  NEXORA
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium truncate">
                  Enterprise Operations
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group, gIdx) => {
            // Filter items based on access
            const filteredItems = group.items.filter(item => {
              if (!item.module) return true;
              return hasAccess(item.module);
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed ? (
                  <div className="px-3 pb-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{group.title}</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center py-1">
                    <span className="w-4 h-0.5 bg-zinc-700/60 rounded-full" />
                  </div>
                )}

                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.path)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                          isActive
                            ? 'bg-white text-black shadow-sm font-semibold'
                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                        } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                            isActive ? 'text-black stroke-[2.2]' : 'text-zinc-400 group-hover:text-zinc-200 stroke-[1.8]'
                          }`}
                        />

                        {!isCollapsed && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}

                        {!isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                              isActive
                                ? 'bg-black text-white'
                                : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                            }`}
                          >
                            {item.badgeCount}
                          </span>
                        )}

                        {/* Collapsed Badge Dot */}
                        {isCollapsed && item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0c1017]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-[#1e2633] bg-[#080b10]/60 shrink-0 space-y-2">
            <button
              onClick={() => handleItemClick('/')}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border border-[#1e2633]"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Public Landing Page</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Exit Demo →</span>
            </button>
            <div className="flex items-center justify-between px-2 py-0.5 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                System Operational
              </span>
              <span className="text-[10px] font-mono text-zinc-400">v3.4-PROD</span>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-[#1e2633] flex justify-center shrink-0">
            <button
              onClick={() => handleItemClick('/')}
              title="Public Landing Page"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
