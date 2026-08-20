import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { LeaveTypePolicy } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ShieldCheck, Calendar } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ManageLeaveTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageLeaveTypesModal: React.FC<ManageLeaveTypesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    leavePolicies,
    addLeavePolicy,
    updateLeavePolicy,
    deleteLeavePolicy,
    toggleLeavePolicyStatus,
  } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    daysPerYear: 15,
    isPaid: true,
    requiresApproval: true,
    carryForwardDays: 0,
    description: '',
  });

  const handleStartAdd = () => {
    setFormData({
      name: '',
      code: '',
      daysPerYear: 15,
      isPaid: true,
      requiresApproval: true,
      carryForwardDays: 0,
      description: '',
    });
    setEditingPolicyId(null);
    setIsEditing(true);
  };

  const handleStartEdit = (policy: LeaveTypePolicy) => {
    setFormData({
      name: policy.name,
      code: policy.code,
      daysPerYear: policy.daysPerYear,
      isPaid: policy.isPaid,
      requiresApproval: policy.requiresApproval,
      carryForwardDays: policy.carryForwardDays,
      description: policy.description,
    });
    setEditingPolicyId(policy.id);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingPolicyId) {
      await updateLeavePolicy(editingPolicyId, {
        name: formData.name,
        code: formData.code.toUpperCase(),
        daysPerYear: Number(formData.daysPerYear),
        isPaid: formData.isPaid,
        requiresApproval: formData.requiresApproval,
        carryForwardDays: Number(formData.carryForwardDays),
        description: formData.description,
      });
    } else {
      await addLeavePolicy({
        name: formData.name,
        code: formData.code.toUpperCase(),
        daysPerYear: Number(formData.daysPerYear),
        isPaid: formData.isPaid,
        requiresApproval: formData.requiresApproval,
        carryForwardDays: Number(formData.carryForwardDays),
        description: formData.description,
        isActive: true,
      });
    }
    setIsEditing(false);
    setEditingPolicyId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the "${name}" leave policy?`)) {
      await deleteLeavePolicy(id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Corporate Leave Policies & Types"
      subtitle="Define annual quotas, paid status, carryover rules, and approval criteria"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-between w-full">
          {!isEditing ? (
            <Button variant="secondary" size="sm" onClick={handleStartAdd}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Leave Type
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
              Back to Policy List
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {isEditing ? (
          <form onSubmit={handleSave} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-4">
            <h4 className="font-bold text-zinc-900 text-sm">
              {editingPolicyId ? 'Edit Leave Policy' : 'Create New Leave Type'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Leave Policy Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wellness & Mental Health Day"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Code / Short Tag <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="WELL"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold uppercase outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Annual Days Quota (Per Employee)
                </label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  value={formData.daysPerYear}
                  onChange={(e) => setFormData({ ...formData, daysPerYear: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Max Carryover Days to Next Year
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={formData.carryForwardDays}
                  onChange={(e) => setFormData({ ...formData, carryForwardDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-[#e5e7eb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                  className="rounded text-black focus:ring-black"
                />
                <div>
                  <span className="font-semibold text-zinc-900 block text-xs">Paid Leave Type</span>
                  <span className="text-[11px] text-zinc-500">Employee receives standard compensation</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-[#e5e7eb] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                  className="rounded text-black focus:ring-black"
                />
                <div>
                  <span className="font-semibold text-zinc-900 block text-xs">Requires HR Manager Review</span>
                  <span className="text-[11px] text-zinc-500">Must be authorized before active shift</span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Policy Description & Rules
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details on eligibility, notice periods, and medical certificate requirements..."
                className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                {editingPolicyId ? 'Update Policy' : 'Save Policy'}
              </Button>
            </div>
          </form>
        ) : null}

        {/* Policies List Table */}
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#e5e7eb] text-[#6b7280] font-semibold">
              <tr>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-3 py-3">Code</th>
                <th className="px-3 py-3">Annual Days</th>
                <th className="px-3 py-3">Carryover</th>
                <th className="px-3 py-3">Compensation</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {leavePolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-[#fafbfc] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-[#111827]">{policy.name}</p>
                    <p className="text-[10px] text-[#6b7280] line-clamp-1">{policy.description}</p>
                  </td>
                  <td className="px-3 py-3.5 font-mono font-bold text-zinc-800">
                    {policy.code}
                  </td>
                  <td className="px-3 py-3.5 font-mono font-semibold text-[#111827]">
                    {policy.daysPerYear} days
                  </td>
                  <td className="px-3 py-3.5 font-mono text-[#6b7280]">
                    {policy.carryForwardDays} days
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        policy.isPaid
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {policy.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => toggleLeavePolicyStatus(policy.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                        policy.isActive
                          ? 'bg-black text-white hover:bg-zinc-800'
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                      }`}
                    >
                      {policy.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleStartEdit(policy)}
                        className="p-1 rounded text-[#6b7280] hover:text-black hover:bg-[#f3f4f6] cursor-pointer"
                        title="Edit policy"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(policy.id, policy.name)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        title="Delete policy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
