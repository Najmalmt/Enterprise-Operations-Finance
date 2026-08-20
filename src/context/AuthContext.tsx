import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, UserRole, UserPosition, Permission } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Super Admin': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_all_employees', 'create_employee', 'edit_employee', 'manage_departments', 'view_company_attendance', 'approve_leave', 'manage_employee_status',
    'view_company_finance', 'approve_expenses', 'disburse_expenses', 'process_payroll', 'view_all_payslips', 'manage_invoices', 'manage_transactions', 'manage_budgets', 'view_financial_reports',
    'create_project', 'edit_project', 'assign_team', 'manage_project_budget', 'view_project_expenses',
    'manage_roles', 'view_audit_logs', 'manage_system_settings'
  ],
  'HR Manager': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_all_employees', 'create_employee', 'edit_employee', 'manage_departments', 'view_company_attendance', 'approve_leave', 'manage_employee_status'
  ],
  'Finance Manager': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_company_finance', 'approve_expenses', 'disburse_expenses', 'process_payroll', 'view_all_payslips', 'manage_invoices', 'manage_transactions', 'manage_budgets', 'view_financial_reports'
  ],
  'Project Manager': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_all_employees', 'create_project', 'edit_project', 'assign_team', 'manage_project_budget', 'view_project_expenses'
  ],
  'Team Lead': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_all_employees', 'view_company_attendance', 'edit_project', 'assign_team', 'view_project_expenses'
  ],
  'Accountant': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_company_finance', 'manage_invoices', 'manage_transactions', 'view_financial_reports'
  ],
  'HR Executive': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications',
    'view_all_employees', 'create_employee', 'edit_employee', 'manage_departments', 'view_company_attendance', 'manage_employee_status'
  ],
  'Employee': [
    'view_own_profile', 'edit_own_profile', 'view_own_projects', 'view_own_attendance', 'clock_in_out', 'apply_leave', 'view_own_leave', 'submit_expense', 'view_own_expenses', 'view_own_payslips', 'view_notifications'
  ]
};

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  currentRole: UserRole;
  position: UserPosition;
  isAuthenticated: boolean;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasAccess: (module: 'finance' | 'employees' | 'projects' | 'payroll' | 'expenses' | 'management' | 'settings') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'nexora_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to Mohammed Najmal (Super Admin / CEO)
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Check Supabase session if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const userEmail = session.user.email || '';
          const match = INITIAL_USERS.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
          if (match) {
            setCurrentUser(match);
          }
        }
      }).catch(err => console.warn('Supabase session fetch error:', err));
    }
  }, []);

  const role: UserRole = currentUser?.role || 'Employee';
  const position: UserPosition = currentUser?.position || (role as UserPosition);

  const permissions = useMemo<Permission[]>(() => {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Employee'];
  }, [role]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const switchRole = (newRole: UserRole) => {
    const found = INITIAL_USERS.find(u => u.role === newRole) || INITIAL_USERS[0];
    setCurrentUser(found);
  };

  const switchUser = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId) || INITIAL_USERS[0];
    setCurrentUser(found);
  };

  const login = async (email: string): Promise<boolean> => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      employeeId: 'emp-5',
      name: email.split('@')[0],
      email,
      role: 'Employee' as UserRole,
      position: 'Employee' as UserPosition,
      title: 'Enterprise Staff Member',
      departmentName: 'Engineering & DevOps'
    };
    setCurrentUser(found);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setCurrentUser(null);
  };

  const hasAccess = (module: 'finance' | 'employees' | 'projects' | 'payroll' | 'expenses' | 'management' | 'settings'): boolean => {
    if (!currentUser) return false;
    if (role === 'Super Admin') return true;

    switch (module) {
      case 'finance':
        return role === 'Finance Manager' || role === 'Accountant';
      case 'payroll':
        return role === 'Finance Manager';
      case 'employees':
        return role === 'HR Manager' || role === 'HR Executive' || role === 'Project Manager' || role === 'Team Lead';
      case 'projects':
        return role === 'Project Manager' || role === 'Team Lead';
      case 'expenses':
        return true; // All roles can access expenses (employees see their own + submission, finance approves)
      case 'management':
        return role === 'HR Manager' || role === 'Finance Manager' || role === 'Project Manager';
      case 'settings':
        return false;
      default:
        return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        currentRole: role,
        position,
        isAuthenticated: !!currentUser,
        permissions,
        hasPermission,
        switchRole,
        switchUser,
        login,
        logout,
        hasAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
