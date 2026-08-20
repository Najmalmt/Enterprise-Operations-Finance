import React from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  Receipt,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';

interface OperationsSectionProps {
  onExploreDemo: (path?: string) => void;
}

export const OperationsSection: React.FC<OperationsSectionProps> = ({ onExploreDemo }) => {
  const connectionChain = [
    {
      title: 'Employees',
      desc: 'Engineers, Architects, Leads & Consultants',
      icon: Users,
      path: '/employees',
    },
    {
      title: 'Departments',
      desc: 'Cost-center governance & headcount caps',
      icon: Building2,
      path: '/departments',
    },
    {
      title: 'Client Projects',
      desc: 'Milestones, sprint scopes & deliverables',
      icon: Briefcase,
      path: '/projects',
    },
    {
      title: 'Project Budgets',
      desc: 'Cap allocations & burn rate guardrails',
      icon: Layers,
      path: '/projects',
    },
    {
      title: 'Expenses & Costs',
      desc: 'Cloud compute, tooling & travel receipts',
      icon: Receipt,
      path: '/expenses',
    },
    {
      title: 'Performance',
      desc: 'Net margins, delivery velocity & ROI',
      icon: TrendingUp,
      path: '/dashboard',
    },
  ];

  return (
    <section id="operations" className="py-16 md:py-24 bg-[#fafbfc] border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Connected Enterprise Structure
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            From Employees to Projects
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Every technical sprint, employee timesheet, and cloud invoice maps directly back to company performance. No disjointed databases. No missing context.
          </p>
        </div>

        {/* Interconnected Visual Chain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {connectionChain.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex flex-col justify-between space-y-3 hover:border-black transition-colors group cursor-pointer"
                onClick={() => onExploreDemo(node.path)}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#fafbfc] border border-[#e5e7eb] text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9ca3af]">0{idx + 1}</span>
                </div>

                <div>
                  <h3 className="font-bold text-xs text-[#111827] group-hover:text-black">
                    {node.title}
                  </h3>
                  <p className="text-[11px] text-[#6b7280] mt-0.5 leading-snug">
                    {node.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0f2f5] flex items-center justify-between text-[10px] font-semibold text-[#111827] group-hover:underline">
                  <span>View in App</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Highlights Box */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 lg:p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#111827]">
              Eliminate Project Cost Overruns Before They Happen
            </h3>
            <p className="text-[#4b5563] leading-relaxed">
              Traditional IT firms only discover project margin erosion weeks after sprint completion. With NEXORA, every cloud compute invoice and contractor bill logs against live project budgets in real time.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-[#374151]">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Squad Lead sprint allocations synchronized with HR records</span>
              </div>
              <div className="flex items-center gap-2 text-[#374151]">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Automatic burn rate warnings when projects cross 80% budget</span>
              </div>
              <div className="flex items-center gap-2 text-[#374151]">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Client invoice generation straight from billable project deliverables</span>
              </div>
            </div>
          </div>

          <div className="bg-[#fafbfc] rounded-xl border border-[#e5e7eb] p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
              <span className="font-bold text-[#111827]">Active Client Engagement</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-mono font-medium border border-emerald-200">
                ON SCHEDULE
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Project Name</span>
                <span className="font-semibold text-[#111827]">Global Fintech Core Banking API</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Lead Architect</span>
                <span className="font-medium text-[#111827]">David Chen (Team Lead)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Budget Envelope</span>
                <span className="font-mono text-[#111827]">$450,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Recognized Spend</span>
                <span className="font-mono text-[#111827]">$312,400 (69.4%)</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => onExploreDemo('/projects')}
              >
                Inspect Project Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
