import React, { useState } from 'react';
import { Layers, Plus, Trash2, Shield, DollarSign } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useData } from '../../context/DataContext';

interface ManageExpenseCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryPolicy {
  id: string;
  name: string;
  maxPerClaim: number;
  requiresReceipt: boolean;
  requiresLeadApproval: boolean;
  active: boolean;
}

const DEFAULT_CATEGORIES: CategoryPolicy[] = [
  { id: 'cat-1', name: 'Cloud & Infrastructure', maxPerClaim: 50000, requiresReceipt: true, requiresLeadApproval: true, active: true },
  { id: 'cat-2', name: 'Hardware & Equipment', maxPerClaim: 15000, requiresReceipt: true, requiresLeadApproval: true, active: true },
  { id: 'cat-3', name: 'Software Licenses', maxPerClaim: 10000, requiresReceipt: true, requiresLeadApproval: false, active: true },
  { id: 'cat-4', name: 'Office & Facilities', maxPerClaim: 5000, requiresReceipt: true, requiresLeadApproval: false, active: true },
  { id: 'cat-5', name: 'Travel & Client Meetings', maxPerClaim: 8000, requiresReceipt: true, requiresLeadApproval: true, active: true },
  { id: 'cat-6', name: 'Marketing & Events', maxPerClaim: 25000, requiresReceipt: true, requiresLeadApproval: true, active: true },
  { id: 'cat-7', name: 'Team Offsites & Culture', maxPerClaim: 6000, requiresReceipt: true, requiresLeadApproval: true, active: true },
];

export const ManageExpenseCategoriesModal: React.FC<ManageExpenseCategoriesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { logAction } = useData();
  const [categories, setCategories] = useState<CategoryPolicy[]>(() => {
    try {
      const saved = localStorage.getItem('nexora_expense_categories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  const [newName, setNewName] = useState('');
  const [newMax, setNewMax] = useState(5000);
  const [newReqReceipt, setNewReqReceipt] = useState(true);
  const [newReqLead, setNewReqLead] = useState(true);

  const saveCategories = (updated: CategoryPolicy[]) => {
    setCategories(updated);
    localStorage.setItem('nexora_expense_categories', JSON.stringify(updated));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCat: CategoryPolicy = {
      id: `cat-${Date.now()}`,
      name: newName.trim(),
      maxPerClaim: Number(newMax),
      requiresReceipt: newReqReceipt,
      requiresLeadApproval: newReqLead,
      active: true,
    };

    const updated = [...categories, newCat];
    saveCategories(updated);
    logAction('EXPENSE_CATEGORY_CREATED', 'Finance', `Configured expense category "${newCat.name}" with $${newCat.maxPerClaim} cap.`);
    setNewName('');
    setNewMax(5000);
  };

  const handleToggleActive = (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, active: !c.active } : c);
    saveCategories(updated);
  };

  const handleDeleteCategory = (id: string) => {
    const target = categories.find(c => c.id === id);
    const updated = categories.filter(c => c.id !== id);
    saveCategories(updated);
    if (target) {
      logAction('EXPENSE_CATEGORY_DELETED', 'Finance', `Archived expense category "${target.name}".`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Corporate Expense Categories & Spending Policy"
      subtitle="Establish authorized expense classifications, maximum claim ceilings, and approval matrices"
      maxWidth="lg"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Form to add category */}
        <form onSubmit={handleAddCategory} className="p-3.5 bg-[#fafbfc] rounded-xl border border-[#e5e7eb] space-y-3">
          <span className="font-bold text-[#111827] block">Add New Authorized Category</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] mb-1">Category Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Legal & Professional Fees"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#374151] mb-1">Max Per Claim Limit ($)</label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={newMax}
                onChange={(e) => setNewMax(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-[11px] text-[#4b5563]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newReqReceipt}
                  onChange={(e) => setNewReqReceipt(e.target.checked)}
                  className="rounded border-[#d1d5db]"
                />
                Require Itemized Receipt
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newReqLead}
                  onChange={(e) => setNewReqLead(e.target.checked)}
                  className="rounded border-[#d1d5db]"
                />
                Require Team Lead Endorsement
              </label>
            </div>
            <Button variant="primary" size="sm" type="submit">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Category
            </Button>
          </div>
        </form>

        {/* Existing Categories Table */}
        <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfc] border-b border-[#e5e7eb] text-[#6b7280] font-semibold">
              <tr>
                <th className="px-4 py-2.5">Category Name</th>
                <th className="px-3 py-2.5">Max Limit</th>
                <th className="px-3 py-2.5">Receipt Required</th>
                <th className="px-3 py-2.5">Lead Review</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f5]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fafbfc]">
                  <td className="px-4 py-2.5 font-bold text-[#111827]">{cat.name}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold">{formatCurrency(cat.maxPerClaim)}</td>
                  <td className="px-3 py-2.5 text-[#6b7280]">
                    {cat.requiresReceipt ? '✓ Yes' : '— Optional'}
                  </td>
                  <td className="px-3 py-2.5 text-[#6b7280]">
                    {cat.requiresLeadApproval ? '✓ Yes' : '— Direct Finance'}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cat.active ? 'bg-emerald-50 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {cat.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(cat.id)}
                        className="px-2 py-0.5 rounded border border-[#e5e7eb] hover:bg-[#f3f4f6] text-[10px] text-[#374151]"
                      >
                        {cat.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
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
