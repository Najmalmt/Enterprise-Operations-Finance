import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  Database,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenMobileSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenMobileSidebar,
  onToggleMobileSidebar,
  onOpenCommandPalette,
}) => {
  const handleToggleSidebar = onOpenMobileSidebar || onToggleMobileSidebar || (() => {});
  const { currentUser, role, position, switchRole, switchUser, logout } = useAuth();
  const { notifications, markNotificationRead, clearNotifications, supabaseConnected } = useData();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (path: string): { title: string; category: string } => {
    switch (path) {
      case '/workspace':
      case '/my-workspace': return { title: 'Personal Employee Workspace', category: 'Employee Portal' };
      case '/my-profile': return { title: 'My Employee Profile', category: 'Employee Portal' };
      case '/my-projects': return { title: 'My Assigned Engagements', category: 'Employee Portal' };
      case '/my-attendance': return { title: 'My Attendance & Clock Logs', category: 'Employee Portal' };
      case '/my-leave': return { title: 'Apply & Manage Leave Requests', category: 'Employee Portal' };
      case '/my-expenses': return { title: 'Submit & Track Expense Claims', category: 'Employee Portal' };
      case '/my-salary': return { title: 'My Monthly Salary & Payslips', category: 'Employee Portal' };
      case '/dashboard': return { title: 'Executive Operations Dashboard', category: 'Overview' };
      case '/employees': return { title: 'Employee Directory & Roster', category: 'People' };
      case '/departments': return { title: 'Organizational Departments', category: 'People' };
      case '/attendance': return { title: 'Attendance & Time Logs', category: 'People' };
      case '/leave-requests': return { title: 'Leave & PTO Management', category: 'People' };
      case '/finance': return { title: 'Corporate Finance Overview', category: 'Finance' };
      case '/transactions': return { title: 'General Ledger & Transactions', category: 'Finance' };
      case '/expenses': return { title: 'Expense Reports & Claims', category: 'Finance' };
      case '/payroll': return { title: 'Payroll Calculations & Batches', category: 'Finance' };
      case '/invoices': return { title: 'Client Invoicing & Receivables', category: 'Finance' };
      case '/budgets': return { title: 'Departmental Budgets & Forecasts', category: 'Finance' };
      case '/projects': return { title: 'Enterprise IT Client Projects', category: 'Projects' };
      case '/project-budgets': return { title: 'Project Budget Allocations', category: 'Projects' };
      case '/project-expenses': return { title: 'Project Cost Tracking', category: 'Projects' };
      case '/approvals': return { title: 'Executive Approvals Queue', category: 'Management' };
      case '/reports': return { title: 'Financial & Operational Reports', category: 'Management' };
      case '/notifications': return { title: 'System Notifications & Alerts', category: 'Management' };
      case '/audit-logs': return { title: 'Security & Audit Log Trail', category: 'Management' };
      case '/settings': return { title: 'System Settings & Supabase Configuration', category: 'System' };
      default: return { title: 'Corporate Portal', category: 'Enterprise' };
    }
  };

  const { title, category } = getPageTitle(currentPath);

  const personaList: { id: string; role: UserRole; name: string; positionLabel: string; department: string }[] = [
    { id: 'usr-1', role: 'Super Admin', name: 'Mohammed Najmal', positionLabel: 'Super Admin / CEO', department: 'Executive' },
    { id: 'usr-2', role: 'HR Manager', name: 'David Vance', positionLabel: 'HR Manager', department: 'Human Resources' },
    { id: 'usr-3', role: 'Finance Manager', name: 'Elena Rostova', positionLabel: 'Finance Manager', department: 'Finance' },
    { id: 'usr-4', role: 'Project Manager', name: 'Sarah Jenkins', positionLabel: 'Project Manager', department: 'Engineering' },
    { id: 'usr-5', role: 'Team Lead', name: 'Liam O\'Connor', positionLabel: 'Team Lead', department: 'Engineering' },
    { id: 'usr-6', role: 'Accountant', name: 'Priya Sharma', positionLabel: 'Accountant', department: 'Finance' },
    { id: 'usr-7', role: 'HR Executive', name: 'Hannah Brooks', positionLabel: 'HR Executive', department: 'Human Resources' },
    { id: 'usr-8', role: 'Employee', name: 'Alex Rivera', positionLabel: 'Staff Engineer (Employee)', department: 'Engineering' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#e5e7eb] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      {/* Left side: Hamburger (mobile) + Breadcrumbs & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280]">
            <span>NEXORA</span>
            <span>/</span>
            <span>{category}</span>
          </div>
          <h1 className="text-sm sm:text-base font-semibold text-[#111827] truncate tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search / Command Palette Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#f8f9fa] hover:bg-[#f3f4f6] border border-[#e5e7eb] rounded-lg text-xs text-[#6b7280] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#9ca3af]" />
          <span className="text-xs">Quick search commands...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#e5e7eb] rounded text-[#6b7280] shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Supabase backend status pill */}
        <div
          onClick={() => onNavigate('/settings')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-[#e5e7eb] bg-[#fafbfc] text-[#4b5563] cursor-pointer hover:bg-[#f3f4f6] transition-colors"
          title={supabaseConnected ? 'Supabase cloud database connected' : 'Supabase configured with local sync fallback'}
        >
          <Database className="w-3 h-3 text-emerald-600" />
          <span className="hidden xl:inline">Supabase</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Quick Role Switcher (Crucial for Demoing HR, Finance, PM, Admin permissions!) */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-black transition-colors cursor-pointer shadow-2xs"
            title="Switch User Role & Permissions"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">{role}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#e5e7eb] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-[#f0f2f5] bg-[#fafbfc]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#111827]">
                  Switch Position / Persona
                </p>
                <p className="text-[10px] text-[#6b7280]">Demonstrates real-world RBAC boundaries</p>
              </div>
              <div className="max-h-80 overflow-y-auto py-1 divide-y divide-[#f9fafb]">
                {personaList.map((p) => {
                  const isSelected = currentUser?.id === p.id || (role === p.role && !currentUser);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchUser(p.id);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#f3f4f6] font-semibold text-[#111827]'
                          : 'text-[#4b5563] hover:bg-[#f9fafb] hover:text-[#111827]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-[#111827] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#6b7280] truncate">{p.positionLabel}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-black shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-[#e5e7eb] shadow-2xl z-50 overflow-hidden animate-in fade-in">
              <div className="px-4 py-3 border-b border-[#f0f2f5] flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-[#111827]">System Notifications</h4>
                  {unreadNotifs.length > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-zinc-900 text-white rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-[#6b7280] hover:text-black font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#f0f2f5]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#6b7280]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTo) {
                          onNavigate(n.linkTo);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 text-xs transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-[#fcfdfe] hover:bg-[#f8f9fa]' : 'hover:bg-[#fafbfc] opacity-75'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-black shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#111827] text-xs">{n.title}</p>
                        <p className="text-[11px] text-[#4b5563] mt-0.5 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-[#9ca3af] mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#f0f2f5] bg-[#fafbfc] text-center">
                <button
                  onClick={() => {
                    onNavigate('/notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-black font-medium hover:underline inline-flex items-center gap-1"
                >
                  View all notification center <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#f3f4f6] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-2xs">
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('') : 'NX'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#111827] leading-tight">
                {currentUser?.name || 'Mohammed Najmal'}
              </span>
              <span className="text-[10px] text-[#6b7280] leading-tight">
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af] hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-[#e5e7eb] shadow-xl py-1.5 z-50 animate-in fade-in">
              <div className="px-4 py-2.5 border-b border-[#f0f2f5]">
                <p className="text-xs font-semibold text-[#111827]">{currentUser?.name}</p>
                <p className="text-[11px] text-[#6b7280] truncate">{currentUser?.email}</p>
                <p className="text-[10px] font-medium text-emerald-700 mt-1 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                  {currentUser?.role}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('/employees');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] flex items-center gap-2.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  My Personnel Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] flex items-center gap-2.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings & Cloud DB
                </button>
              </div>

              <div className="pt-1 border-t border-[#f0f2f5]">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
