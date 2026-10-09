-- ==============================================================================
-- CAMPUS & HOSTEL ISSUE TRACKER - SUPABASE DATABASE SCHEMA
-- Authentication, Profiles & Role-Based Access (Students & Admin / Staff)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
-- User roles: 'student', 'admin', 'staff'
do $$ begin
  create type user_role as enum ('student', 'admin', 'staff');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE
-- Extends Supabase auth.users with student and admin/staff information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role user_role not null default 'student',
  
  -- Student Specific Fields
  roll_no text,
  year_of_study text, -- e.g., 'FE', 'SE', 'TE', 'BE', '1st Year', etc.
  
  -- Admin & Staff Specific Fields
  employee_id text,
  designation text,   -- e.g., 'Hostel Warden', 'Maintenance Supervisor', 'IT In-Charge'
  security_clearance text default 'standard',
  
  -- Shared Profile Fields
  department text,    -- e.g., 'Computer Engineering', 'Hostel Administration', 'Electrical'
  phone_number text,
  room_or_cabin text,
  avatar_url text,
  is_active boolean default true not null,
  verified boolean default false not null,
  
  -- Timestamps
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Unique constraints where applicable
create unique index if not exists idx_profiles_roll_no on public.profiles(roll_no) where roll_no is not null;
create unique index if not exists idx_profiles_employee_id on public.profiles(employee_id) where employee_id is not null;
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;

-- Policy: Allow users to view their own profile
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Policy: Allow admins and staff to view all profiles
create policy "Admins and staff can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'staff')
    )
  );

-- Policy: Allow authenticated students to view staff/admin directory
create policy "Students can view staff profiles"
  on public.profiles
  for select
  to authenticated
  using (role in ('admin', 'staff'));

-- Policy: Allow users to insert their own profile on registration
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Policy: Allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: Admins can update any profile (e.g. verify student, assign staff role)
create policy "Admins can update any profile"
  on public.profiles
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. AUTOMATIC TRIGGER FOR PROFILE CREATION ON AUTH SIGNUP
-- Automatically extracts user metadata from auth.users and inserts into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_val user_role;
  raw_role text;
begin
  -- Determine role from user metadata
  raw_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  if raw_role in ('admin', 'staff') then
    user_role_val := raw_role::user_role;
  else
    user_role_val := 'student'::user_role;
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    roll_no,
    year_of_study,
    employee_id,
    designation,
    department,
    verified
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'fullName',
      split_part(new.email, '@', 1)
    ),
    user_role_val,
    coalesce(new.raw_user_meta_data->>'roll_no', new.raw_user_meta_data->>'rollNo'),
    coalesce(new.raw_user_meta_data->>'year_of_study', new.raw_user_meta_data->>'yearOfStudy'),
    coalesce(new.raw_user_meta_data->>'employee_id', new.raw_user_meta_data->>'employeeId'),
    new.raw_user_meta_data->>'designation',
    new.raw_user_meta_data->>'department',
    case when user_role_val in ('admin', 'staff') then true else false end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = excluded.role,
    roll_no = coalesce(excluded.roll_no, public.profiles.roll_no),
    year_of_study = coalesce(excluded.year_of_study, public.profiles.year_of_study),
    employee_id = coalesce(excluded.employee_id, public.profiles.employee_id),
    designation = coalesce(excluded.designation, public.profiles.designation),
    department = coalesce(excluded.department, public.profiles.department),
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

-- Drop existing trigger if any and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- 7. HELPER FUNCTIONS
-- Helper to check if current user is admin/staff
create or replace function public.is_admin_or_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

-- Helper to fetch current user's profile
create or replace function public.get_my_profile()
returns setof public.profiles
language sql
security definer
stable
as $$
  select * from public.profiles
  where id = auth.uid()
  limit 1;
$$;
