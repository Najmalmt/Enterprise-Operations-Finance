import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

const EXPENSE_CATEGORIES = [
  { name: 'Cloud & Infrastructure', amount: 864000, color: '#111827' },
  { name: 'Hardware & Equipment', amount: 342000, color: '#27272a' },
  { name: 'Software Licenses', amount: 285000, color: '#52525b' },
  { name: 'Office & Facilities', amount: 195000, color: '#71717a' },
  { name: 'Marketing & Events', amount: 145000, color: '#a1a1aa' },
  { name: 'Travel & Client Meetings', amount: 98000, color: '#d4d4d8' },
];

export const ExpenseDonutChart: React.FC = () => {
  const total = EXPENSE_CATEGORIES.reduce((acc, curr) => acc + curr.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = ((data.amount / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2.5 rounded-lg border border-[#e5e7eb] shadow-md text-xs">
          <p className="font-semibold text-[#111827]">{data.name}</p>
          <div className="flex items-center gap-2 mt-1 font-mono">
            <span className="font-semibold text-[#111827]">{formatCurrency(data.amount)}</span>
            <span className="text-[#6b7280]">({pct}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      headerTitle="Expense Breakdown by Category"
      headerSubtitle="Distribution of operating expenditure across all cost centers"
    >
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut graphic */}
        <div className="w-full lg:w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={EXPENSE_CATEGORIES}
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="amount"
              >
                {EXPENSE_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Total Burn</span>
            <span className="text-sm font-bold font-mono text-[#111827]">{formatCurrency(total, true)}</span>
          </div>
        </div>

        {/* Categories list beside chart */}
        <div className="flex-1 w-full space-y-2">
          {EXPENSE_CATEGORIES.map((cat, idx) => {
            const pct = ((cat.amount / total) * 100).toFixed(1);
            return (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#f0f2f5] last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#374151] truncate font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="font-semibold text-[#111827]">{formatCurrency(cat.amount, true)}</span>
                  <span className="text-[11px] text-[#6b7280] w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
