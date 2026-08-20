import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { TransactionType } from '../../types';

interface RecordTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordTransactionModal: React.FC<RecordTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, transactions } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextRef = `TX-2026-08-${9900 + transactions.length + 1}`;

  const [formData, setFormData] = useState({
    reference: nextRef,
    title: '',
    type: 'Income' as TransactionType,
    category: 'Client Retainer / Invoicing',
    amount: 50000,
    date: new Date().toISOString().split('T')[0],
    account: 'JPMorgan Chase Corporate Treasury ••8912',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setIsSubmitting(true);
    try {
      await addTransaction({
        reference: formData.reference,
        title: formData.title,
        type: formData.type,
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        status: 'Completed',
        account: formData.account,
        notes: formData.notes,
      });
      onClose();
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
      title="Record Direct Ledger Entry"
      subtitle="Manually post corporate treasury wire, revenue receipt, or operational expense"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Post to General Ledger
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Transaction Flow Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Income' })}
                className={`flex-1 py-2 rounded-lg font-semibold border transition-all ${
                  formData.type === 'Income'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#6b7280]'
                }`}
              >
                + Income / Receipt
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Expense' })}
                className={`flex-1 py-2 rounded-lg font-semibold border transition-all ${
                  formData.type === 'Expense'
                    ? 'bg-zinc-900 border-zinc-900 text-white'
                    : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#6b7280]'
                }`}
              >
                - Disbursement
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Reference Code
            </label>
            <input
              type="text"
              required
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Transaction Title / Description <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Enterprise SLA Renewal Settlement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Amount (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="100"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Date Settled
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Corporate Account
            </label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="JPMorgan Chase Corporate Treasury ••8912">JPMorgan Chase Corporate Treasury ••8912</option>
              <option value="Silicon Valley Bank Payroll Direct ••1102">Silicon Valley Bank Payroll Direct ••1102</option>
              <option value="Brex Corporate Operating Card ••4401">Brex Corporate Operating Card ••4401</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
