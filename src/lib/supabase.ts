import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as unknown as { env?: Record<string, string> };
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('xyzcompany') && 
  supabaseUrl.startsWith('https://')
);

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    supabaseInstance = null;
  }
}

export const supabase = supabaseInstance;

/**
 * SQL migration schema generator for Supabase
 * Can be exported or copied in Settings > Supabase Connection
 */
export const SUPABASE_SCHEMA_SQL = `-- ========================================================
-- NEXORA Enterprise Management & Finance Schema for Supabase
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Departments Table
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,
  head_name text,
  head_email text,
  budget numeric(15,2) default 0.00,
  spent numeric(15,2) default 0.00,
  employee_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Employees Table
create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  role text not null,
  department_id uuid references public.departments(id),
  department text not null,
  salary numeric(15,2) default 0.00,
  start_date date not null,
  status text default 'Active' check (status in ('Active', 'On Leave', 'Terminated', 'Probation')),
  location text default 'Headquarters',
  bank_account text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Projects Table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,
  client text not null,
  budget numeric(15,2) default 0.00,
  spent numeric(15,2) default 0.00,
  status text default 'Active' check (status in ('Planning', 'Active', 'On Hold', 'Completed')),
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Critical')),
  start_date date not null,
  end_date date not null,
  lead_id text,
  lead_name text,
  progress_percent integer default 0,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Expenses Table
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  amount numeric(15,2) not null,
  category text not null,
  date date not null,
  submitter_id text not null,
  submitter_name text not null,
  submitter_department text not null,
  project_id uuid references public.projects(id),
  project_name text,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Paid')),
  approved_by text,
  approval_date timestamp with time zone,
  rejection_reason text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Transactions Table
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  reference text not null unique,
  title text not null,
  type text not null check (type in ('Income', 'Expense')),
  category text not null,
  amount numeric(15,2) not null,
  date date not null,
  status text default 'Completed' check (status in ('Completed', 'Pending', 'Cancelled')),
  account text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Invoices Table
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_number text not null unique,
  client_name text not null,
  client_email text not null,
  client_address text,
  issue_date date not null,
  due_date date not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(15,2) not null,
  tax_rate numeric(5,2) default 0.10,
  tax_amount numeric(15,2) not null,
  total_amount numeric(15,2) not null,
  status text default 'Sent' check (status in ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
  paid_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Payroll Records Table
create table if not exists public.payroll_records (
  id uuid primary key default uuid_generate_v4(),
  month text not null,
  period_name text not null,
  total_gross numeric(15,2) not null,
  total_tax numeric(15,2) not null,
  total_benefits numeric(15,2) not null,
  total_net numeric(15,2) not null,
  employee_count integer not null,
  status text default 'Processing' check (status in ('Draft', 'Processing', 'Paid', 'Failed')),
  payment_date date,
  processed_by text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Leave Requests Table
create table if not exists public.leave_requests (
  id uuid primary key default uuid_generate_v4(),
  employee_id text not null,
  employee_name text not null,
  department text not null,
  leave_type text not null,
  start_date date not null,
  end_date date not null,
  days_count integer not null,
  reason text not null,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  applied_date date not null,
  reviewed_by text,
  reviewed_date timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Attendance Table
create table if not exists public.attendance (
  id uuid primary key default uuid_generate_v4(),
  employee_id text not null,
  employee_name text not null,
  department text not null,
  date date not null,
  check_in text not null,
  check_out text,
  total_hours numeric(4,2),
  status text default 'Present' check (status in ('Present', 'Late', 'Half Day', 'Absent', 'On Leave')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Audit Logs Table
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text not null,
  user_name text not null,
  user_role text not null,
  action text not null,
  module text not null,
  details text not null,
  ip_address text
);

-- Enable Row Level Security (RLS)
alter table public.departments enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
alter table public.expenses enable row level security;
alter table public.transactions enable row level security;
alter table public.invoices enable row level security;
alter table public.payroll_records enable row level security;
alter table public.leave_requests enable row level security;
alter table public.attendance enable row level security;
alter table public.audit_logs enable row level security;

-- Setup default permissive policies for authenticated and anon role read/write in enterprise dashboard
create policy "Allow all actions for departments" on public.departments for all using (true) with check (true);
create policy "Allow all actions for employees" on public.employees for all using (true) with check (true);
create policy "Allow all actions for projects" on public.projects for all using (true) with check (true);
create policy "Allow all actions for expenses" on public.expenses for all using (true) with check (true);
create policy "Allow all actions for transactions" on public.transactions for all using (true) with check (true);
create policy "Allow all actions for invoices" on public.invoices for all using (true) with check (true);
create policy "Allow all actions for payroll_records" on public.payroll_records for all using (true) with check (true);
create policy "Allow all actions for leave_requests" on public.leave_requests for all using (true) with check (true);
create policy "Allow all actions for attendance" on public.attendance for all using (true) with check (true);
create policy "Allow all actions for audit_logs" on public.audit_logs for all using (true) with check (true);
`;
