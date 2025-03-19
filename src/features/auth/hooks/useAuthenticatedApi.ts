"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import supabase from '@/lib/supabase';
import { LOGIN_ROUTE } from '@/constants/routes';

/**
 * A simple hook for making authenticated API calls
 * This replaces the previous useAxiosAuth hook
 */
export const useAuthenticatedApi = () => {
  const [token, setToken] = useState<string | null>(null);
  const [axiosInstance] = useState(() => {
    const instance = axios.create({
      baseURL: '/api', // API base URL
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Add a request interceptor
    instance.interceptors.request.use(
      async (config) => {
        // Try to get the session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session, add the token to the request
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Add a response interceptor
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is a 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the session
            const { data: { session } } = await supabase.auth.getSession();
            
            // If we have a session, retry the request
            if (session?.access_token) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
              return instance(originalRequest);
            } else {
              // No session, redirect to login
              window.location.href = LOGIN_ROUTE;
            }
          } catch (refreshError) {
            console.error('Session refresh failed:', refreshError);
            // Redirect to login
            window.location.href = LOGIN_ROUTE;
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return instance;
  });
  
  // Get the token on mount and update when it changes
  useEffect(() => {
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setToken(session?.access_token || null);
    };
    
    getToken();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      setToken(session?.access_token || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return {
    axiosInstance,
    token,
  };
}; 