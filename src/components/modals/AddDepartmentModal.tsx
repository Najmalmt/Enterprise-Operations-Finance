import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose }) => {
  const { addDepartment, departments } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: 'SEC',
    headName: 'Marcus Sterling',
    headEmail: 'm.sterling@nexora.internal',
    budget: 650000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.headName) return;

    setIsSubmitting(true);
    try {
      await addDepartment({
        name: formData.name,
        code: formData.code.toUpperCase(),
        headName: formData.headName,
        headEmail: formData.headEmail,
        budget: Number(formData.budget),
      });
      onClose();
      setFormData({
        name: '',
        code: 'SEC',
        headName: 'Marcus Sterling',
        headEmail: 'm.sterling@nexora.internal',
        budget: 650000,
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
      title="Create New Corporate Department"
      subtitle="Establish business division, cost center code, and department head"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Create Department
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Department Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Information Security & Compliance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Cost Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={5}
              placeholder="SEC"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold uppercase outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Department Head Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Marcus Sterling"
              value={formData.headName}
              onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Head Email Address
            </label>
            <input
              type="email"
              required
              placeholder="m.sterling@nexora.internal"
              value={formData.headEmail}
              onChange={(e) => setFormData({ ...formData, headEmail: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Annual Department Budget (USD)
          </label>
          <input
            type="number"
            min="50000"
            step="10000"
            required
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs font-mono font-bold outline-none focus:border-black"
          />
        </div>
      </form>
    </Modal>
  );
};
