import React from 'react';
import {
  User,
  FileCheck,
  CheckSquare,
  ShieldCheck,
  Building,
  BarChart,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Employee Action',
      subtitle: 'Request / Expense / PTO',
      desc: 'An employee submits an expense receipt, logs daily attendance, or applies for annual PTO leave via self-service portal.',
      icon: User,
    },
    {
      step: '02',
      title: 'Manager Review',
      subtitle: 'Contextual Verification',
      desc: 'Project Manager or Team Lead receives instant notification with client project allocation details and policy compliance checks.',
      icon: FileCheck,
    },
    {
      step: '03',
      title: 'Approval Clearance',
      subtitle: 'Governed Sign-off',
      desc: 'Manager authorizes the request. High-value claims above defined limits automatically escalate to executive clearance.',
      icon: CheckSquare,
    },
    {
      step: '04',
      title: 'Processing',
      subtitle: 'Finance / HR Execution',
      desc: 'Finance disburses expense reimbursements or runs batch payroll; HR automatically updates attendance and leave ledgers.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'Company Records',
      subtitle: 'Immutable General Ledger',
      desc: 'Transactions post into double-entry accounting records with project cost-center tagging and Supabase cloud synchronization.',
      icon: Building,
    },
    {
      step: '06',
      title: 'Real-time Intelligence',
      subtitle: 'Executive Dashboards',
      desc: 'Live P&L statements, burn rates, cash runways, and workforce KPIs instantly recalculate across the executive command console.',
      icon: BarChart,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#fafbfc] border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Continuous Business Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            How the Platform Works
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Information moves seamlessly across real business workflows instead of remaining trapped in isolated siloed screens.
          </p>
        </div>

        {/* Workflow Chain Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4 hover:border-black transition-colors relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#9ca3af] px-2 py-0.5 rounded bg-[#fafbfc] border border-[#e5e7eb]">
                    Phase {item.step}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-semibold text-[#6b7280] uppercase tracking-wider">
                    {item.subtitle}
                  </div>
                  <h3 className="font-bold text-base text-[#111827] group-hover:text-black">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4b5563] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Summary Banner */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-[#111827]">
              Zero latency between operational action and executive financial reporting.
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#6b7280] bg-[#fafbfc] px-3 py-1.5 rounded-lg border border-[#e5e7eb]">
            Event-Driven Architecture • Single Ledger Truth
          </span>
        </div>
      </div>
    </section>
  );
};
