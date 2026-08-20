import React from 'react';
import {
  Users,
  Briefcase,
  Receipt,
  Banknote,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Layers
} from 'lucide-react';

export const ProductIntro: React.FC = () => {
  const pipelineSteps = [
    {
      icon: Users,
      label: 'People & Teams',
      subtext: 'Engineers, Leads, HR & Managers',
      tag: 'Step 01',
    },
    {
      icon: Briefcase,
      label: 'Client Projects',
      subtext: 'Sprints, Milestones & Scopes',
      tag: 'Step 02',
    },
    {
      icon: Receipt,
      label: 'Expense Claims',
      subtext: 'Cloud, Hardware & Per-diems',
      tag: 'Step 03',
    },
    {
      icon: Banknote,
      label: 'Automated Payroll',
      subtext: 'Tax, Deductions & Disbursals',
      tag: 'Step 04',
    },
    {
      icon: DollarSign,
      label: 'Corporate Finance',
      subtext: 'Invoicing, Budgets & Ledger',
      tag: 'Step 05',
    },
    {
      icon: TrendingUp,
      label: 'Business Performance',
      subtext: 'Real-time Net Profit & Growth',
      tag: 'Step 06',
    },
  ];

  const connectedModules = [
    {
      title: 'Real-Time Operational Interlock',
      description: 'When an engineer submits an AWS cloud receipt, it automatically maps to the client project budget, notifies the Project Manager for clearance, decrements the departmental ledger upon approval, and updates executive profitability models without manual reconciliation.',
    },
    {
      title: 'Zero Data Silos',
      description: 'Break down barriers between human resources, engineering squads, and treasury operations. One unified PostgreSQL-backed single source of truth across all 8 organizational tiers.',
    },
    {
      title: 'Governed Approvals at Every Layer',
      description: 'Configurable approval caps, automated dual-signoffs for transactions above critical thresholds, and cryptographically recorded audit streams prevent unauthorized expenditures.',
    },
  ];

  return (
    <section id="platform" className="py-16 md:py-24 bg-white border-y border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Unified Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            One Platform for IT Operations and Finance
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Eliminate fragmented spreadsheets and disparate SaaS tools. NEXORA bridges people operations, technical deliverables, and financial treasury into a cohesive, high-velocity operating system.
          </p>
        </div>

        {/* Visual Workflow Pipeline Flow */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb] hover:border-black transition-colors duration-150 flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[#9ca3af] font-semibold">
                      {step.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-[#111827] group-hover:text-black">
                      {step.label}
                    </h3>
                    <p className="text-[11px] text-[#6b7280] mt-0.5 leading-snug">
                      {step.subtext}
                    </p>
                  </div>

                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-white border border-[#e5e7eb] text-[#9ca3af] flex items-center justify-center">
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {connectedModules.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#f8f9fa] border border-[#e5e7eb] space-y-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black shrink-0" />
                <h4 className="font-bold text-xs text-[#111827]">{item.title}</h4>
              </div>
              <p className="text-[#4b5563] leading-relaxed text-[11px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
