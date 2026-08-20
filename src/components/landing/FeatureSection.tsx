import React from 'react';
import {
  Users,
  DollarSign,
  Banknote,
  Receipt,
  Briefcase,
  FileText,
  CheckSquare,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';

interface FeatureSectionProps {
  onExploreDemo: (path?: string) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ onExploreDemo }) => {
  const features = [
    {
      id: 'employees',
      title: 'Employee Management',
      description: 'Manage employees, departments, attendance, leave and employee information.',
      icon: Users,
      path: '/employees',
      badge: 'People Ops',
      details: ['Comprehensive employee directory', 'Department allocations & headcount', 'Remote & geofence attendance logs', 'Leave & PTO balances'],
    },
    {
      id: 'finance',
      title: 'Finance Management',
      description: 'Track company revenue, expenses, transactions, budgets and financial performance.',
      icon: DollarSign,
      path: '/finance',
      badge: 'Treasury & P&L',
      details: ['Multi-currency general ledger', 'Automated transaction reconciliation', 'Departmental budget ceilings', 'Cash flow runway forecasts'],
    },
    {
      id: 'payroll',
      title: 'Payroll',
      description: 'Manage salaries, payroll records and employee payslips.',
      icon: Banknote,
      path: '/payroll',
      badge: 'Compensation',
      details: ['1-Click monthly batch processing', 'Direct net disbursal calculator', 'Statutory tax deductions & benefits', 'Individual downloadable payslips'],
    },
    {
      id: 'expenses',
      title: 'Expense Management',
      description: 'Submit, review, approve and track employee and company expenses.',
      icon: Receipt,
      path: '/expenses',
      badge: 'Claims & Audit',
      details: ['Receipt verification & attachment', 'Configurable auto-approval caps', 'Client project billable mapping', 'Status tracking & instant reimbursement'],
    },
    {
      id: 'projects',
      title: 'Project Management',
      description: 'Manage projects, project teams, budgets, spending and progress.',
      icon: Briefcase,
      path: '/projects',
      badge: 'Engagements',
      details: ['Squad resource allocation', 'Milestone & sprint tracking', 'Budget vs. actual expenditure burn', 'Real-time project profit margins'],
    },
    {
      id: 'invoices',
      title: 'Invoice Management',
      description: 'Create invoices, track payments and monitor overdue invoices.',
      icon: FileText,
      path: '/invoices',
      badge: 'Billing & AR',
      details: ['Enterprise PDF invoice generator', 'Payment receipt & terms tracking', 'Aging receivables notifications', 'Client accounts management'],
    },
    {
      id: 'approvals',
      title: 'Approval Workflows',
      description: 'Manage leave, expenses and other business approvals.',
      icon: CheckSquare,
      path: '/approvals',
      badge: 'Governance',
      details: ['Tiered clearance queues', 'Manager & CEO dual signoffs', 'Instant approve / reject with notes', 'Complete audit trail logging'],
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'Understand company performance through professional financial and operational reporting.',
      icon: BarChart3,
      path: '/reports',
      badge: 'Intelligence',
      details: ['P&L statements & trend visualizers', 'Headcount growth & attrition metrics', 'Budget variance analysis', 'CSV & PDF export readiness'],
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Comprehensive Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Everything Your IT Company Needs
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Engineered specifically for technology services, digital product studios, and enterprise engineering departments to run lean, transparent, and profitable operations.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex flex-col justify-between hover:border-black hover:shadow-sm transition-all duration-150 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#fafbfc] border border-[#e5e7eb] text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#111827] group-hover:text-black">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4b5563] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-[#f0f2f5]">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="text-[11px] text-[#6b7280] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-zinc-400 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-[#f0f2f5]">
                  <button
                    onClick={() => onExploreDemo(item.path)}
                    className="w-full text-left text-xs font-semibold text-black hover:text-black/80 flex items-center justify-between group-hover:underline cursor-pointer"
                  >
                    <span>Launch in Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
