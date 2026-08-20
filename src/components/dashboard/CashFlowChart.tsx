import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

const CASH_FLOW_DATA = [
  { stage: 'Opening Balance', amount: 4850000, type: 'balance', color: '#111827' },
  { stage: 'Client Inflow', amount: 985000, type: 'inflow', color: '#374151' },
  { stage: 'Operating Burn', amount: 495000, type: 'outflow', color: '#9ca3af' },
  { stage: 'Closing Balance', amount: 5340000, type: 'closing', color: '#111827' },
];

export const CashFlowChart: React.FC = () => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2.5 rounded-lg border border-[#e5e7eb] shadow-md text-xs">
          <p className="font-semibold text-[#111827]">{data.stage}</p>
          <p className="font-mono text-xs font-semibold text-[#111827] mt-1">
            {formatCurrency(data.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      headerTitle="Corporate Cash Flow"
      headerSubtitle="Treasury liquidity and monthly settlement bridge"
    >
      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CASH_FLOW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {CASH_FLOW_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-[#f0f2f5] text-center">
        {CASH_FLOW_DATA.map((item, idx) => (
          <div key={idx} className="p-2 rounded-lg bg-[#fafbfc] border border-[#f0f2f5]">
            <p className="text-[10px] text-[#6b7280] truncate">{item.stage}</p>
            <p className="text-xs font-bold font-mono text-[#111827] mt-0.5">
              {formatCurrency(item.amount, true)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
