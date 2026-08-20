import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { InvoiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose }) => {
  const { addInvoice, invoices } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextNumber = `INV-2026-0${invoices.length + 85}`;

  const [formData, setFormData] = useState({
    invoiceNumber: nextNumber,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 0.05,
    notes: 'Net 30 payment terms. Wire transfer instructions on file.',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'Enterprise Cloud Architecture & DevOps Services',
      quantity: 1,
      unitPrice: 125000,
      total: 125000,
    },
  ]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }
    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * formData.taxRate;
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientEmail || items.length === 0) return;

    setIsSubmitting(true);
    try {
      await addInvoice({
        invoiceNumber: formData.invoiceNumber,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        items,
        taxRate: formData.taxRate,
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
      title="Create Client Invoice"
      subtitle="Generate professional receivables invoice with automated ledger integration"
      maxWidth="2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Generate & Issue Invoice ({formatCurrency(total, true)})
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              required
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Issue Date
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Client Enterprise Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Global Bank"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Client Billing Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="billing@apexbank.com"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Dynamic Line Items */}
        <div className="space-y-2 pt-2 border-t border-[#f0f2f5]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#111827]">Invoice Line Items</span>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 bg-[#fafbfc] p-2.5 rounded-lg border border-[#e5e7eb]">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    placeholder="Deliverable / Service description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs"
                  />
                </div>
                <div className="w-18">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs font-mono"
                  />
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs font-mono"
                  />
                </div>
                <div className="w-24 text-right font-mono font-bold text-xs text-[#111827]">
                  {formatCurrency(item.total, true)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={items.length <= 1}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation summary */}
        <div className="p-3 bg-[#fafbfc] rounded-lg border border-[#f0f2f5] space-y-1 font-mono text-xs text-right">
          <div className="flex justify-between">
            <span className="text-[#6b7280] font-sans">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b7280] font-sans">Tax Rate (5%):</span>
            <span>+{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-[#e5e7eb] font-bold text-sm text-[#111827]">
            <span className="font-sans">Total Receivable:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </form>
    </Modal>
  );
};
