import React from 'react';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  CheckCircle2,
  DollarSign,
  Shield,
  ArrowUpRight,
  Clock,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onExploreDemo: (path?: string) => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDemo,
  onExploreFeatures,
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#fafbfc]">
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Release & Governance Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e5e7eb] shadow-2xs text-[11px] font-medium text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-black">Unified IT Operating System</span>
            <span className="text-[#9ca3af]">|</span>
            <span className="text-[#6b7280]">Role-Based Multi-Tier Architecture</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111827] leading-[1.15]">
            Enterprise IT Operations & Finance Platform
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#4b5563] leading-relaxed max-w-2xl mx-auto">
            Manage employees, projects, payroll, expenses, invoices, budgets, and company finances from one connected platform.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onExploreDemo('/dashboard')}
              icon={ArrowRight}
              className="w-full sm:w-auto text-sm px-6 py-3 shadow-sm hover:shadow-md cursor-pointer"
            >
              Explore Live Demo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreFeatures}
              className="w-full sm:w-auto text-sm px-6 py-3 cursor-pointer"
            >
              Explore Features
            </Button>
          </div>

          {/* Fast metadata pill list */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#6b7280]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Full Role Simulator (6 Personas)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Real-Time P&L & Cash Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              <span>Supabase Cloud Ready</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL: High-fidelity preview of the existing application */}
        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto">
          <div className="relative rounded-2xl bg-white border border-[#e5e7eb] shadow-xl p-2 sm:p-3 overflow-hidden">
            {/* Window chrome header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#f0f2f5] mb-2 bg-[#fafbfc] rounded-t-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[11px] font-mono text-[#6b7280] ml-2 hidden sm:inline">
                  https://app.nexora-enterprise.internal/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  LIVE ENVIRONMENT
                </span>
                <span className="text-[11px] font-semibold text-[#374151] hidden md:inline">
                  Role: Super Admin / CEO
                </span>
              </div>
            </div>

            {/* Application Mockup Layout */}
            <div className="grid grid-cols-12 gap-3 bg-[#f8f9fa] p-3 sm:p-4 rounded-xl border border-[#f0f2f5] text-xs">
              {/* Left Mini Sidebar Representation */}
              <div className="hidden lg:flex col-span-3 flex-col justify-between bg-[#111827] text-white p-3.5 rounded-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                    <div className="w-6 h-6 rounded bg-white text-black font-bold text-xs flex items-center justify-center">
                      NX
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">NEXORA</div>
                      <div className="text-[9px] text-zinc-400 font-mono">ENTERPRISE OS</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] font-mono uppercase text-zinc-500 px-2">OVERVIEW</div>
                    <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-800 text-white font-medium text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Executive Dashboard</span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white">
                      <Users className="w-3.5 h-3.5" />
                      <span>Personnel Directory</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Corporate Finance</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Client Engagements</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Mohammed Najmal</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">CEO</span>
                </div>
              </div>

              {/* Main Dashboard Preview Content */}
              <div className="col-span-12 lg:col-span-9 space-y-3">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-[#e5e7eb] shadow-2xs">
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block">
                      Revenue (YTD)
                    </span>
                    <div className="text-base sm:text-lg font-bold text-[#111827] mt-0.5">$1,840,000</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                      <ArrowUpRight className="w-3 h-3" /> +18.4% vs plan
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e5e7eb] shadow-2xs">
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block">
                      Operating Expenses
                    </span>
                    <div className="text-base sm:text-lg font-bold text-[#111827] mt-0.5">$1,180,000</div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium mt-1">
                      64.1% burn index
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e5e7eb] shadow-2xs">
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block">
                      Net Profit Margin
                    </span>
                    <div className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5">$660,000</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                      35.8% margin
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e5e7eb] shadow-2xs">
                    <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider block">
                      Cash Reserve Runway
                    </span>
                    <div className="text-base sm:text-lg font-bold text-[#111827] mt-0.5">$2.45M</div>
                    <div className="flex items-center gap-1 text-[10px] text-purple-600 font-medium mt-1">
                      24.8 months runway
                    </div>
                  </div>
                </div>

                {/* Secondary Visual: Active Engagements & Financial Health */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111827]">Active Engineering Projects</span>
                      <span className="text-[11px] text-[#6b7280]">8 Projects Live</span>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-medium text-[#374151]">Core Banking API Modernization</span>
                          <span className="font-mono text-[#6b7280]">78% • $450k</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-medium text-[#374151]">Cloud Native Migration AWS</span>
                          <span className="font-mono text-[#6b7280]">92% • $280k</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e7eb] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#111827]">Treasury & Pending Clearances</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                        3 In Queue
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px] pt-1">
                      <div className="flex items-center justify-between p-1.5 rounded bg-[#fafbfc] border border-[#f0f2f5]">
                        <span className="font-medium text-[#111827]">AWS Enterprise Reserved Instance</span>
                        <span className="font-mono font-semibold text-[#111827]">$12,400</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded bg-[#fafbfc] border border-[#f0f2f5]">
                        <span className="font-medium text-[#111827]">Q3 Tech Squad Payroll Batch</span>
                        <span className="font-mono font-semibold text-[#111827]">$174,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Click Bar */}
                <div
                  onClick={() => onExploreDemo('/dashboard')}
                  className="bg-zinc-900 hover:bg-black text-white p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold">Interactive Live Sandbox is Running</span>
                    <span className="text-zinc-400 hidden sm:inline">— Switch roles, test approvals, record expenses, review payroll</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-zinc-300 group-hover:text-white">
                    <span>Launch Application</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
