import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { Transaction, TransactionType, TransactionStatus } from '../../types';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { updateTransaction, deleteTransaction } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reference: '',
    title: '',
    type: 'Income' as TransactionType,
    category: '',
    amount: 0,
    date: '',
    status: 'Completed' as TransactionStatus,
    account: '',
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        reference: transaction.reference,
        title: transaction.title,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        status: transaction.status,
        account: transaction.account,
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setIsSubmitting(true);
    try {
      await updateTransaction(transaction.id, {
        reference: formData.reference,
        title: formData.title,
        type: formData.type,
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date,
        status: formData.status,
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

  const handleVoid = async () => {
    if (confirm(`Are you sure you want to void transaction ${transaction.reference}?`)) {
      await updateTransaction(transaction.id, { status: 'Cancelled' });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Transaction: ${transaction.reference}`}
      subtitle="Modify permitted ledger entry, categorize disbursement, or adjust reconciliation notes"
      footer={
        <div className="flex items-center justify-between w-full">
          {transaction.status !== 'Cancelled' ? (
            <button
              type="button"
              onClick={handleVoid}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50"
            >
              Void Transaction
            </button>
          ) : <div />}
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
              Save Ledger Changes
            </Button>
          </div>
        </div>
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Amount (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
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
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="Completed">Completed / Settled</option>
              <option value="Pending">Pending Reconciliation</option>
              <option value="Cancelled">Cancelled / Voided</option>
            </select>
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

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Reconciliation Notes & Vouchers
          </label>
          <textarea
            rows={2}
            placeholder="Add bank wire confirmation number, batch reference, or audit notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
