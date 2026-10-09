import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session: Listen to Supabase auth or restore cached Supabase session
  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          // 1. Get current active Supabase session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            await syncSupabaseUser(session.user, session.access_token);
          } else {
            restoreLocalSession();
          }

          // 2. Listen to live Supabase auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                if (newSession?.user) {
                  await syncSupabaseUser(newSession.user, newSession.access_token);
                }
              } else if (event === 'SIGNED_OUT') {
                clearSession();
              }
            }
          );
          subscription = authListener.subscription;
        } else {
          restoreLocalSession();
        }
      } catch (err) {
        console.error('Failed to initialize authentication session', err);
        restoreLocalSession();
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const syncSupabaseUser = async (authUser, accessToken) => {
    try {
      // Fetch profile from Supabase database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      const role = profile?.role || authUser.user_metadata?.role || 'student';
      const userData = {
        id: authUser.id,
        email: authUser.email,
        fullName: profile?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.fullName || 'User',
        role,
        rollNo: profile?.roll_no || authUser.user_metadata?.roll_no,
        yearOfStudy: profile?.year_of_study || authUser.user_metadata?.year_of_study,
        employeeId: profile?.employee_id || authUser.user_metadata?.employee_id,
        department: profile?.department || authUser.user_metadata?.department || 'General',
        designation: profile?.designation || authUser.user_metadata?.designation,
        verified: profile?.verified ?? false,
      };

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('campusfix_currentUser', JSON.stringify(userData));
      localStorage.setItem(
        'campusfix_auth',
        JSON.stringify({ token: accessToken, user: userData, loginAt: new Date().toISOString() })
      );
    } catch (err) {
      console.warn('Error syncing profile with Supabase', err);
    }
  };

  const restoreLocalSession = () => {
    try {
      const storedAuth = localStorage.getItem('campusfix_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed.token && parsed.user) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch (e) {
      console.error('Error restoring local session', e);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('campusfix_auth');
    localStorage.removeItem('campusfix_currentUser');
    setUser(null);
    setToken(null);
  };

  const login = (userData, authToken = null) => {
    const session = {
      token: authToken,
      user: userData,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem('campusfix_auth', JSON.stringify(session));
    localStorage.setItem('campusfix_currentUser', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error', err);
      }
    }
    clearSession();
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    role: user?.role || null,
    loading,
    isSupabaseConfigured,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
