import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Briefcase,
  Users,
  Layers,
  UserCheck,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Eye,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types';
import { Button } from '../common/Button';

interface RoleSectionProps {
  onExploreRoleDemo: (role: UserRole) => void;
}

export const RoleSection: React.FC<RoleSectionProps> = ({ onExploreRoleDemo }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');

  const roleProfiles: {
    role: UserRole;
    title: string;
    badge: string;
    icon: React.ElementType;
    tagline: string;
    responsibilities: string[];
    visibleModules: string[];
    sampleUser: string;
    sampleEmail: string;
  }[] = [
    {
      role: 'Super Admin',
      title: 'CEO / Super Admin',
      badge: 'Unrestricted Access',
      icon: Crown,
      tagline: 'Has overall control of the company system and can see company-wide performance.',
      responsibilities: [
        'Complete executive oversight across all revenue, expenditures, cash runways, and profit margins',
        'Direct authority to approve high-value invoices, enterprise projects, and emergency budgets',
        'Manage global user credentials, role permissions, and immutable system audit ledgers',
        'Trigger company-wide broadcast announcements and configure legal entity parameters',
      ],
      visibleModules: ['Executive Command Dashboard', 'Corporate Finance & Treasury', 'Personnel & Org Structure', 'Project Portfolio', 'Payroll Disbursal', 'Governance & Security'],
      sampleUser: 'Mohammed Najmal',
      sampleEmail: 'najmal@nexora.io',
    },
    {
      role: 'HR Manager',
      title: 'HR Manager',
      badge: 'People & Operations',
      icon: Users,
      tagline: 'Responsible for employees, departments, attendance, leave approvals, and workforce records.',
      responsibilities: [
        'Onboard new talent, manage employee profiles, and assign organizational departments',
        'Review and approve employee time-off (PTO) and sick leave requests in real-time',
        'Monitor enterprise attendance rates, shift hours, and remote geofence logs',
        'Ensure personnel records and compliance documents remain up to date',
      ],
      visibleModules: ['Personnel Directory', 'Department Allocations', 'Attendance Logs', 'Leave Approvals Queue', 'Employee Documents'],
      sampleUser: 'Farhana Yasmin',
      sampleEmail: 'farhana.y@nexora.io',
    },
    {
      role: 'Finance Manager',
      title: 'Finance Manager',
      badge: 'Treasury & Compliance',
      icon: Shield,
      tagline: 'Oversees financial health, treasury allocations, budget compliance, invoices, and payroll disbursals.',
      responsibilities: [
        'Execute monthly batch payroll runs and generate cryptographic payslips',
        'Issue client invoices, track receivables, and enforce overdue payment notices',
        'Audit expense claims against company threshold policies prior to reimbursement',
        'Maintain budget limits across business units and monitor cash reserves',
      ],
      visibleModules: ['Corporate Finance Ledger', 'Payroll Processing', 'Client Invoices', 'Expense Clearances', 'Budget Allocations'],
      sampleUser: 'Arjun Mehta',
      sampleEmail: 'arjun.m@nexora.io',
    },
    {
      role: 'Project Manager',
      title: 'Project Manager',
      badge: 'Deliverables & Budgets',
      icon: Briefcase,
      tagline: 'Project milestone management, technical squad allocation, sprint progress, and project budget tracking.',
      responsibilities: [
        'Plan sprint deliverables, set milestone targets, and monitor squad velocity',
        'Track billable project expenditures vs. approved client budget envelopes',
        'Assign engineers and technical team leads to active client deliverables',
        'Review project-specific expense claims prior to finance clearance',
      ],
      visibleModules: ['Project Portfolio', 'Squad Allocations', 'Sprint Deliverables', 'Project Cost Tracking'],
      sampleUser: 'Sarah Jenkins',
      sampleEmail: 'sarah.j@nexora.io',
    },
    {
      role: 'Team Lead',
      title: 'Engineering Team Lead',
      badge: 'Squad Operations',
      icon: Layers,
      tagline: 'Squad leadership, sprint task execution, member check-ins, and squad project delivery.',
      responsibilities: [
        'Coordinate day-to-day sprint tickets and task assignments for engineers',
        'Conduct initial reviews of team member leave schedules and sprint capacity',
        'Submit and endorse squad hardware and cloud tooling expense requests',
        'Monitor squad attendance and milestone delivery deadlines',
      ],
      visibleModules: ['Squad Tasks', 'Project Milestones', 'Team Attendance', 'Squad Expense Requests'],
      sampleUser: 'David Chen',
      sampleEmail: 'david.c@nexora.io',
    },
    {
      role: 'Employee',
      title: 'Staff / Self-Service',
      badge: 'Personal Workspace',
      icon: UserCheck,
      tagline: 'Self-service portal for personal expense filing, biometric/remote check-in, and PTO time-off requests.',
      responsibilities: [
        'Submit digital expense receipts with auto-calculated currency conversions',
        'Log daily remote or in-office attendance with one click',
        'Apply for annual PTO or sick leaves and track live approval status',
        'View monthly salary breakdowns and download confidential payslips',
      ],
      visibleModules: ['My Workspace', 'My Attendance', 'Apply Leave', 'Submit Expense', 'My Salary & Payslips'],
      sampleUser: 'Priya Sharma',
      sampleEmail: 'priya.s@nexora.io',
    },
  ];

  const currentProfile = roleProfiles.find((p) => p.role === selectedRole) || roleProfiles[0];
  const CurrentIcon = currentProfile.icon;

  return (
    <section id="roles" className="py-16 md:py-24 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Role-Based Governance
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Built Around Every Role
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Different team members need different tools. NEXORA delivers custom-tailored views and strict permission barriers so everyone operates with laser focus.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2">
          {roleProfiles.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-[#fafbfc] text-[#4b5563] border-[#e5e7eb] hover:border-black hover:text-black'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#6b7280]'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Feature Display Card */}
        <div className="bg-[#fafbfc] rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                    <CurrentIcon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-[#111827]">{currentProfile.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-200 text-zinc-800">
                    {currentProfile.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                  {currentProfile.tagline}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] block">
                  Core Operational Clearances:
                </span>
                <div className="space-y-2">
                  {currentProfile.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#374151]">
                      <CheckCircle className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onExploreRoleDemo(currentProfile.role)}
                  icon={ArrowRight}
                  className="shadow-xs cursor-pointer"
                >
                  Launch Live Demo as {currentProfile.title}
                </Button>
              </div>
            </div>

            {/* Right Preview Card Column */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f2f5]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentProfile.sampleUser.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-bold text-[#111827] leading-tight">{currentProfile.sampleUser}</div>
                    <div className="text-[10px] text-[#6b7280]">{currentProfile.sampleEmail}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-semibold text-[#6b7280]">
                  Authorized Portal Modules:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.visibleModules.map((mod, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#fafbfc] border border-[#e5e7eb] text-[11px] font-medium text-[#374151]"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-[#111827] font-semibold">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#6b7280]" /> Security Boundary
                  </span>
                  <span className="font-mono text-[10px] text-[#6b7280]">RBAC Enforced</span>
                </div>
                <p className="text-[#6b7280] text-[10px] leading-snug">
                  User is restricted strictly to designated module endpoints with server-side validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
