import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { EmployeeDocument } from '../../types';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
}) => {
  const { addEmployeeDocument } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [documentName, setDocumentName] = useState('');
  const [docType, setDocType] = useState<EmployeeDocument['type']>('Contract');
  const [status, setStatus] = useState<EmployeeDocument['status']>('Verified');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName) return;

    setIsSubmitting(true);
    try {
      await addEmployeeDocument({
        employeeId,
        employeeName,
        name: documentName.endsWith('.pdf') || documentName.endsWith('.docx') ? documentName : `${documentName}.pdf`,
        type: docType,
        fileSize: fileSize || '1.2 MB',
        status,
        uploadedBy: 'Hannah Brooks (HR Executive)',
      });
      onClose();
      setDocumentName('');
      setFileName('');
    } catch (err) {
      console.error('Error uploading document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Employee Compliance Document"
      subtitle={`Attach verified personnel record for ${employeeName}`}
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
            Upload Document
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Document Type */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Document Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={docType}
            onChange={(e) => {
              const val = e.target.value as EmployeeDocument['type'];
              setDocType(val);
              if (!documentName || documentName.includes('Document')) {
                setDocumentName(`${employeeName} - ${val}.pdf`);
              }
            }}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          >
            <option value="Contract">Employment Contract & Offer</option>
            <option value="ID Proof">Government ID & I-9 Verification</option>
            <option value="Tax Form W-4">Federal Form W-4 / State Tax</option>
            <option value="NDA">Non-Disclosure Agreement (NDA)</option>
            <option value="Certificate">Professional Certification & Degree</option>
            <option value="Emergency Contact">Emergency Contact & Medical Record</option>
          </select>
        </div>

        {/* Document Name */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Document Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="e.g. Employment_Agreement_Signed.pdf"
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          />
        </div>

        {/* File Dropzone */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            File Attachment (PDF, DOCX, PNG) <span className="text-rose-500">*</span>
          </label>
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#e5e7eb] rounded-lg bg-[#fafbfc] hover:bg-[#f3f4f6] cursor-pointer transition-colors">
            <Upload className="w-6 h-6 text-[#9ca3af] mb-1.5" />
            <span className="font-semibold text-xs text-[#111827]">
              {fileName || 'Click or drag document to attach'}
            </span>
            <span className="text-[10px] text-[#6b7280] mt-0.5">
              PDF, DOCX up to 25MB • Secure encrypted storage
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">
            Verification Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EmployeeDocument['status'])}
            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-black focus:bg-white transition-colors"
          >
            <option value="Verified">Verified & Validated</option>
            <option value="Pending Review">Pending HR Review</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};
