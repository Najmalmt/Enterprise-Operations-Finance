import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Send,
  CheckCircle,
  Clock,
  Printer,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { useData } from '../context/DataContext';
import { Invoice, InvoiceStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CreateInvoiceModal } from '../components/modals/CreateInvoiceModal';
import { EditInvoiceModal } from '../components/modals/EditInvoiceModal';
import { useAuth } from '../context/AuthContext';

export const InvoicesPage: React.FC = () => {
  const { invoices, updateInvoiceStatus } = useData();
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const canManageInvoices = hasPermission('manage_invoices');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const collectedPaid = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const outstanding = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

  const exportCSV = () => {
    const headers = ['Invoice Number,Client,Email,Amount,Status,Issue Date,Due Date\n'];
    const rows = invoices.map(inv =>
      `"${inv.invoiceNumber}","${inv.clientName}","${inv.clientEmail}",${inv.totalAmount},"${inv.status}","${inv.issueDate}","${inv.dueDate}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora-invoices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Enterprise Client Invoicing & Receivables
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800">
              {invoices.length} Invoices
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Contract billing cycles, Net-30 payment milestones, and automatic general ledger receipt posting.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Invoices
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Gross Billed (YTD)</span>
          <p className="text-2xl font-bold text-[#111827] font-mono mt-1">{formatCurrency(totalInvoiced, true)}</p>
          <p className="text-[11px] text-[#6b7280] mt-1">{invoices.length} corporate contracts</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Collected Receipts</span>
          <p className="text-2xl font-bold text-emerald-700 font-mono mt-1">{formatCurrency(collectedPaid, true)}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Reconciled to treasury</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#e5e7eb]">
          <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Outstanding Receivables</span>
          <p className="text-2xl font-bold text-amber-700 font-mono mt-1">{formatCurrency(outstanding, true)}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Pending Net-30 maturity</p>
        </div>
      </div>

      {/* Invoices Table */}
      <Card noPadding>
        <div className="p-4 border-b border-[#f0f2f5] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice number or enterprise client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#374151] outline-none focus:border-black"
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Sent">Sent (Pending)</option>
              <option value="Draft">Draft</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No invoices found"
            description="Adjust your search filters to find invoice records."
            actionLabel="Reset Search Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedStatus('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Invoice #</th>
                  <th className="px-4 py-3">Client Enterprise</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setViewingInvoice(inv)}
                    className="hover:bg-[#fafbfc] transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-[#111827]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#111827]">{inv.clientName}</p>
                      <p className="text-[11px] text-[#6b7280]">{inv.clientEmail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[#6b7280] font-mono">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3.5 text-[#6b7280] font-mono">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={getStatusBadgeVariant(inv.status)} size="sm">{inv.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm text-[#111827]">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        {inv.status === 'Sent' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                            className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        {inv.status === 'Draft' && (
                          <button
                            onClick={() => updateInvoiceStatus(inv.id, 'Sent')}
                            className="px-2.5 py-1 rounded bg-black text-white hover:bg-zinc-800 text-[11px] font-semibold cursor-pointer"
                          >
                            Issue
                          </button>
                        )}
                        {canManageInvoices && (
                          <button
                            onClick={() => setEditingInvoice(inv)}
                            className="px-2 py-1 rounded border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] text-[11px]"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="px-2 py-1 rounded border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] text-[11px]"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Invoice Detail / Printable View Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Invoice ${viewingInvoice.invoiceNumber}`}
          subtitle="Official Enterprise Billing Record"
          maxWidth="xl"
          footer={
            <>
              <Button variant="secondary" onClick={() => setViewingInvoice(null)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print / Download PDF
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-2 print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-[#e5e7eb]">
              <div>
                <span className="text-base font-bold tracking-tight text-[#111827] block">NEXORA SYSTEMS INC.</span>
                <p className="text-[#6b7280] text-[11px]">500 Howard Street, Suite 1400</p>
                <p className="text-[#6b7280] text-[11px]">San Francisco, CA 94105</p>
                <p className="text-[#6b7280] text-[11px]">finance@nexora.internal</p>
              </div>
              <div className="text-right">
                <Badge variant={getStatusBadgeVariant(viewingInvoice.status)} size="md">
                  {viewingInvoice.status.toUpperCase()}
                </Badge>
                <p className="font-mono font-bold text-base text-[#111827] mt-2">{viewingInvoice.invoiceNumber}</p>
                <p className="text-[11px] text-[#6b7280]">Issue: {formatDate(viewingInvoice.issueDate)}</p>
                <p className="text-[11px] text-[#6b7280]">Due: {formatDate(viewingInvoice.dueDate)}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-3 bg-[#fafbfc] rounded-lg border border-[#f0f2f5]">
              <span className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Bill To Client:</span>
              <p className="font-bold text-[#111827] text-sm mt-0.5">{viewingInvoice.clientName}</p>
              <p className="text-[#6b7280]">{viewingInvoice.clientEmail}</p>
              {viewingInvoice.clientAddress && <p className="text-[#6b7280]">{viewingInvoice.clientAddress}</p>}
            </div>

            {/* Line Items */}
            <table className="w-full text-left">
              <thead className="border-b border-[#e5e7eb] font-semibold text-[#6b7280] text-[11px]">
                <tr>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {viewingInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 font-medium text-[#111827]">{item.description}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals summary */}
            <div className="p-4 bg-[#fafbfc] rounded-lg border border-[#e5e7eb] space-y-1.5 font-mono text-right text-xs">
              <div className="flex justify-between text-[#6b7280]">
                <span className="font-sans">Subtotal:</span>
                <span>{formatCurrency(viewingInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6b7280]">
                <span className="font-sans">Tax (5%):</span>
                <span>+{formatCurrency(viewingInvoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#e5e7eb] font-bold text-base text-[#111827]">
                <span className="font-sans">Total Billed:</span>
                <span>{formatCurrency(viewingInvoice.totalAmount)}</span>
              </div>
            </div>

            {viewingInvoice.notes && (
              <p className="text-[11px] text-[#6b7280] italic border-t border-[#f0f2f5] pt-3">
                Note: {viewingInvoice.notes}
              </p>
            )}
          </div>
        </Modal>
      )}

      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <EditInvoiceModal
        invoice={editingInvoice}
        isOpen={!!editingInvoice}
        onClose={() => setEditingInvoice(null)}
      />
    </div>
  );
};
