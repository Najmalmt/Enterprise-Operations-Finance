import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';

interface FinanceSectionProps {
  onExploreDemo: (path?: string) => void;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ onExploreDemo }) => {
  const financeMetrics = [
    {
      label: 'Recognized Revenue',
      value: '$1,840,000',
      trend: '+18.4% YoY',
      isPositive: true,
      subtext: 'Billed client deliverables',
    },
    {
      label: 'Operating Expenses',
      value: '$1,180,000',
      trend: '64.1% burn index',
      isPositive: false,
      subtext: 'Cloud, infrastructure & vendors',
    },
    {
      label: 'Monthly Payroll Run',
      value: '$348,000',
      trend: '100% on-time',
      isPositive: true,
      subtext: '48 salaried team members',
    },
    {
      label: 'Net Profit Margin',
      value: '$660,000',
      trend: '35.8% margin',
      isPositive: true,
      subtext: 'Healthy operating surplus',
    },
    {
      label: 'Cash Flow Reserve',
      value: '$2,450,000',
      trend: '24.8 mo runway',
      isPositive: true,
      subtext: 'Treasury liquidity buffer',
    },
    {
      label: 'Active Budgets',
      value: '$4,200,000',
      trend: '6 departments',
      isPositive: true,
      subtext: 'Allocated operational caps',
    },
  ];

  return (
    <section id="finance" className="py-16 md:py-24 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Corporate Treasury & Governance
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Understand Your Company Finances
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Gain immediate visibility into cash flow runway, billable client revenue, departmental burn rates, and automated payroll disbursals.
          </p>
        </div>

        {/* 6 Key Financial Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {financeMetrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#fafbfc] rounded-xl border border-[#e5e7eb] p-4 flex flex-col justify-between space-y-2 hover:border-black transition-colors"
            >
              <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
                {item.label}
              </span>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#111827]">
                  {item.value}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 mt-0.5">
                  <span>{item.trend}</span>
                </div>
              </div>
              <span className="text-[10px] text-[#9ca3af] border-t border-[#f0f2f5] pt-1">
                {item.subtext}
              </span>
            </div>
          ))}
        </div>

        {/* Visual Chart & Ledger Preview Component */}
        <div className="bg-[#fafbfc] rounded-2xl border border-[#e5e7eb] p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e7eb]">
            <div>
              <h3 className="font-bold text-base text-[#111827]">
                Enterprise Financial Performance & Cash Runway
              </h3>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Consolidated multi-entity treasury ledger and budget variance tracker
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#e5e7eb] font-mono text-[11px] font-semibold text-[#111827]">
                USD / Net Functional
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onExploreDemo('/finance')}
              >
                Open Treasury Ledger
              </Button>
            </div>
          </div>

          {/* Graphical Mockup: Revenue vs Expense Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
            {/* Bar Visualizer */}
            <div className="md:col-span-7 bg-white p-5 rounded-xl border border-[#e5e7eb] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">2026 Fiscal Performance (Trailing 6 Quarters)</span>
                <span className="text-[11px] text-[#6b7280] font-mono">+24.2% Growth</span>
              </div>

              {/* Visual Bars */}
              <div className="space-y-3 pt-2">
                {[
                  { period: 'Q1 2026', rev: 92, exp: 58, net: '$340k' },
                  { period: 'Q2 2026', rev: 84, exp: 54, net: '$300k' },
                  { period: 'Q3 2026', rev: 98, exp: 62, net: '$360k' },
                  { period: 'Q4 2026', rev: 100, exp: 64, net: '$360k' },
                ].map((bar, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-[#374151]">{bar.period}</span>
                      <span className="font-mono text-[#6b7280]">Surplus: {bar.net}</span>
                    </div>
                    <div className="flex gap-1 h-3 bg-[#f8f9fa] rounded-md p-0.5">
                      <div
                        className="bg-black rounded-sm h-full"
                        style={{ width: `${bar.rev * 0.6}%` }}
                        title="Revenue"
                      />
                      <div
                        className="bg-zinc-400 rounded-sm h-full"
                        style={{ width: `${bar.exp * 0.4}%` }}
                        title="Expenses"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#6b7280] pt-2 border-t border-[#f0f2f5]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-black" />
                  <span>Recognized Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-zinc-400" />
                  <span>Operating Expenditures</span>
                </div>
              </div>
            </div>

            {/* Department Cost Centers */}
            <div className="md:col-span-5 bg-white p-5 rounded-xl border border-[#e5e7eb] space-y-4">
              <span className="font-bold text-[#111827] block">Department Budget Utilization</span>
              <div className="space-y-2.5">
                {[
                  { dept: 'Engineering & Cloud', cap: '$1,800,000', used: 74 },
                  { dept: 'Product & Design', cap: '$650,000', used: 68 },
                  { dept: 'Sales & Marketing', cap: '$850,000', used: 82 },
                  { dept: 'People & Operations', cap: '$420,000', used: 55 },
                ].map((dept, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-[#374151]">{dept.dept}</span>
                      <span className="font-mono text-[#6b7280]">{dept.used}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
                        style={{ width: `${dept.used}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
