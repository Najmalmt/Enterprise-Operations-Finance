import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  Banknote,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import { Button } from '../common/Button';

interface ProductPreviewSectionProps {
  onExploreDemo: (path?: string) => void;
}

export const ProductPreviewSection: React.FC<ProductPreviewSectionProps> = ({ onExploreDemo }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'finance' | 'projects' | 'payroll'>('dashboard');

  const previewTabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'employees', label: 'Personnel Directory', icon: Users, path: '/employees' },
    { id: 'finance', label: 'Corporate Finance', icon: DollarSign, path: '/finance' },
    { id: 'projects', label: 'Enterprise Projects', icon: Briefcase, path: '/projects' },
    { id: 'payroll', label: 'Automated Payroll', icon: Banknote, path: '/payroll' },
  ] as const;

  return (
    <section id="preview" className="py-16 md:py-24 bg-[#fafbfc] border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Interactive Previews
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Explore the Platform
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Experience the clean, high-density interfaces designed to keep leadership and technical teams aligned.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2">
          {previewTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:border-black hover:text-black'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#6b7280]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Frame */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-[#e5e7eb] shadow-lg p-3 sm:p-4 overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#f0f2f5] mb-3 bg-[#fafbfc] rounded-t-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] font-semibold text-[#111827]">
                Live View: {previewTabs.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onExploreDemo(previewTabs.find((t) => t.id === activeTab)?.path)}
              icon={ArrowRight}
              className="text-xs px-3 py-1.5"
            >
              Launch This Page
            </Button>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 p-2 sm:p-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] uppercase font-semibold">Total Revenue</span>
                  <div className="text-base font-bold text-[#111827] mt-1">$1,840,000</div>
                  <span className="text-[10px] text-emerald-600 font-medium">+18.4% YoY</span>
                </div>
                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] uppercase font-semibold">Total Headcount</span>
                  <div className="text-base font-bold text-[#111827] mt-1">48 Members</div>
                  <span className="text-[10px] text-[#6b7280]">8 Departments</span>
                </div>
                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] uppercase font-semibold">Active Projects</span>
                  <div className="text-base font-bold text-[#111827] mt-1">8 Live Sprints</div>
                  <span className="text-[10px] text-emerald-600 font-medium">94% on-track</span>
                </div>
                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb]">
                  <span className="text-[10px] text-[#6b7280] uppercase font-semibold">Net Profit Margin</span>
                  <div className="text-base font-bold text-emerald-700 mt-1">35.8% ($660k)</div>
                  <span className="text-[10px] text-[#6b7280]">Healthy surplus</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-2">
                  <div className="font-bold text-[#111827]">Executive Clearance Approvals</div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between p-1.5 bg-white rounded border border-[#e5e7eb]">
                      <span>AWS Reserved Instance Expansion</span>
                      <span className="font-semibold text-emerald-700">$12,400</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-white rounded border border-[#e5e7eb]">
                      <span>Annual PTO Leave (3 Days) - Farhana Y.</span>
                      <span className="font-semibold text-amber-700">Pending Review</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-2">
                  <div className="font-bold text-[#111827]">Cash Runway Forecast</div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#6b7280]">Treasury Liquidity:</span>
                    <span className="font-bold font-mono text-[#111827]">$2,450,000</span>
                  </div>
                  <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-[10px] text-[#6b7280] block">
                    24.8 months runway under current operational burn rate.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONNEL DIRECTORY */}
          {activeTab === 'employees' && (
            <div className="space-y-3 p-2 sm:p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">Enterprise Workforce Directory</span>
                <span className="text-[11px] font-mono text-[#6b7280]">48 Active Personnel</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafbfc] text-[#6b7280] border-b border-[#e5e7eb]">
                    <tr>
                      <th className="p-2.5">Employee Name</th>
                      <th className="p-2.5">Role / Position</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5">Location</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5] text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold text-[#111827]">Mohammed Najmal</td>
                      <td className="p-2.5 text-[#374151]">Chief Executive Officer</td>
                      <td className="p-2.5 font-mono text-[#6b7280]">Executive</td>
                      <td className="p-2.5">London / HQ</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Active</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#111827]">Farhana Yasmin</td>
                      <td className="p-2.5 text-[#374151]">HR Manager</td>
                      <td className="p-2.5 font-mono text-[#6b7280]">People Ops</td>
                      <td className="p-2.5">Singapore</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Active</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-[#111827]">Arjun Mehta</td>
                      <td className="p-2.5 text-[#374151]">Finance Manager</td>
                      <td className="p-2.5 font-mono text-[#6b7280]">Treasury</td>
                      <td className="p-2.5">New York</td>
                      <td className="p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CORPORATE FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-3 p-2 sm:p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">General Ledger Transactions</span>
                <span className="text-[11px] font-mono text-[#6b7280]">USD Primary Currency</span>
              </div>
              <div className="space-y-2">
                {[
                  { desc: 'Client Retainer: Cloud Native Migration', cat: 'Revenue', amount: '+$65,000', type: 'Credit' },
                  { desc: 'AWS Enterprise Compute Infrastructure', cat: 'Cloud Ops', amount: '-$12,400', type: 'Debit' },
                  { desc: 'Monthly Engineering Payroll Disbursal', cat: 'Payroll', amount: '-$174,000', type: 'Debit' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#fafbfc] rounded-lg border border-[#e5e7eb]">
                    <div>
                      <div className="font-semibold text-[#111827]">{item.desc}</div>
                      <div className="text-[10px] text-[#6b7280] font-mono">{item.cat}</div>
                    </div>
                    <span className={`font-mono font-bold ${item.type === 'Credit' ? 'text-emerald-700' : 'text-zinc-800'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ENTERPRISE PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3 p-2 sm:p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">Active Client Deliverables</span>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">8 In Progress</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#111827]">
                    <span>Global Fintech Core Banking API</span>
                    <span className="font-mono text-[#6b7280]">$450k Budget</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6b7280]">
                    <span>Lead: David Chen</span>
                    <span>Sprint 14 of 18 (78% Complete)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#111827]">
                    <span>Healthcare Telemetry Platform</span>
                    <span className="font-mono text-[#6b7280]">$320k Budget</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6b7280]">
                    <span>Lead: Sarah Jenkins</span>
                    <span>Sprint 22 of 24 (92% Complete)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUTOMATED PAYROLL */}
          {activeTab === 'payroll' && (
            <div className="space-y-3 p-2 sm:p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827]">Payroll Batch Disbursal Console</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Disburse
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 p-3 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] text-center">
                <div>
                  <span className="text-[10px] text-[#6b7280] uppercase">Gross Payroll</span>
                  <div className="font-bold font-mono text-[#111827] mt-0.5">$392,000</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#6b7280] uppercase">Tax / Deductions</span>
                  <div className="font-bold font-mono text-zinc-600 mt-0.5">-$44,000</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#6b7280] uppercase">Net Disbursal</span>
                  <div className="font-bold font-mono text-emerald-700 mt-0.5">$348,000</div>
                </div>
              </div>
              <div className="p-2.5 bg-[#f8f9fa] rounded-lg border border-[#e5e7eb] text-[11px] text-[#4b5563] flex items-center justify-between">
                <span>48 Automated Payslips with direct ACH/SEPA routing codes generated.</span>
                <span className="font-semibold text-black">100% Reconciled</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
