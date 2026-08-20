import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { Department } from '../../types';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const { updateDepartment, deleteDepartment, employees } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headName: '',
    headEmail: '',
    location: 'Headquarters (San Francisco)',
    description: '',
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        code: department.code,
        headName: department.headName,
        headEmail: department.headEmail,
        location: department.location || 'Headquarters (San Francisco)',
        description: department.description || '',
      });
    }
  }, [department]);

  if (!department) return null;

  const departmentEmployees = employees.filter(
    (e) => e.department === department.name || e.departmentId === department.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.headName) return;

    setIsSubmitting(true);
    try {
      await updateDepartment(department.id, {
        name: formData.name,
        code: formData.code.toUpperCase(),
        headName: formData.headName,
        headEmail: formData.headEmail,
        location: formData.location,
        description: formData.description,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (departmentEmployees.length > 0) {
      alert(`Cannot delete department "${department.name}" because it still has ${departmentEmployees.length} assigned personnel. Reassign them first.`);
      return;
    }
    if (confirm(`Are you sure you want to remove the "${department.name}" department?`)) {
      await deleteDepartment(department.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Department: ${department.name}`}
      subtitle="Update organizational unit parameters, department head, and location"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            type="button"
          >
            Remove Department
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </div>
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
              value={formData.headName}
              onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Department Head Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.headEmail}
              onChange={(e) => setFormData({ ...formData, headEmail: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Primary Location / Campus
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Headquarters (San Francisco) or Remote-First"
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Department Scope & Mandate
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief overview of the unit's operational charter and deliverables..."
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>

        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-xs font-bold text-zinc-800">Department Personnel Count</p>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Currently {departmentEmployees.length} personnel are assigned to this business unit.
          </p>
        </div>
      </form>
    </Modal>
  );
};
