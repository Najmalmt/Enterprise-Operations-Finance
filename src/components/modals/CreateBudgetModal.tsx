import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({ isOpen, onClose }) => {
  const { addBudget, departments } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    departmentId: departments[0]?.id || 'dept-1',
    departmentName: departments[0]?.name || 'Engineering & DevOps',
    period: '2026-Q3',
    allocated: 600000,
    forecasted: 580000,
  });

  const handleDeptChange = (deptId: string) => {
    const found = departments.find(d => d.id === deptId);
    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      departmentName: found?.name || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBudget({
        departmentId: formData.departmentId,
        departmentName: formData.departmentName,
        period: formData.period,
        allocated: Number(formData.allocated),
        forecasted: Number(formData.forecasted),
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
      title="Create Departmental Budget Cap"
      subtitle="Establish quarterly spend boundaries and burn forecast"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Allocate Budget
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Target Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Fiscal Period <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono"
            >
              <option value="2026-Q1">2026-Q1</option>
              <option value="2026-Q2">2026-Q2</option>
              <option value="2026-Q3">2026-Q3</option>
              <option value="2026-Q4">2026-Q4</option>
              <option value="2027-Q1">2027-Q1</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Allocated Cap Amount (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="10000"
              step="5000"
              required
              value={formData.allocatedAmount}
              onChange={(e) => setFormData({ ...formData, allocatedAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Forecasted Burn (USD)
            </label>
            <input
              type="number"
              min="10000"
              step="5000"
              value={formData.forecastedAmount}
              onChange={(e) => setFormData({ ...formData, forecastedAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono outline-none focus:border-black"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
