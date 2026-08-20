import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { ProjectPriority, ProjectStatus } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, employees, projects } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextCode = `PRJ-ENG-${projects.length + 501}`;

  const [formData, setFormData] = useState({
    name: '',
    code: nextCode,
    client: '',
    budget: 500000,
    status: 'Active' as ProjectStatus,
    priority: 'High' as ProjectPriority,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leadId: employees[0]?.id || 'emp-4',
    leadName: `${employees[0]?.firstName} ${employees[0]?.lastName}` || 'Sarah Jenkins',
    teamMemberIds: [] as string[],
    teamMembersCount: 8,
    description: '',
  });

  const handleLeadChange = (empId: string) => {
    const found = employees.find(e => e.id === empId);
    setFormData(prev => ({
      ...prev,
      leadId: empId,
      leadName: found ? `${found.firstName} ${found.lastName}` : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.client || !formData.budget) return;

    setIsSubmitting(true);
    try {
      await addProject(formData);
      onClose();
      setFormData({
        name: '',
        code: `PRJ-ENG-${projects.length + 502}`,
        client: '',
        budget: 500000,
        status: 'Active',
        priority: 'High',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        leadId: employees[0]?.id || 'emp-4',
        leadName: `${employees[0]?.firstName} ${employees[0]?.lastName}` || 'Sarah Jenkins',
        teamMemberIds: [],
        teamMembersCount: 8,
        description: '',
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
      title="Launch New Enterprise IT Project"
      subtitle="Define budget, client engagement terms, milestones, and technical lead"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} type="submit">
            Initialize Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Core Ledger Modernization"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Project Code
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Client Enterprise <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. JPMorgan Chase or Global FinCorp"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Allocated Budget (USD) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="50000"
              step="10000"
              required
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black font-mono font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Technical Lead / PM
            </label>
            <select
              value={formData.leadId}
              onChange={(e) => handleLeadChange(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Target Delivery Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Scope & Architecture Summary
          </label>
          <textarea
            rows={3}
            placeholder="Technical deliverables, Kubernetes / microservice stack, infrastructure requirements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black"
          />
        </div>
      </form>
    </Modal>
  );
};
