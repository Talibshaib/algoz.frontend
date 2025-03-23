"use client";

import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { DASHBOARD_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE } from '@/constants/routes';
import { Database } from '@/types/supabase';

// Create a Supabase client for browser usage
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Helper functions for authentication
 * These replace the previous context-based approach with direct Supabase calls
 */

// Get current user and session
export const getCurrentUser = async () => {
  // Use let instead of const for token-related variables to support refreshing
  let { data } = await supabase.auth.getSession();
  return {
    user: data.session?.user || null,
    session: data.session
  };
};

// Refresh the authentication token
export const refreshToken = async () => {
  try {
    console.log('Refreshing authentication token...');
    
    // Create a new direct Supabase client for token refresh
    // This ensures we bypass any stale client instances
    const freshSupabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Use let instead of const for token-related variables to support refreshing
    let { data, error } = await freshSupabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing token:', error);
      
      // Try to get the current session as a fallback
      const { data: sessionData, error: sessionError } = await freshSupabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('No valid session found:', sessionError);
        toast.error('Session expired. Please log in again.');
        // Redirect to login after a short delay to allow the toast to be seen
        setTimeout(() => {
          window.location.href = LOGIN_ROUTE;
        }, 2000);
        throw error;
      }
      
      // If we have a session, try to use it even if refresh failed
      console.log('Using existing session instead of refreshing token');
      return sessionData.session;
    }
    
    console.log('Token refreshed successfully');
    return data.session;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async (redirectPath = LOGIN_ROUTE) => {
  try {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    
    // Redirect to login page
    window.location.href = redirectPath;
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Error signing out');
  }
};

// Check if the current user is an admin
export const checkIsAdmin = async (userId: string | undefined) => {
  if (!userId) return false;
  
  try {
    // Use let instead of const for token-related variables to support refreshing
    let { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data.is_admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get admin access token for protected API calls
export const getAdminToken = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('No active session');
    }
    
    const userId = sessionData.session.user.id;
    const isAdmin = await checkIsAdmin(userId);
    
    if (!isAdmin) {
      throw new Error('User is not an admin');
    }
    
    return sessionData.session.access_token;
  } catch (error) {
    console.error('Error getting admin token:', error);
    // Redirect to login page after a short delay
    toast.error('Admin privileges required');
    setTimeout(() => {
      window.location.href = LOGIN_ROUTE;
    }, 2000);
    return null;
  }
};

// Custom hook for accessing auth state in components
export const useSupabaseAuth = () => {
  return { supabase };
};