import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { AttendanceRecord } from '../../types';
import { Clock, Calendar, User, FileText, AlertCircle } from 'lucide-react';

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecord?: AttendanceRecord | null;
}

export const ManualAttendanceModal: React.FC<ManualAttendanceModalProps> = ({
  isOpen,
  onClose,
  initialRecord,
}) => {
  const { employees, recordManualAttendance, correctAttendance } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIn, setCheckIn] = useState('09:00 AM');
  const [checkOut, setCheckOut] = useState('06:00 PM');
  const [status, setStatus] = useState<AttendanceRecord['status']>('Present');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setSelectedEmpId(initialRecord.employeeId);
      setDate(initialRecord.date);
      setCheckIn(initialRecord.checkIn || '09:00 AM');
      setCheckOut(initialRecord.checkOut || '06:00 PM');
      setStatus(initialRecord.status);
      setReason('');
    } else {
      setSelectedEmpId(employees[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setCheckIn('09:00 AM');
      setCheckOut('06:00 PM');
      setStatus('Present');
      setReason('');
    }
  }, [initialRecord, employees, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    setIsSubmitting(true);
    try {
      if (initialRecord) {
        await correctAttendance(
          initialRecord.id,
          {
            date,
            checkIn,
            checkOut: status === 'Absent' || status === 'On Leave' ? '—' : checkOut,
            status,
            totalHours: status === 'Half Day' ? 4 : status === 'Present' || status === 'Late' ? 8.5 : 0,
          },
          reason || 'HR Executive manual correction'
        );
      } else {
        await recordManualAttendance(
          {
            employeeId: emp.id,
            employeeName: `${emp.firstName} ${emp.lastName}`,
            department: emp.department,
            date,
            checkIn: status === 'Absent' || status === 'On Leave' ? '—' : checkIn,
            checkOut: status === 'Absent' || status === 'On Leave' ? '—' : checkOut,
            status,
            totalHours: status === 'Half Day' ? 4 : status === 'Present' || status === 'Late' ? 8.5 : 0,
          },
          reason || 'HR Executive manual log entry'
        );
      }
      onClose();
    } catch (err) {
      console.error('Error saving attendance log:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRecord ? 'Correct Attendance Record' : 'Record Workforce Attendance'}
      subtitle="Authorized HR Executive time tracking adjustment & shift verification"
      maxWidth="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            type="submit"
          >
            {initialRecord ? 'Apply Correction' : 'Log Attendance'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Info notice */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            All attendance adjustments and manual recordings are logged with your HR Executive credentials for audit compliance.
          </p>
        </div>

        {/* Employee Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Employee <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            disabled={!!initialRecord}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.department} • {emp.role})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Attendance Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceRecord['status'])}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
            >
              <option value="Present">Present (Full Day)</option>
              <option value="Late">Late Arrival</option>
              <option value="Half Day">Half Day</option>
              <option value="On Leave">On Approved Leave</option>
              <option value="Absent">Unexcused Absence</option>
            </select>
          </div>
        </div>

        {/* Check In / Check Out (if not Absent / On Leave) */}
        {status !== 'Absent' && status !== 'On Leave' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Check In Time
              </label>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Check Out Time
              </label>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="06:00 PM"
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors font-mono"
              />
            </div>
          </div>
        )}

        {/* Reason / Adjustment Note */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Correction / Entry Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Biometric gateway sync failure, employee verified on site by Team Lead."
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
