"use client";

import supabase from '@/lib/supabase';
import { toast } from 'sonner';
import { DASHBOARD_ROUTE, LOGIN_ROUTE, ADMIN_ROUTE } from '@/constants/routes';

/**
 * Helper functions for authentication
 * These replace the previous context-based approach with direct Supabase calls
 */

// Get current user and session
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getSession();
  return {
    user: data.session?.user || null,
    session: data.session
  };
};

// Sign out the current user
export const signOut = async (redirectPath = LOGIN_ROUTE) => {
  try {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    
    // Redirect to login page
    window.location.href = redirectPath;
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Check if the current user is an admin
export const checkIsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return !!data?.is_admin;
  } catch (error) {
    console.error("Admin check error:", error);
    return false;
  }
};

// Get admin access token for protected API calls
export const getAdminToken = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (!data.session) {
      return null;
    }
    
    const isAdmin = await checkIsAdmin(data.session.user.id);
    
    if (!isAdmin) {
      return null;
    }
    
    return data.session.access_token;
  } catch (error) {
    console.error("Get admin token error:", error);
    return null;
  }
};

// Custom hook for accessing auth state in components
export const useSupabaseAuth = () => {
  return {
    signOut,
    checkIsAdmin,
    getAdminToken
  };
}; 