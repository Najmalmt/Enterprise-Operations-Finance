import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Database,
  Users,
  Key,
  RefreshCw,
  Copy,
  Check,
  CheckCircle,
  AlertTriangle,
  Server,
  Code,
  Save,
  Building2,
  Lock,
  Globe,
  Mail,
  UserCheck,
  Sliders,
  Bell,
  Crown
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/formatters';
import { isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { UserRole } from '../types';
import { ManageUserAccountsModal } from '../components/modals/ManageUserAccountsModal';
import { BroadcastNotificationModal } from '../components/modals/BroadcastNotificationModal';

export const SettingsPage: React.FC = () => {
  const {
    auditLogs,
    users,
    companyInfo,
    systemSettings,
    updateCompanyInfo,
    updateSystemSettings,
    resetDemoData,
    syncWithSupabase
  } = useData();

  const { currentRole, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'company' | 'governance' | 'rbac' | 'supabase' | 'audit'>('company');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Modals
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  // Local form states for Company Info
  const [companyForm, setCompanyForm] = useState(companyInfo);
  // Local form states for System Settings
  const [settingsForm, setSettingsForm] = useState(systemSettings);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithSupabase();
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all mock datasets to default enterprise seed state?')) {
      resetDemoData();
    }
  };

  const handleSaveCompanyInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyInfo(companyForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSystemSettings(settingsForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const rolesList: { role: UserRole; title: string; desc: string; modules: string[] }[] = [
    {
      role: 'Super Admin',
      title: 'Super Admin / Chief Executive Officer',
      desc: 'Has overall control of the company system and can see company-wide performance. Full CRUD on employees, departments, projects, user accounts, financial ledger, budgets, revenue, profit/loss, payroll, and settings.',
      modules: ['Executive Dashboard', 'Personnel Directory', 'Corporate Finance', 'Enterprise Projects', 'Expense Claims', 'Client Invoices', 'Payroll Disbursal', 'Workforce Attendance', 'RBAC & Governance', 'Company Information', 'System Settings'],
    },
    {
      role: 'Finance Manager',
      title: 'Finance Manager & Treasury Controller',
      desc: 'Oversees financial health, treasury allocations, budget compliance, invoices, and payroll disbursals.',
      modules: ['Executive Dashboard', 'Corporate Finance', 'Expense Clearances', 'Client Invoices', 'Payroll Disbursal', 'Budget Matrix'],
    },
    {
      role: 'HR Manager',
      title: 'HR Manager & People Operations',
      desc: 'Responsible for employees, departments, attendance, leave approvals, and workforce records.',
      modules: ['Executive Dashboard', 'Personnel Directory', 'Workforce Attendance', 'PTO Approvals', 'Employee Documents', 'HR Reports'],
    },
    {
      role: 'HR Executive',
      title: 'HR Executive & Talent Assistant',
      desc: 'Assists HR management with employee onboarding, profile maintenance, attendance tracking, and initial document checks.',
      modules: ['Personnel Directory', 'Workforce Attendance', 'Leave Review & Verification', 'Employee Documents'],
    },
    {
      role: 'Project Manager',
      title: 'Senior Project Manager',
      desc: 'Project milestone management, technical squad allocation, sprint progress, and project budget tracking.',
      modules: ['Enterprise Projects', 'Project Tasks & Sprints', 'Expense Claims', 'Squad Allocations'],
    },
    {
      role: 'Team Lead',
      title: 'Engineering / Operations Team Lead',
      desc: 'Squad leadership, sprint task execution, member check-ins, and squad project delivery.',
      modules: ['Project Deliverables', 'Sprint Tasks', 'Squad Attendance', 'Expense Claims'],
    },
    {
      role: 'Accountant',
      title: 'Senior Staff Accountant',
      desc: 'Day-to-day transaction recording, ledger reconciliation, invoice drafting, and expense pre-audits.',
      modules: ['Financial Ledger', 'Invoice Drafts', 'Expense Audits', 'Payroll Records (View)'],
    },
    {
      role: 'Employee',
      title: 'Staff Member / Self-Service',
      desc: 'Self-service portal for personal expense filing, biometric/remote check-in, and PTO time-off requests.',
      modules: ['Personal Dashboard', 'Expense Claims (Personal)', 'Workforce Attendance (Personal)', 'PTO Requests'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827] tracking-tight">
              Enterprise Governance, Settings & Security
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              v2.5.0-Production
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Manage company profile, global security thresholds, user credentials, RBAC matrix, and audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => setShowBroadcast(true)}>
            <Bell className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            Broadcast Alert
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowManageUsers(true)}>
            <Users className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            Manage Users ({users.length})
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Seed Data
          </Button>
          <Button variant="primary" size="sm" onClick={handleSync} isLoading={isSyncing}>
            <Server className="w-3.5 h-3.5 mr-1.5" />
            Sync with Database
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration and settings updated successfully. Changes applied across all active nodes.</span>
        </div>
      )}

      {syncSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Database state synchronized successfully. All local models are mirrored in real-time.</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb] flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'company'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          Company Information & Legal Profile
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'governance'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          System Settings & Governance
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rbac'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          RBAC Matrix & User Accounts
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'supabase'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          Supabase Cloud Setup
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-black text-black'
              : 'border-transparent text-[#6b7280] hover:text-black'
          }`}
        >
          Audit Stream ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: COMPANY INFORMATION */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompanyInfo} className="space-y-6">
          <Card
            headerTitle="Corporate Entity & Legal Registration"
            headerSubtitle="Legal identity, tax registration, and primary enterprise credentials"
            headerAction={
              <Button type="submit" variant="primary" size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Company Information
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Company Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.legalName}
                  onChange={(e) => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-bold text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Enterprise EIN / Tax Registration ID *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.taxId}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-mono text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Global Headquarters Address
                </label>
                <input
                  type="text"
                  value={companyForm.headquartersAddress}
                  onChange={(e) => setCompanyForm({ ...companyForm, headquartersAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Chief Executive Officer (CEO)
                </label>
                <input
                  type="text"
                  value={companyForm.ceoName}
                  onChange={(e) => setCompanyForm({ ...companyForm, ceoName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Primary Functional Currency
                </label>
                <input
                  type="text"
                  value={companyForm.currency}
                  onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs font-mono text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Fiscal Year End
                </label>
                <input
                  type="text"
                  value={companyForm.fiscalYearEnd}
                  onChange={(e) => setCompanyForm({ ...companyForm, fiscalYearEnd: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Corporate Website URL
                </label>
                <input
                  type="text"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                  Official Support & HR Inquiries Email
                </label>
                <input
                  type="email"
                  value={companyForm.supportEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: SYSTEM GOVERNANCE */}
      {activeTab === 'governance' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card
            headerTitle="Security Governance & Operating Rules"
            headerSubtitle="Enforce session security, financial auto-approval caps, and audit policies"
            headerAction={
              <Button type="submit" variant="primary" size="sm">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Apply Global Settings
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <h3 className="font-bold text-[#111827] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-purple-600" />
                  Authentication & Access Policies
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                    Session Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={720}
                    value={settingsForm.sessionTimeoutMinutes}
                    onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeoutMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#fafbfc] border border-[#e5e7eb]">
                  <div>
                    <div className="font-semibold text-[#111827]">Enforce Multi-Factor Authentication (MFA)</div>
                    <div className="text-[11px] text-[#6b7280]">Require TOTP/FIDO2 for all managerial & admin logins</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.enforceMFA}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enforceMFA: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#fafbfc] border border-[#e5e7eb]">
                  <div>
                    <div className="font-semibold text-[#111827]">Enable Company Broadcast Alerts</div>
                    <div className="text-[11px] text-[#6b7280]">Allow CEO & Super Admins to send real-time banner announcements</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.companyWideAnnouncementsEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyWideAnnouncementsEnabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-[#111827] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  Financial & HR Thresholds
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                    Automatic Expense Approval Cap ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.autoApproveExpenseLimit}
                    onChange={(e) => setSettingsForm({ ...settingsForm, autoApproveExpenseLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                  />
                  <span className="text-[10px] text-[#6b7280] mt-0.5 block">
                    Claims below this amount bypass manual CEO clearance if pre-approved by lead.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4b5563] mb-1">
                    Receipt Required For Claims Above ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.requireReceiptAbove}
                    onChange={(e) => setSettingsForm({ ...settingsForm, requireReceiptAbove: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#111827] focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#fafbfc] border border-[#e5e7eb]">
                  <div>
                    <div className="font-semibold text-[#111827]">Allow Remote / Geofence Clock-In</div>
                    <div className="text-[11px] text-[#6b7280]">Permit employees to log attendance from verified web portal</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.allowEmployeeClockIn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, allowEmployeeClockIn: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 3: RBAC ROLES & USERS */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          <Card
            headerTitle="Role-Based Access Control (RBAC) Matrix"
            headerSubtitle="Defined enterprise authority tiers and authorized operational boundaries"
            headerAction={
              <Button variant="primary" size="sm" onClick={() => setShowManageUsers(true)}>
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Manage User Accounts ({users.length})
              </Button>
            }
          >
            <div className="space-y-4">
              {rolesList.map((item) => (
                <div
                  key={item.role}
                  className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fafbfc] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.role === 'Super Admin' && <Crown className="w-4 h-4 text-amber-600" />}
                      <span className="font-bold text-sm text-[#111827]">{item.title}</span>
                      <span className="font-mono text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
                        {item.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentRole === item.role ? (
                        <Badge variant="success">Currently Active Role</Badge>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => switchRole(item.role)}>
                          Simulate {item.role}
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#4b5563] leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                      Granted Modules & Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.modules.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-[#e5e7eb] text-[#374151] text-[11px] font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: SUPABASE INTEGRATION */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          <Card
            headerTitle="Supabase PostgreSQL Integration & Auto-Sync Engine"
            headerSubtitle="Direct database connectivity for persistence, real-time sync, and backup"
            headerAction={
              <Button variant="secondary" size="sm" onClick={handleCopySql}>
                {copiedSql ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copiedSql ? 'Copied to Clipboard' : 'Copy PostgreSQL Schema SQL'}
              </Button>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#e5e7eb] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#111827]" />
                    <span className="font-bold text-[#111827]">Engine Status</span>
                  </div>
                  <Badge variant={isSupabaseConfigured ? 'success' : 'neutral'}>
                    {isSupabaseConfigured ? 'Connected & Verified' : 'Local Persistence + Supabase Ready'}
                  </Badge>
                </div>
                <p className="text-[#6b7280] leading-relaxed">
                  The dashboard operates on high-speed Local-First state persisted across sessions with Supabase synchronization ready out-of-the-box. To connect your remote Supabase project, set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment, and execute the SQL migration below in your Supabase SQL Editor.
                </p>
              </div>

              {/* Schema SQL Viewer */}
              <div className="space-y-2">
                <span className="font-semibold text-[#111827] uppercase tracking-wider text-[11px]">
                  PostgreSQL Migration Blueprint (8 Tables + Indexes)
                </span>
                <div className="p-4 rounded-xl bg-zinc-950 text-zinc-300 font-mono text-[11px] max-h-72 overflow-y-auto border border-zinc-800 leading-relaxed">
                  <pre>{SUPABASE_SCHEMA_SQL}</pre>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: AUDIT STREAM */}
      {activeTab === 'audit' && (
        <Card
          headerTitle="Immutable Security Audit Logs"
          headerSubtitle="Cryptographically sequenced ledger of operational events"
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfc] border-b border-[#f0f2f5] text-[#6b7280] font-semibold">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor & Role</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-5 py-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f5]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-5 py-3 font-mono text-[11px] text-[#6b7280]">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#111827]">{log.userName}</span>
                      <span className="text-[10px] text-[#6b7280] ml-1.5 font-mono">({log.userRole})</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#4b5563]">
                      {log.module}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[10px] font-bold text-zinc-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#374151] leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODALS */}
      <ManageUserAccountsModal
        isOpen={showManageUsers}
        onClose={() => setShowManageUsers(false)}
      />
      <BroadcastNotificationModal
        isOpen={showBroadcast}
        onClose={() => setShowBroadcast(false)}
      />
    </div>
  );
};
