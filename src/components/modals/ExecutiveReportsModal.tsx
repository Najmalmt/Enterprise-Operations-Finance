import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Briefcase,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ExecutiveReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportsModal: React.FC<ExecutiveReportsModalProps> = ({ isOpen, onClose }) => {
  const {
    financialSummary,
    departments,
    employees,
    projects,
    expenses,
    transactions,
    payrolls,
    attendance,
    companyInfo
  } = useData();

  const [activeReportTab, setActiveReportTab] = useState<'financial' | 'headcount' | 'projects' | 'payroll'>('financial');

  if (!isOpen) return null;

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeReportTab === 'financial') {
      csvContent += 'Metric,Value\n';
      csvContent += `Company Name,"${companyInfo.legalName}"\n`;
      csvContent += `Total Revenue,${financialSummary.totalRevenue}\n`;
      csvContent += `Total Operating Expenses,${financialSummary.totalExpenses}\n`;
      csvContent += `Net Profit,${financialSummary.netProfit}\n`;
      csvContent += `Operating Margin (%),${financialSummary.profitMargin.toFixed(2)}%\n`;
      csvContent += `Treasury Cash Balance,${financialSummary.cashBalance}\n`;
      csvContent += `Monthly Payroll Total,${financialSummary.monthlyPayroll}\n`;
    } else if (activeReportTab === 'headcount') {
      csvContent += 'Department,Code,Head,Budget,Spent,Headcount\n';
      departments.forEach(d => {
        csvContent += `"${d.name}","${d.code}","${d.headName}",${d.budget},${d.spent},${d.employeeCount}\n`;
      });
    } else if (activeReportTab === 'projects') {
      csvContent += 'Project,Code,Client,Status,Budget,Spent,Progress\n';
      projects.forEach(p => {
        csvContent += `"${p.name}","${p.code}","${p.client}","${p.status}",${p.budget},${p.spent},${p.progressPercent}%\n`;
      });
    } else {
      csvContent += 'Period,Total Gross,Total Tax,Total Benefits,Total Net,Status\n';
      payrolls.forEach(pr => {
        csvContent += `"${pr.periodName}",${pr.totalGross},${pr.totalTax},${pr.totalBenefits},${pr.totalNet},"${pr.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `executive_${activeReportTab}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#e5e7eb] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f2f5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111827]">
                  Executive Performance & Corporate Governance Reports
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  CEO / Super Admin
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                {companyInfo.legalName} • Real-time enterprise financial and operational statements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Tabs */}
        <div className="px-5 py-3 bg-[#fafbfc] border-b border-[#f0f2f5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'financial', label: 'Financial Statement (P&L)' },
              { id: 'headcount', label: 'Department Cost Centers' },
              { id: 'projects', label: 'Project Portfolio' },
              { id: 'payroll', label: 'Payroll Disbursals' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveReportTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  activeReportTab === t.id
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:text-black'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCSV}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Report Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: FINANCIAL STATEMENT */}
          {activeReportTab === 'financial' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb]">
                  <span className="text-[11px] font-semibold text-[#6b7280]">Total Recognized Revenue</span>
                  <div className="text-xl font-bold font-mono text-[#111827] mt-1">
                    {formatCurrency(financialSummary.totalRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                    +14.2% vs Previous Quarter
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb]">
                  <span className="text-[11px] font-semibold text-[#6b7280]">Total Operating Expenses</span>
                  <div className="text-xl font-bold font-mono text-[#111827] mt-1">
                    {formatCurrency(financialSummary.totalExpenses)}
                  </div>
                  <span className="text-[10px] text-[#6b7280] mt-0.5 block">
                    OPEX & Direct Costs
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb]">
                  <span className="text-[11px] font-semibold text-[#6b7280]">Net Profit / (Loss)</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                    {formatCurrency(financialSummary.netProfit)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                    Margin: {financialSummary.profitMargin.toFixed(1)}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb]">
                  <span className="text-[11px] font-semibold text-[#6b7280]">Treasury Cash Balance</span>
                  <div className="text-xl font-bold font-mono text-[#111827] mt-1">
                    {formatCurrency(financialSummary.cashBalance)}
                  </div>
                  <span className="text-[10px] text-[#6b7280] mt-0.5 block">
                    FDIC Insured Treasury
                  </span>
                </div>
              </div>

              {/* P&L Statement Table */}
              <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
                <div className="p-3 bg-[#fafbfc] border-b border-[#e5e7eb] font-bold text-[#111827]">
                  Consolidated Statement of Operations (P&L)
                </div>
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-[#f0f2f5]">
                    <tr className="bg-[#fcfdfd]">
                      <td className="px-4 py-2.5 font-bold text-[#111827]">Gross Operating Income</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-600">
                        {formatCurrency(financialSummary.totalRevenue)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 text-[#4b5563]">Client Invoices & Contracts Settlement</td>
                      <td className="px-4 py-2 text-right font-mono text-[#374151]">
                        {formatCurrency(financialSummary.totalRevenue * 0.88)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 text-[#4b5563]">Retainers & Enterprise SaaS Licensing</td>
                      <td className="px-4 py-2 text-right font-mono text-[#374151]">
                        {formatCurrency(financialSummary.totalRevenue * 0.12)}
                      </td>
                    </tr>

                    <tr className="bg-[#fcfdfd]">
                      <td className="px-4 py-2.5 font-bold text-[#111827]">Total Operating Expenditures (OPEX)</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">
                        ({formatCurrency(financialSummary.totalExpenses)})
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 text-[#4b5563]">Personnel Compensation & Payroll Disbursals</td>
                      <td className="px-4 py-2 text-right font-mono text-[#374151]">
                        {formatCurrency(financialSummary.monthlyPayroll)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 text-[#4b5563]">Enterprise Project & Infrastructure Costs</td>
                      <td className="px-4 py-2 text-right font-mono text-[#374151]">
                        {formatCurrency(financialSummary.totalExpenses * 0.22)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 text-[#4b5563]">Operational Expenses & Corporate Facilities</td>
                      <td className="px-4 py-2 text-right font-mono text-[#374151]">
                        {formatCurrency(financialSummary.totalExpenses * 0.08)}
                      </td>
                    </tr>

                    <tr className="bg-zinc-100 font-bold">
                      <td className="px-4 py-3 text-sm text-[#111827]">Net Operating Income (EBITDA)</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-emerald-700">
                        {formatCurrency(financialSummary.netProfit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: DEPARTMENT COST CENTERS */}
          {activeReportTab === 'headcount' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                    <tr>
                      <th className="px-4 py-3">Department Name</th>
                      <th className="px-4 py-3">Department Head</th>
                      <th className="px-4 py-3">Headcount</th>
                      <th className="px-4 py-3">Annual Budget</th>
                      <th className="px-4 py-3">Spend to Date</th>
                      <th className="px-4 py-3 text-right">Burn %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {departments.map((dept) => {
                      const pct = Math.round((dept.spent / dept.budget) * 100);
                      return (
                        <tr key={dept.id} className="hover:bg-[#fafbfc]">
                          <td className="px-4 py-3">
                            <div className="font-bold text-[#111827]">{dept.name}</div>
                            <span className="font-mono text-[10px] text-[#6b7280]">{dept.code}</span>
                          </td>
                          <td className="px-4 py-3 text-[#374151] font-medium">{dept.headName}</td>
                          <td className="px-4 py-3 font-mono font-bold text-[#111827]">{dept.employeeCount}</td>
                          <td className="px-4 py-3 font-mono text-[#374151]">{formatCurrency(dept.budget)}</td>
                          <td className="px-4 py-3 font-mono font-bold text-[#111827]">{formatCurrency(dept.spent)}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">
                            <span className={pct > 85 ? 'text-amber-600' : 'text-emerald-600'}>
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeReportTab === 'projects' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                    <tr>
                      <th className="px-4 py-3">Project</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Actual Spent</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#fafbfc]">
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#111827]">{proj.name}</div>
                          <span className="font-mono text-[10px] text-[#6b7280]">{proj.code}</span>
                        </td>
                        <td className="px-4 py-3 text-[#374151]">{proj.client}</td>
                        <td className="px-4 py-3 text-[#374151] font-medium">{proj.leadName}</td>
                        <td className="px-4 py-3 font-mono text-[#374151]">{formatCurrency(proj.budget)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-[#111827]">{formatCurrency(proj.spent)}</td>
                        <td className="px-4 py-3 font-mono font-bold">{proj.progressPercent}%</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={proj.status === 'Active' ? 'success' : 'neutral'}>
                            {proj.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYROLL */}
          {activeReportTab === 'payroll' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                    <tr>
                      <th className="px-4 py-3">Payroll Cycle</th>
                      <th className="px-4 py-3">Total Gross</th>
                      <th className="px-4 py-3">Withholding Tax</th>
                      <th className="px-4 py-3">Benefits Deductions</th>
                      <th className="px-4 py-3">Net Disbursed</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f5]">
                    {payrolls.map((pr) => (
                      <tr key={pr.id} className="hover:bg-[#fafbfc]">
                        <td className="px-4 py-3 font-bold text-[#111827]">{pr.periodName}</td>
                        <td className="px-4 py-3 font-mono text-[#374151]">{formatCurrency(pr.totalGross)}</td>
                        <td className="px-4 py-3 font-mono text-[#374151]">{formatCurrency(pr.totalTax)}</td>
                        <td className="px-4 py-3 font-mono text-[#374151]">{formatCurrency(pr.totalBenefits)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-600">{formatCurrency(pr.totalNet)}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={pr.status === 'Paid' ? 'success' : 'warning'}>
                            {pr.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0f2f5] bg-white flex items-center justify-between text-xs text-[#6b7280]">
          <span>Generated for executive compliance audit</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
