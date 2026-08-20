import React from 'react';
import {
  ShieldCheck,
  Lock,
  FileKey,
  Users,
  Database,
  CheckCircle,
  EyeOff,
  Server
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityPillars = [
    {
      title: 'Role-Scoped Boundary Enforcement',
      desc: 'Each user is isolated strictly to views and mutation actions required for their operational role. Employees never see unassigned team compensation or broader company accounts.',
      icon: Lock,
    },
    {
      title: 'Cryptographic Audit Trail',
      desc: 'Every critical corporate action—including expense approvals, payroll disbursals, salary changes, and user permission updates—is recorded in an immutable audit ledger.',
      icon: FileKey,
    },
    {
      title: 'Supabase PostgreSQL Security',
      desc: 'Row-Level Security (RLS) policies and relational database schemas ensure enterprise-grade multi-tenant data protection and persistent cloud synchronization.',
      icon: Database,
    },
    {
      title: 'Session & Dual-Approval Controls',
      desc: 'Configurable session timeouts, multi-factor authentication mandates, and tiered clearance rules prevent single-point approval vulnerabilities.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#6b7280]">
            Enterprise Governance & Security
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111827]">
            Built Around Roles & Permissions
          </h2>
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Enterprise integrity starts with strict access boundaries. Each stakeholder only accesses the tools and confidential financial records relevant to their specific clearance.
          </p>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {securityPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#fafbfc] rounded-xl border border-[#e5e7eb] p-5 space-y-3 flex flex-col justify-between hover:border-black transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center text-black">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#111827]">{item.title}</h3>
                    <p className="text-[11px] text-[#4b5563] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Role Boundary Matrix Table */}
        <div className="bg-[#fafbfc] rounded-2xl border border-[#e5e7eb] p-6 max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e5e7eb] text-[#6b7280] font-mono text-[10px] uppercase">
                <tr>
                  <th className="pb-3 pr-4">Operational Persona</th>
                  <th className="pb-3 px-4">Authorized Clearance</th>
                  <th className="pb-3 pl-4">Restricted Boundaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5] text-[11px]">
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-[#111827]">Employee</td>
                  <td className="py-2.5 px-4 text-[#374151]">Own leave, expenses, salary & assigned tasks</td>
                  <td className="py-2.5 pl-4 text-[#6b7280]">No access to company ledger or peer salaries</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-[#111827]">HR Manager</td>
                  <td className="py-2.5 px-4 text-[#374151]">Personnel directory, attendance & PTO approvals</td>
                  <td className="py-2.5 pl-4 text-[#6b7280]">No access to client invoicing or treasury ledger</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-[#111827]">Finance Manager</td>
                  <td className="py-2.5 px-4 text-[#374151]">Payroll disbursals, invoices, ledger & budgets</td>
                  <td className="py-2.5 pl-4 text-[#6b7280]">No direct employee onboarding / HR profile edits</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-[#111827]">Project Manager</td>
                  <td className="py-2.5 px-4 text-[#374151]">Project delivery, sprint scope & project budgets</td>
                  <td className="py-2.5 pl-4 text-[#6b7280]">No global salary tables or tax disbursals</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-bold text-[#111827]">Super Admin (CEO)</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-semibold">Unrestricted executive clearance across all modules</td>
                  <td className="py-2.5 pl-4 text-[#6b7280]">Full audit logging and dual signoff verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
