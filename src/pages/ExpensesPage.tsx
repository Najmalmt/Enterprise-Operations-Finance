import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Check,
  X,
  DollarSign,
  Download,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Users
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Expense, ExpenseStatus, ExpenseCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CreateExpenseModal } from '../components/modals/CreateExpenseModal';
import { ManageExpenseCategoriesModal } from '../components/modals/ManageExpenseCategoriesModal';

export const ExpensesPage: React.FC = () => {
  const { expenses, updateExpense, approveExpense, rejectExpense, reimburseExpense, projects } = useData();
  const { currentUser, hasPermission, role } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [viewScope, setViewScope] = useState<'all' | 'my_team'>('all');

  const canApprove = hasPermission('approve_expenses');
  const canDisburse = hasPermission('disburse_expenses');
  const canManageCategories = role === 'Super Admin' || role === 'Finance Manager';
  const isTeamLead = role === 'Team Lead';

  // Find projects lead by user or team member IDs
  const myLeadProjects = projects.filter(p => p.leadId === currentUser?.id || p.teamMemberIds?.includes(currentUser?.id || ''));
  const myProjectIds = myLeadProjects.map(p => p.id);
  const myTeamMemberIds = Array.from(
    new Set(myLeadProjects.flatMap(p => p.teamMemberIds || []).concat(currentUser?.id ? [currentUser.id] : []))
  );

  const handleEndorseExpense = async (id: string, endorsement: 'Endorsed' | 'Flagged') => {
    await updateExpense(id, {
      leadEndorsement: endorsement,
      leadEndorsementNote: endorsement === 'Endorsed' ? 'Verified by Team Lead for sprint deliverable' : 'Flagged: unbudgeted team spend'
    });
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.projectName && exp.projectName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'All' || exp.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;

    const matchesScope =
      viewScope === 'all' ||
      (exp.projectId && myProjectIds.includes(exp.projectId)) ||
      myTeamMemberIds.includes(exp.submitterId) ||
      exp.submitterId === currentUser?.id;

    return matchesSearch && matchesStatus && matchesCategory && matchesScope;
  });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = filteredExpenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  const approvedAmount = filteredExpenses.filter(e => e.status === 'Approved' || e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);

  const exportCSV = () => {
    const headers = ['ID,Title,Amount,Category,Status,Submitter,Department,Date,Project\n'];
    const rows = filteredExpenses.map(e =>
      `"${e.id}","${e.title}",${e.amount},"${e.category}","${e.status}","${e.submitterName}","${e.submitterDepartment}","${e.date}","${e.projectName || ''}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Corporate Expense Claims & Operational Burn
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800">
              {filteredExpenses.length} Total Claims
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Manager review queues, vendor reimbursement workflows, and project cost allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(isTeamLead || role === 'Project Manager') && (
            <div className="flex items-center gap-1 border border-[#e5e7eb] rounded-lg p-0.5 bg-[#f8f9fa]">
              <button
                onClick={() => setViewScope('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewScope === 'all'
                    ? 'bg-black text-white'
                    : 'text-[#4b5563] hover:text-black'
                }`}
              >
                All Claims
              </button>
              <button
                onClick={() => setViewScope('my_team')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                  viewScope === 'my_team'
                    ? 'bg-black text-white'
                    : 'text-[#4b5563] hover:text-black'
                }`}
              >
                <Users className="w-3 h-3" /> Squad / Projects
              </button>
            </div>
          )}

          {canManageCategories && (
            <Button variant="secondary" size="sm" onClick={() => setShowCategoriesModal(true)}>
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Policy & Categories
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Claims
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            File Claim
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross Claims</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalAmount, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{filteredExpenses.length} claims filtered</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Pending Review</span>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{formatCurrency(pendingAmount, true)}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {filteredExpenses.filter(e => e.status === 'Pending').length} claims awaiting clearance
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Cleared & Reimbursed</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(approvedAmount, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Direct ACH disbursed</p>
        </div>
      </div>

      {/* Filter and Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#f0f2f5] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, submitter name, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid / Disbursed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
            >
              <option value="All">All Categories</option>
              <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
              <option value="Hardware & Equipment">Hardware & Equipment</option>
              <option value="Software Licenses">Software Licenses</option>
              <option value="Office & Facilities">Office & Facilities</option>
              <option value="Travel & Client Meetings">Travel & Client Meetings</option>
              <option value="Marketing & Events">Marketing & Events</option>
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <EmptyState
            title="No expense claims found"
            description="Adjust your search filters to find expense records."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedStatus('All');
              setSelectedCategory('All');
              setViewScope('all');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Expense Claim</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Submitter</th>
                  <th className="px-4 py-3">Project Tag</th>
                  <th className="px-4 py-3">Lead Endorsement</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#111827]">{exp.title}</p>
                      {exp.notes && <p className="text-[11px] text-[#6b7280] italic mt-0.5 truncate max-w-xs">{exp.notes}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-[#374151]">{exp.category}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#111827]">{exp.submitterName}</p>
                      <p className="text-[10px] text-[#6b7280]">{exp.submitterDepartment}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      {exp.projectName ? (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] text-zinc-800">
                          {exp.projectName}
                        </span>
                      ) : (
                        <span className="text-[#9ca3af] text-[11px]">General OPEX</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {exp.leadEndorsement ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          exp.leadEndorsement === 'Endorsed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {exp.leadEndorsement === 'Endorsed' ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                          {exp.leadEndorsement}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#9ca3af]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280] font-mono">{formatDate(exp.date)}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getStatusBadgeVariant(exp.status)} size="sm">{exp.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-[#111827]">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {exp.status === 'Pending' ? (
                        canApprove ? (
                          /* Finance Manager / Super Admin Approval */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveExpense(exp.id)}
                              className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectExpense(exp.id, 'Management policy rejection')}
                              className="px-2.5 py-1 rounded border border-[#e5e7eb] text-rose-600 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : isTeamLead ? (
                          /* Team Lead Endorsement */
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEndorseExpense(exp.id, 'Endorsed')}
                              className="px-2 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                              title="Endorse project spend for Finance review"
                            >
                              <ThumbsUp className="w-2.5 h-2.5" /> Endorse
                            </button>
                            <button
                              onClick={() => handleEndorseExpense(exp.id, 'Flagged')}
                              className="px-2 py-1 rounded border border-[#e5e7eb] text-rose-700 hover:bg-rose-50 text-[10px] font-semibold cursor-pointer flex items-center gap-1"
                              title="Flag expense discrepancy"
                            >
                              <ThumbsDown className="w-2.5 h-2.5" /> Flag
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Pending Review
                          </span>
                        )
                      ) : exp.status === 'Approved' ? (
                        canDisburse ? (
                          <button
                            onClick={() => reimburseExpense(exp.id)}
                            className="px-2.5 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 text-[11px] font-semibold cursor-pointer"
                          >
                            Disburse ACH
                          </button>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Approved (Awaiting Finance)
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-[#9ca3af]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateExpenseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <ManageExpenseCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
    </div>
  );
};
