import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, LayoutDashboard, Users, Briefcase, Receipt, FileText, Wallet, Settings } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const { employees, projects, expenses, invoices } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPages = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
    { label: 'Employee Directory', path: '/employees', icon: Users, category: 'Pages' },
    { label: 'Corporate Finance', path: '/finance', icon: Wallet, category: 'Pages' },
    { label: 'Enterprise Projects', path: '/projects', icon: Briefcase, category: 'Pages' },
    { label: 'Expense Claims', path: '/expenses', icon: Receipt, category: 'Pages' },
    { label: 'Client Invoices', path: '/invoices', icon: FileText, category: 'Pages' },
    { label: 'System Settings', path: '/settings', icon: Settings, category: 'Pages' },
  ];

  const filteredPages = quickPages.filter(p => p.label.toLowerCase().includes(query.toLowerCase()));

  const filteredEmployees = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    e.role.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.client.toLowerCase().includes(query.toLowerCase()) ||
    p.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
    inv.clientName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-xl border border-[#e5e7eb] shadow-2xl overflow-hidden z-10">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0f2f5]">
          <Search className="w-4 h-4 text-[#9ca3af] shrink-0" />
          <input
            type="text"
            placeholder="Search employees, projects, invoices, or navigation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm outline-none text-[#111827] placeholder-[#9ca3af] bg-transparent"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#f3f4f6] text-[#6b7280] rounded border border-[#e5e7eb]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Navigation
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="w-full px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] rounded-lg flex items-center justify-between group transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-[#6b7280] group-hover:text-black" />
                        {page.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#9ca3af] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employees match */}
          {filteredEmployees.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Employees & Personnel
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => handleSelect('/employees')}
                    className="w-full px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] rounded-lg flex items-center justify-between group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">
                        {emp.firstName[0]}
                      </div>
                      <div>
                        <span className="font-medium text-[#111827]">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[11px] text-[#6b7280] ml-2">({emp.role} • {emp.department})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#9ca3af]">{emp.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects match */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                IT Projects
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('/projects')}
                    className="w-full px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] rounded-lg flex items-center justify-between group transition-colors text-left"
                  >
                    <div>
                      <span className="font-medium text-[#111827]">{p.name}</span>
                      <span className="text-[11px] text-[#6b7280] ml-2">[{p.code}] - {p.client}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700">{p.progressPercent}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices match */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                Invoices
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => handleSelect('/invoices')}
                    className="w-full px-3 py-2 text-xs text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827] rounded-lg flex items-center justify-between group transition-colors text-left"
                  >
                    <div>
                      <span className="font-medium text-[#111827]">{inv.invoiceNumber}</span>
                      <span className="text-[11px] text-[#6b7280] ml-2">{inv.clientName}</span>
                    </div>
                    <span className="text-xs font-mono font-medium">${inv.totalAmount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredEmployees.length === 0 && filteredProjects.length === 0 && (
            <div className="py-8 text-center text-xs text-[#6b7280]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
