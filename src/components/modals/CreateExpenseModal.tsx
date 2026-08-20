import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ExpenseCategory } from '../../types';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExpenseModal: React.FC<CreateExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, projects, departments } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: ExpenseCategory[] = [
    'Cloud & Infrastructure',
    'Hardware & Equipment',
    'Software Licenses',
    'Office & Facilities',
    'Travel & Client Meetings',
    'Marketing & Events',
    'Consulting & Legal',
    'Miscellaneous',
  ];

  const [formData, setFormData] = useState({
    title: '',
    amount: 1500,
    category: 'Software Licenses' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setIsSubmitting(true);
    try {
      const selectedProj = projects.find(p => p.id === formData.projectId);

      await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        submitterId: currentUser?.id || 'emp-1',
        submitterName: currentUser?.name || 'Mohammed Najmal',
        submitterDepartment: currentUser?.departmentName || 'Engineering & DevOps',
        projectId: formData.projectId || undefined,
        projectName: selectedProj?.name || undefined,
        notes: formData.notes,
      });

      onClose();
      setFormData({
        title: '',
        amount: 1500,
        category: 'Software Licenses',
        date: new Date().toISOString().split('T')[0],
        projectId: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Corporate Expense Claim"
      subtitle="File claim for managerial clearance, ledger posting, and reimbursement"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Submit Expense Claim
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Expense Description / Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. AWS Dedicated Compute Instances (Monthly)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Amount (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Expense Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Tag to IT Client Project (Optional)
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
            >
              <option value="">General Overhead / No Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} [{p.code}]</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Justification & Audit Notes
          </label>
          <textarea
            rows={3}
            placeholder="Provide business justification, vendor reference, or invoice details..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          />
        </div>
      </form>
    </Modal>
  );
};
