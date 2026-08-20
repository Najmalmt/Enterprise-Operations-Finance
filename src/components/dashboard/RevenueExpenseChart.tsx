import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 640000, expenses: 310000, net: 330000 },
  { month: 'Feb', revenue: 710000, expenses: 345000, net: 365000 },
  { month: 'Mar', revenue: 780000, expenses: 390000, net: 390000 },
  { month: 'Apr', revenue: 750000, expenses: 380000, net: 370000 },
  { month: 'May', revenue: 830000, expenses: 410000, net: 420000 },
  { month: 'Jun', revenue: 890000, expenses: 440000, net: 450000 },
  { month: 'Jul', revenue: 920000, expenses: 460000, net: 460000 },
  { month: 'Aug', revenue: 985000, expenses: 495000, net: 490000 },
];

const QUARTERLY_DATA = [
  { month: 'Q1 2025', revenue: 1980000, expenses: 1045000, net: 935000 },
  { month: 'Q2 2025', revenue: 2240000, expenses: 1180000, net: 1060000 },
  { month: 'Q3 2025', revenue: 2410000, expenses: 1290000, net: 1120000 },
  { month: 'Q4 2025', revenue: 2680000, expenses: 1390000, net: 1290000 },
  { month: 'Q1 2026', revenue: 2840000, expenses: 1450000, net: 1390000 },
  { month: 'Q2 2026', revenue: 3150000, expenses: 1560000, net: 1590000 },
];

export const RevenueExpenseChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly'>('monthly');
  const data = viewMode === 'monthly' ? MONTHLY_DATA : QUARTERLY_DATA;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg border border-[#e5e7eb] shadow-lg text-xs">
          <p className="font-semibold text-[#111827] mb-2">{label}</p>
          <div className="space-y-1 font-mono">
            <div className="flex items-center justify-between gap-4 text-[#111827]">
              <span className="flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-black"></span> Revenue:
              </span>
              <span className="font-semibold">{formatCurrency(payload[0]?.value)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#6b7280]">
              <span className="flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Expenses:
              </span>
              <span className="font-semibold">{formatCurrency(payload[1]?.value)}</span>
            </div>
            <div className="pt-1 mt-1 border-t border-[#f0f2f5] flex items-center justify-between gap-4 text-emerald-700 font-semibold">
              <span className="font-sans">Net Margin:</span>
              <span>{formatCurrency((payload[0]?.value || 0) - (payload[1]?.value || 0))}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      headerTitle="Revenue vs. Operating Expenses"
      headerSubtitle="Consolidated corporate income vs. burn rate trend"
      headerAction={
        <div className="flex items-center gap-1 bg-[#f3f4f6] p-0.5 rounded-lg border border-[#e5e7eb]">
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-white text-black shadow-2xs font-semibold'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('quarterly')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === 'quarterly'
                ? 'bg-white text-black shadow-2xs font-semibold'
                : 'text-[#6b7280] hover:text-black'
            }`}
          >
            Quarterly
          </button>
        </div>
      }
    >
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Gross Revenue"
              stroke="#111827"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Total Expenses"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
