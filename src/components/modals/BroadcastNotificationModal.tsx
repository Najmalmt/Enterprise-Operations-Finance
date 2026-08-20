import React, { useState } from 'react';
import {
  X,
  Bell,
  Send,
  AlertTriangle,
  Info,
  DollarSign,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../common/Button';

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastNotificationModal: React.FC<BroadcastNotificationModalProps> = ({ isOpen, onClose }) => {
  const { sendNotification } = useData();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'system' | 'approval' | 'finance' | 'project'>('system');
  const [linkTo, setLinkTo] = useState('/dashboard');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendNotification({
      title: title.trim(),
      message: message.trim(),
      type,
      linkTo,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setTitle('');
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#e5e7eb] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#f0f2f5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                Broadcast Company Announcement
              </h2>
              <p className="text-xs text-[#6b7280]">
                Dispatch immediate real-time notifications to all active personnel and managers.
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

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#111827]">Announcement Dispatched!</h3>
            <p className="text-xs text-[#6b7280]">
              The notification has been broadcast to all team members across the organization.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                Announcement Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Q3 All-Hands Meeting & Profit Sharing Announcement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:bg-white focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                Announcement Message Details *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write message details for the company roster..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:bg-white focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Alert Category / Priority
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-semibold text-[#111827] focus:outline-hidden focus:border-black"
                >
                  <option value="system">Corporate Announcement (General)</option>
                  <option value="finance">Treasury & Payroll Alert</option>
                  <option value="approval">Executive Approval Notice</option>
                  <option value="project">Project Milestone Update</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Navigation Target Path
                </label>
                <select
                  value={linkTo}
                  onChange={(e) => setLinkTo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-semibold text-[#111827] focus:outline-hidden focus:border-black"
                >
                  <option value="/dashboard">Executive Dashboard</option>
                  <option value="/employees">Personnel Directory</option>
                  <option value="/finance">Finance & Treasury</option>
                  <option value="/payroll">Payroll Roster</option>
                  <option value="/expenses">Expense Center</option>
                  <option value="/projects">Enterprise Projects</option>
                  <option value="/attendance">Attendance & PTO</option>
                  <option value="/settings">Settings & Governance</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#f0f2f5]">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Broadcast to Company
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
