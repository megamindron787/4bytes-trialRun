import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Ensure Supabase is configured before executing auth operations
 */
function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your frontend/.env file.'
    );
  }
}

/**
 * Register a new Student account in Supabase
 *
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.fullName
 * @param {string} data.rollNo
 * @param {string} data.yearOfStudy
 * @param {string} data.department
 */
export async function registerStudent({
  email,
  password,
  fullName,
  rollNo,
  yearOfStudy,
  department = 'Computer Engineering',
}) {
  ensureSupabaseConfigured();

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();
  const formattedRollNo = rollNo.trim().toUpperCase();

  // 1. Supabase Auth Sign Up with user metadata
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        role: 'student',
        full_name: trimmedName,
        roll_no: formattedRollNo,
        year_of_study: yearOfStudy,
        department,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;
  if (!authUser) {
    throw new Error('Registration failed. No user was returned from Supabase.');
  }

  // 2. Direct Profile upsert guarantee (in case SQL trigger has permission delay)
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          email: normalizedEmail,
          full_name: trimmedName,
          role: 'student',
          roll_no: formattedRollNo,
          year_of_study: yearOfStudy,
          department,
          verified: false,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    return {
      user: {
        id: authUser.id,
        email: normalizedEmail,
        fullName: trimmedName,
        role: 'student',
        rollNo: formattedRollNo,
        yearOfStudy,
        department,
        verified: false,
        ...(profileData || {}),
      },
      session: data.session,
    };
  } catch {
    return {
      user: {
        id: authUser.id,
        email: normalizedEmail,
        fullName: trimmedName,
        role: 'student',
        rollNo: formattedRollNo,
        yearOfStudy,
        department,
        verified: false,
      },
      session: data.session,
    };
  }
}

/**
 * Register a new Admin / Staff account in Supabase
 *
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.fullName
 * @param {string} data.employeeId
 * @param {string} data.department
 * @param {string} data.designation
 * @param {string} [data.securityCode]
 */
export async function registerAdmin({
  email,
  password,
  fullName,
  employeeId,
  department = 'Hostel Administration',
  designation = 'Hostel Warden / Block In-Charge',
  securityCode,
}) {
  ensureSupabaseConfigured();

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();
  const formattedEmployeeId = employeeId.trim().toUpperCase();

  // Validate admin authorization key if set in environment
  const validAdminKey = import.meta.env.VITE_ADMIN_SECURITY_CODE;
  if (validAdminKey && securityCode && securityCode.trim() !== validAdminKey) {
    throw new Error('Invalid Admin Authorization Key. Please verify with campus administration.');
  }

  // 1. Supabase Auth Sign Up
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        role: 'admin',
        full_name: trimmedName,
        employee_id: formattedEmployeeId,
        department,
        designation,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;
  if (!authUser) {
    throw new Error('Admin registration failed. No user was returned from Supabase.');
  }

  // 2. Direct Profile upsert guarantee
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          email: normalizedEmail,
          full_name: trimmedName,
          role: 'admin',
          employee_id: formattedEmployeeId,
          department,
          designation,
          verified: true,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    return {
      user: {
        id: authUser.id,
        email: normalizedEmail,
        fullName: trimmedName,
        role: 'admin',
        employeeId: formattedEmployeeId,
        department,
        designation,
        verified: true,
        ...(profileData || {}),
      },
      session: data.session,
    };
  } catch {
    return {
      user: {
        id: authUser.id,
        email: normalizedEmail,
        fullName: trimmedName,
        role: 'admin',
        employeeId: formattedEmployeeId,
        department,
        designation,
        verified: true,
      },
      session: data.session,
    };
  }
}

/**
 * Universal Login for Students and Admins via Supabase
 *
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @param {'student' | 'admin' | null} [credentials.expectedRole]
 */
export async function loginUser({ email, password, expectedRole }) {
  ensureSupabaseConfigured();

  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;
  if (!authUser) {
    throw new Error('Sign in failed. No user returned.');
  }

  // Retrieve full profile from Supabase profiles table
  let profile = null;
  const { data: dbProfile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (!profileErr && dbProfile) {
    profile = dbProfile;
  }

  const role = profile?.role || authUser.user_metadata?.role || (expectedRole || 'student');

  // Guard against portal mismatch (student logging into admin portal or vice versa)
  if (expectedRole && role !== expectedRole && !(expectedRole === 'admin' && role === 'staff')) {
    await supabase.auth.signOut();
    throw new Error(
      `This account is registered as a ${role.toUpperCase()}. Please use the ${role === 'admin' ? 'Admin / Staff' : 'Student'} login tab.`
    );
  }

  const resolvedUser = {
    id: authUser.id,
    email: authUser.email,
    fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.fullName || 'User',
    role,
    rollNo: profile?.roll_no || authUser.user_metadata?.roll_no,
    yearOfStudy: profile?.year_of_study || authUser.user_metadata?.year_of_study,
    employeeId: profile?.employee_id || authUser.user_metadata?.employee_id,
    department: profile?.department || authUser.user_metadata?.department || 'General',
    designation: profile?.designation || authUser.user_metadata?.designation,
    verified: profile?.verified ?? true,
  };

  return {
    user: resolvedUser,
    session: data.session,
  };
}

/**
 * Sign out current user from Supabase
 */
export async function logoutUser() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
}

/**
 * Fetch profile for a specific user ID
 */
export async function fetchUserProfile(userId) {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching profile from Supabase:', error.message);
    return null;
  }
  return data;
}
