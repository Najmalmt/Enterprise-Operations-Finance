import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EmployeePortalPage } from './pages/EmployeePortalPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { FinancePage } from './pages/FinancePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { PayrollPage } from './pages/PayrollPage';
import { AttendancePage } from './pages/AttendancePage';
import { SettingsPage } from './pages/SettingsPage';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './components/common/Button';

const AppContent: React.FC = () => {
  const { role, hasAccess } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => role === 'Employee' ? '/workspace' : '/dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderAccessDenied = (requiredRole: string) => (
    <div className="p-8 sm:p-12 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm max-w-xl mx-auto my-12 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#111827]">Access Restricted to {requiredRole}</h3>
        <p className="text-xs text-[#6b7280] mt-1 max-w-md mx-auto">
          Your current role (<span className="font-semibold text-black">{role}</span>) does not have administrative clearance to access this module under our Enterprise Governance policy.
        </p>
      </div>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Button variant="primary" size="sm" onClick={() => handleNavigate('/workspace')} icon={Sparkles}>
          Go to My Workspace
        </Button>
      </div>
    </div>
  );

  const renderActivePage = () => {
    // If standard employee tries to view default dashboard, show workspace
    if (role === 'Employee' && (currentPath === '/dashboard' || currentPath === '/')) {
      return <EmployeePortalPage initialTab="overview" />;
    }

    switch (currentPath) {
      // Dedicated Employee Portal routes
      case '/workspace':
      case '/my-workspace':
        return <EmployeePortalPage initialTab="overview" />;
      case '/my-profile':
        return <EmployeePortalPage initialTab="profile" />;
      case '/my-projects':
        return <EmployeePortalPage initialTab="projects" />;
      case '/my-attendance':
        return <EmployeePortalPage initialTab="attendance" />;
      case '/my-leave':
        return <EmployeePortalPage initialTab="leave" />;
      case '/my-expenses':
        return <EmployeePortalPage initialTab="expenses" />;
      case '/my-salary':
        return <EmployeePortalPage initialTab="salary" />;

      // Executive & Operations Dashboard
      case '/dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;

      // HR & People Module
      case '/employees':
      case '/departments':
        if (!hasAccess('employees') && role === 'Employee') {
          return renderAccessDenied('HR Manager / HR Executive');
        }
        return <EmployeesPage />;

      // Finance Module
      case '/finance':
      case '/transactions':
      case '/budgets':
      case '/approvals':
      case '/reports':
        if (!hasAccess('finance') && !hasAccess('management') && role === 'Employee') {
          return renderAccessDenied('Finance Manager / Accountant');
        }
        return <FinancePage />;

      // Projects Module
      case '/projects':
      case '/project-budgets':
      case '/project-expenses':
        if (!hasAccess('projects') && role === 'Employee') {
          return <EmployeePortalPage initialTab="projects" />;
        }
        return <ProjectsPage />;

      // Expenses Module
      case '/expenses':
        if (role === 'Employee') {
          return <EmployeePortalPage initialTab="expenses" />;
        }
        return <ExpensesPage />;

      // Invoices Module
      case '/invoices':
        if (!hasAccess('finance') && role === 'Employee') {
          return renderAccessDenied('Finance Manager / Accountant');
        }
        return <InvoicesPage />;

      // Payroll Module
      case '/payroll':
        if (!hasAccess('payroll')) {
          if (role === 'Employee') {
            return <EmployeePortalPage initialTab="salary" />;
          }
          return renderAccessDenied('Finance Manager');
        }
        return <PayrollPage />;

      // Attendance & Leave Requests Module
      case '/attendance':
      case '/leave-requests':
        if (role === 'Employee') {
          return currentPath === '/leave-requests' 
            ? <EmployeePortalPage initialTab="leave" /> 
            : <EmployeePortalPage initialTab="attendance" />;
        }
        return <AttendancePage />;

      // Settings & System
      case '/settings':
      case '/notifications':
      case '/audit-logs':
        return <SettingsPage />;

      default:
        return role === 'Employee' ? <EmployeePortalPage initialTab="overview" /> : <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] flex font-sans antialiased selection:bg-black selection:text-white">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
