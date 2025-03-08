"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

type Admin = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  accessToken?: string;
} | null;

type AdminAuthContextType = {
  admin: Admin;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string;
  getAdminToken: () => string | null;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  

  // Check if admin is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
          try {
            const adminData = JSON.parse(storedAdmin);
            
            // Set the token in axios defaults
            if (adminData.accessToken) {
              axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${adminData.accessToken}`;
            }
            
            // Set admin state first to prevent flicker
            setAdmin(adminData);
            
            // Verify token validity by making a request to the backend
            try {
              const response = await axiosInstance.get('/admin/me');
              
              // If successful, update admin data with latest from server
              if (response.status === 200 && response.data.data) {
                const updatedAdmin = {
                  ...response.data.data,
                  accessToken: adminData.accessToken // Keep the token
                };
                setAdmin(updatedAdmin);
                localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
              }
            } catch (apiError: any) {
              console.error("Admin token validation failed:", apiError);
              // Don't immediately clear - try refresh token first if implemented
              // For now, we'll clear on 401/403 errors only
              if (apiError?.response?.status === 401 || apiError?.response?.status === 403) {
                localStorage.removeItem("adminUser");
                setAdmin(null);
                delete axiosInstance.defaults.headers.common['Authorization'];
              }
            }
          } catch (parseError: any) {
            console.error("Error parsing admin data:", parseError);
            localStorage.removeItem("adminUser");
            setAdmin(null);
          }
        }
      } catch (error: any) {
        console.error("Admin auth check error:", error);
        // Only clear admin data if there was a stored admin
        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
          localStorage.removeItem("adminUser");
          setAdmin(null);
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Admin login function
  const login = async (emailOrUsername: string, password: string) => {
    setError("");
    try {
      setIsLoading(true);
      
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes('@');
      
      // Call the backend API for admin login
      const response = await axiosInstance.post('/admin/login', {
        email: isEmail ? emailOrUsername : undefined,
        username: !isEmail ? emailOrUsername : undefined,
        password
      });
      
      if (response.status === 200 && response.data.data) {
        // Extract admin data and tokens from response
        const { admin: adminData, accessToken, refreshToken } = response.data.data;
        
        // Create admin object with token
        const adminWithToken = {
          ...adminData,
          accessToken
        };
        
        console.log("Admin login successful, storing data:", { 
          adminId: adminWithToken._id,
          hasToken: !!accessToken
        });
        
        // Update state and localStorage
        setAdmin(adminWithToken);
        localStorage.setItem("adminUser", JSON.stringify(adminWithToken));
        
        // Set the token in axios defaults for future requests
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Redirect to admin dashboard
        router.push("/admin");
        return true;
      } else {
        setError(response.data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError(error?.response?.data?.message || "An error occurred during login");
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
      localStorage.removeItem("adminUser");
      router.push("/login");
      return true;
    } catch (error: any) {
      console.error("Admin logout error:", error);
      // Even if there's an error, we should still clear local state
      setAdmin(null);
      localStorage.removeItem("adminUser");
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
    <AdminAuthContext.Provider value={{ admin, login, logout, isLoading, error, getAdminToken }}>
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