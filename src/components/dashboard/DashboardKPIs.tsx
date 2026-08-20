import React from 'react';
import { DollarSign, TrendingUp, Receipt, Users, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const DashboardKPIs: React.FC = () => {
  const { financialSummary } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Revenue - Main emphasis */}
      <div className="bg-[#0f141c] text-white rounded-xl p-5 border border-[#273142] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {formatCurrency(financialSummary.totalRevenue, true)}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Exact: <span className="font-mono text-zinc-300">{formatCurrency(financialSummary.totalRevenue)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +8.4%
          </span>
          <span className="text-zinc-400 text-[11px]">vs. last fiscal quarter</span>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-zinc-400 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#111827]">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
              {formatCurrency(financialSummary.totalExpenses, true)}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">
              Exact: <span className="font-mono text-[#374151]">{formatCurrency(financialSummary.totalExpenses)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f2f5] flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
            <ArrowDownRight className="w-3.5 h-3.5" />
            +3.2%
          </span>
          <span className="text-[#6b7280] text-[11px]">Operating burn</span>
        </div>
      </div>

      {/* 3. Net Profit */}
      <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-zinc-400 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Net Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#111827]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
              {formatCurrency(financialSummary.netProfit, true)}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">
              Margin: <span className="font-semibold text-emerald-700">{formatPercent(financialSummary.profitMargin)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f2f5] flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +11.7%
          </span>
          <span className="text-[#6b7280] text-[11px]">Net margin efficiency</span>
        </div>
      </div>

      {/* 4. Payroll & Workforce */}
      <div className="bg-white rounded-xl p-5 border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-zinc-400 transition-colors">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
              Monthly Payroll
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] flex items-center justify-center text-[#111827]">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] font-mono">
              {formatCurrency(financialSummary.monthlyPayroll, true)}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">
              Headcount: <span className="font-semibold text-[#111827]">{financialSummary.totalHeadcount} Employees</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f2f5] flex items-center justify-between text-xs">
          <span className="text-[#374151] font-medium text-[11px]">
            ACH Auto-Disbursed
          </span>
          <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Reconciled
          </span>
        </div>
      </div>
    </div>
  );
};
