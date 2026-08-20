import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { LeaveType } from '../../types';

interface RequestLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose }) => {
  const { submitLeaveRequest } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    daysCount: 3,
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) return;

    setIsSubmitting(true);
    try {
      await submitLeaveRequest({
        employeeId: currentUser?.id || 'emp-1',
        employeeName: currentUser?.name || 'Mohammed Najmal',
        department: currentUser?.departmentName || 'Engineering & DevOps',
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        daysCount: Number(formData.daysCount),
        reason: formData.reason,
      });
      onClose();
      setFormData({
        leaveType: 'Annual Leave',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysCount: 3,
        reason: '',
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
      title="Request Paid Time Off / Leave"
      subtitle="Submit request for departmental and HR clearance"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Submit Request
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Leave Classification <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="Annual Leave">Annual Paid Leave</option>
              <option value="Sick Leave">Sick / Medical Leave</option>
              <option value="Maternity/Paternity">Maternity / Paternity</option>
              <option value="Bereavement">Bereavement Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Working Days Count <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="60"
              required
              value={formData.daysCount}
              onChange={(e) => setFormData({ ...formData, daysCount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              End Date
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Reason / Coverage Plan <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Provide context and designated coverage colleague during absence..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>
      </form>
    </Modal>
  );
};
