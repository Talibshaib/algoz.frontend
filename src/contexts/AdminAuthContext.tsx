"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

// Define types
export type Admin = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
  loginTimestamp?: number;
  tokenExpiry?: number;
} | null;

type AdminAuthContextType = {
  admin: Admin;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string;
  getAdminToken: () => string | null;
  isTokenExpired: () => boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Token expiration constants
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEFAULT_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  
  // Function to check if token is expired
  const isTokenExpired = () => {
    if (!admin) return true;
    
    // If we have a tokenExpiry field, use it
    if (admin.tokenExpiry) {
      return Date.now() >= admin.tokenExpiry - TOKEN_EXPIRY_BUFFER;
    }
    
    // Fallback: Check if token is older than the default expiry time
    if (admin.loginTimestamp) {
      return Date.now() >= admin.loginTimestamp + DEFAULT_TOKEN_EXPIRY - TOKEN_EXPIRY_BUFFER;
    }
    
    // If we can't determine, assume it's expired to be safe
    return true;
  };

  // Check if admin is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAdmin = sessionStorage.getItem("adminUser");
        if (storedAdmin) {
          try {
            const adminData = JSON.parse(storedAdmin);
            
            // Set the token in axios defaults
            if (adminData.accessToken) {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminData.accessToken}`;
            }
            
            // Check if token is expired based on our local calculation
            const tokenExpired = isTokenExpired();
            if (tokenExpired) {
              console.log("Admin token appears to be expired, attempting refresh");
              // Try to refresh the token
              const refreshed = await refreshTokenInternal();
              if (!refreshed) {
                console.log("Admin token refresh failed, logging out");
                sessionStorage.removeItem("adminUser");
                setAdmin(null);
                delete axiosInstance.defaults.headers.common['Authorization'];
                setIsLoading(false);
                return;
              }
            } else {
              // Token is still valid
              // Set admin state first to prevent flicker
              setAdmin(adminData);
              
              // Verify token validity by making a request to the backend
              try {
                const response = await axiosInstance.get('/admin/me');
                
                // If successful, update admin data with latest from server
                if (response.status === 200 && response.data.data) {
                  const updatedAdmin = {
                    ...response.data.data,
                    accessToken: adminData.accessToken, // Keep the token
                    refreshToken: adminData.refreshToken,
                    loginTimestamp: adminData.loginTimestamp,
                    tokenExpiry: adminData.tokenExpiry
                  };
                  setAdmin(updatedAdmin);
                  sessionStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
                }
              } catch (apiError: any) {
                console.error("Admin token validation failed:", apiError);
                // Don't immediately clear - try refresh token first if implemented
                if (apiError?.response?.status === 401 || apiError?.response?.status === 403) {
                  // Try to refresh the token
                  const refreshed = await refreshTokenInternal();
                  if (!refreshed) {
                    sessionStorage.removeItem("adminUser");
                    setAdmin(null);
                    delete axiosInstance.defaults.headers.common['Authorization'];
                  }
                }
              }
            }
          } catch (parseError: any) {
            console.error("Error parsing admin data:", parseError);
            sessionStorage.removeItem("adminUser");
            setAdmin(null);
          }
        }
      } catch (error: any) {
        console.error("Admin auth check error:", error);
        // Only clear admin data if there was a stored admin
        const storedAdmin = sessionStorage.getItem("adminUser");
        if (storedAdmin) {
          sessionStorage.removeItem("adminUser");
          setAdmin(null);
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Internal function to refresh the token
  const refreshTokenInternal = async () => {
    try {
      if (!admin || !admin.refreshToken) {
        console.error("No admin refresh token available");
        return false;
      }
      
      const response = await axiosInstance.post('/admin/refresh-token', {
        refreshToken: admin.refreshToken
      });
      
      if (response.status === 200 && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        
        if (accessToken) {
          // Update admin with new tokens
          const updatedAdmin = { 
            ...admin, 
            accessToken,
            refreshToken: refreshToken || admin.refreshToken,
            loginTimestamp: Date.now(),
            tokenExpiry: Date.now() + DEFAULT_TOKEN_EXPIRY
          };
          
          setAdmin(updatedAdmin);
          sessionStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
          
          // Update axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          console.log("Admin token refreshed successfully");
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error("Admin token refresh failed:", error);
      return false;
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");
      
      // Validate input
      if (!emailOrUsername || !password) {
        setError("Email/username and password are required");
        return false;
      }
      
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes('@');
      
      // Prepare login data
      const loginData = isEmail 
        ? { email: emailOrUsername, password } 
        : { username: emailOrUsername, password };
      
      // Make login request
      const response = await axiosInstance.post('/admin/login', loginData);
      
      // Get response data
      const data = response.data;
      
      // Check for success status
      if (response.status === 200 || response.status === 201) {
        // Validate response data structure
        if (!data.data) {
          console.error("Missing data.data in response:", data);
          setError("Invalid server response format");
          return false;
        }
        
        // Check for admin data
        if (!data.data.admin) {
          console.error("Missing admin data in response:", data.data);
          setError("Admin data not found in response");
          return false;
        }
        
        // Check for access token
        if (!data.data.accessToken) {
          console.error("Missing access token in response:", data.data);
          setError("Access token not found in response");
          return false;
        }
        
        // Create complete admin object with token
        const adminData = {
          ...data.data.admin,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken, // Store refresh token as well
          loginTimestamp: Date.now(), // Add timestamp for token freshness tracking
          tokenExpiry: Date.now() + DEFAULT_TOKEN_EXPIRY // Calculate token expiry
        };
        
        // Update state and sessionStorage
        setAdmin(adminData);
        
        // Set the token in axios defaults
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminData.accessToken}`;
        
        // Store in sessionStorage with proper error handling
        try {
          sessionStorage.setItem("adminUser", JSON.stringify(adminData));
          console.log("Admin login successful, data stored in sessionStorage");
        } catch (storageError) {
          console.error("Failed to store admin data in sessionStorage:", storageError);
          // Continue anyway since we have the admin in state
        }
        
        // Navigate to dashboard
        router.push("/dashboard");
        return true;
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || "Login failed";
        setError(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred during login. Please try again.");
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call the backend API for logout if we have an admin
      if (admin && admin.accessToken) {
        try {
          await axiosInstance.post('/admin/logout', {}, {
            headers: {
              Authorization: `Bearer ${admin.accessToken}`
            }
          });
        } catch (error: any) {
          console.error("Error during API logout:", error);
          // Continue with local logout even if API call fails
        }
      }
      
      // Clear local state and storage
      setAdmin(null);
      sessionStorage.removeItem("adminUser");
      delete axiosInstance.defaults.headers.common['Authorization'];
      router.push("/login");
      return true;
    } catch (error: any) {
      console.error("Admin logout error:", error);
      // Even if there's an error, we should still clear local state
      setAdmin(null);
      sessionStorage.removeItem("adminUser");
      delete axiosInstance.defaults.headers.common['Authorization'];
      router.push("/login");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get admin token for API requests
  const getAdminToken = () => {
    return admin?.accessToken || null;
  };

  return (
    <AdminAuthContext.Provider value={{ 
      admin, 
      login, 
      logout, 
      isLoading, 
      error, 
      getAdminToken,
      isTokenExpired
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}