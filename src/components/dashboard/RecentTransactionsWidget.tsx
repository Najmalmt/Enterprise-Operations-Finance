import React from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecentTransactionsWidgetProps {
  onViewAll: () => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({ onViewAll }) => {
  const { transactions } = useData();
  const recent = transactions.slice(0, 5);

  return (
    <Card
      headerTitle="Recent Financial Transactions"
      headerSubtitle="Settlements, client receipts, and disbursements"
      headerAction={
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View ledger <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      }
      noPadding
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
            <tr>
              <th className="px-5 py-3">Reference & Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f5]">
            {recent.map((tx) => {
              const isIncome = tx.type === 'Income';
              return (
                <tr key={tx.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {isIncome ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{tx.title}</p>
                        <p className="font-mono text-[10px] text-[#6b7280]">{tx.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#4b5563]">{tx.category}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{formatDate(tx.date)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadgeVariant(tx.status)} size="sm">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold">
                    <span className={isIncome ? 'text-emerald-700' : 'text-[#111827]'}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
