import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface EditInvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const { updateInvoice, deleteInvoice } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: '',
    dueDate: '',
    status: 'Sent' as InvoiceStatus,
    taxRate: 0.05,
    notes: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress || '',
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        taxRate: invoice.taxRate,
        notes: invoice.notes || '',
      });
      setItems(invoice.items.map(item => ({ ...item })));
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : next[index].quantity;
      const p = field === 'unitPrice' ? Number(value) : next[index].unitPrice;
      next[index].total = q * p;
    }
    setItems(next);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * formData.taxRate;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || items.some((i) => !i.description || i.total <= 0)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateInvoice(invoice.id, {
        invoiceNumber: formData.invoiceNumber,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: formData.clientAddress,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        taxRate: formData.taxRate,
        notes: formData.notes,
        items,
        subtotal,
        taxAmount,
        totalAmount,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      await deleteInvoice(invoice.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Invoice: ${invoice.invoiceNumber}`}
      subtitle="Modify contract billing deliverables, adjust client contact, or edit tax rate"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50"
          >
            Delete Invoice
          </button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
              Save Invoice Changes
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Client & Number */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Invoice Code
            </label>
            <input
              type="text"
              required
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Client Enterprise <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Client Billing Email
            </label>
            <input
              type="email"
              required
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent (Pending Payment)</option>
              <option value="Paid">Paid / Settled</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Issue Date
            </label>
            <input
              type="date"
              required
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Payment Due Date (Net-30)
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#111827]">Line Items & Deliverables</span>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs text-black font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id || index} className="flex gap-2 items-center bg-[#f8f9fa] p-2 rounded-lg border border-[#e5e7eb]">
                <input
                  type="text"
                  placeholder="Deliverable description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs outline-none focus:border-black"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-16 px-2 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs font-mono text-center outline-none focus:border-black"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  min="0"
                  step="50"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  className="w-24 px-2 py-1.5 bg-white border border-[#e5e7eb] rounded text-xs font-mono outline-none focus:border-black"
                />
                <div className="w-24 text-right font-mono font-bold text-xs text-[#111827]">
                  {formatCurrency(item.total)}
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-3 bg-[#fafbfc] border border-[#e5e7eb] rounded-lg space-y-1.5 text-right font-mono text-xs">
          <div className="flex justify-between text-[#6b7280]">
            <span className="font-sans">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#6b7280]">
            <span className="font-sans">Tax (5%):</span>
            <span>+{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#111827] pt-1.5 border-t border-[#e5e7eb]">
            <span className="font-sans">Total Billed:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Payment Terms & Bank Wire Instructions
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
