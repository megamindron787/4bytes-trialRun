# 🚀 Supabase Database & Authentication Setup Guide

This guide explains how to connect your **CampusFix (Campus & Hostel Issue Tracker)** project to your Supabase project for Student and Admin/Staff authentication.

---

## 📋 What Was Built

1. **Database Schema (`supabase_schema.sql`)**:
   - `profiles` table extending Supabase's `auth.users` with role-based attributes.
   - Dual-role support for **Students** (`roll_no`, `year_of_study`, `department`) and **Admins / Staff** (`employee_id`, `designation`, `department`).
   - PostgreSQL Trigger `on_auth_user_created` that automatically creates a profile in `public.profiles` upon `auth.users` sign-up.
   - Row Level Security (RLS) policies allowing users to read and update their profiles, and admins to manage profiles.

2. **Frontend Integration (`@supabase/supabase-js`)**:
   - Supabase client: `frontend/src/services/supabaseClient.js`
   - Complete authentication service: `frontend/src/services/authService.js`
   - Auth Context updated: `frontend/src/context/AuthContext.jsx`
   - Components updated: `StudentLogin.jsx`, `StudentRegister.jsx`, `AdminLogin.jsx`, `AdminRegister.jsx`, `AuthContainer.jsx`.
   - Seamless demo fallback when live credentials are not yet entered.

---

## 🛠️ Step-by-Step Setup

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and log in.
2. Click **New Project**.
3. Choose your organization, set a project name (e.g. `campus-issue-tracker`), set a strong database password, and choose your preferred region.
4. Click **Create new project** and wait for it to finish provisioning (~1-2 minutes).

---

### Step 2: Run the Database Schema
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open [`supabase_schema.sql`](./supabase_schema.sql) in this repository, copy the entire SQL script, and paste it into the Supabase SQL Editor.
4. Click **Run** (or press `Ctrl+Enter`).
5. You should see `Success. No rows returned`.
6. Go to **Table Editor** -> **profiles** to verify that the table has been created with all the student and admin columns.

---

### Step 3: Configure Auth Settings (Recommended for Development)
1. Go to **Authentication** -> **Providers** -> **Email**.
2. **Disable "Confirm email"** if you want instant login upon registration without having to click an email verification link during development.
3. Click **Save**.

---

### Step 4: Add Supabase Credentials to Frontend
1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **anon public API Key**.
3. In `frontend/.env`, replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
   VITE_ADMIN_SECURITY_CODE=CAMPUSFIX_ADMIN_2024
   ```
4. Save the file. Vite will automatically reload and connect directly to Supabase!
   *(You will see the green "Supabase PostgreSQL Database Connected" badge appear on the login page).*

---

## 📊 Database Schema Details

### `public.profiles` Table

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key, references `auth.users(id)` |
| `email` | `text` | User's college or admin email |
| `full_name` | `text` | Display name of the student or staff member |
| `role` | `user_role` | `'student'`, `'admin'`, or `'staff'` |
| `department` | `text` | Academic branch (e.g. CSE) or Staff Dept (e.g. Hostel Admin, Estate) |
| `roll_no` | `text` | Student Roll / PRN Number *(Student only)* |
| `year_of_study` | `text` | Year of study (e.g. FE, SE, TE, BE) *(Student only)* |
| `employee_id` | `text` | Staff Employee Code *(Admin/Staff only)* |
| `designation` | `text` | Staff Title (e.g. Hostel Warden) *(Admin/Staff only)* |
| `verified` | `boolean` | Verification status |
| `created_at` | `timestamptz` | Account creation timestamp |
| `updated_at` | `timestamptz` | Last updated timestamp |

---

## 🔑 Demo Admin Security Code
When registering a new administrator or staff member, enter the demo authorization key:
```
CAMPUSFIX_ADMIN_2024
```
*(You can customize this key in `frontend/.env` via `VITE_ADMIN_SECURITY_CODE`).*
