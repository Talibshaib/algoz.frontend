"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL, getApiUrl } from "@/constants/URI";
import axiosInstance from "@/lib/axios";
import { shouldAllowApiCall, getTimeUntilNextAllowedCall } from "@/utils/rateLimiter";

// Define types
export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  accessToken: string;
  avatar?: string;
  coverImage?: string;
  isAdmin?: boolean;
  permissions?: string[];
} | null;

type AuthContextType = {
  user: User;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to clear error messages
  const clearError = () => setError("");

  // Login function
  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    
    // Check client-side rate limiting
    const loginKey = `login_${emailOrUsername}`;
    if (!shouldAllowApiCall(loginKey)) {
      const waitTime = Math.ceil(getTimeUntilNextAllowedCall(loginKey) / 1000);
      setError(`Too many login attempts. Please try again in ${waitTime} seconds.`);
      setIsLoading(false);
      return false;
    }
    
    try {
      console.log("Attempting login with:", emailOrUsername);
      
      // Use direct API endpoint
      const response = await axiosInstance.post(`/api/v1/auth/login`, {
        [emailOrUsername.includes('@') ? 'email' : 'username']: emailOrUsername,
        password
      });
      
      console.log("Login response:", response.status);
      const { data } = response;
      
      if (data.success) {
        console.log("Login successful");
        // Save user data to localStorage
        const userData = {
          _id: data.data.user._id,
          username: data.data.user.username,
          email: data.data.user.email,
          fullName: data.data.user.fullName,
          accessToken: data.data.accessToken,
          avatar: data.data.user.avatar,
          coverImage: data.data.user.coverImage,
          isAdmin: data.data.user.isAdmin,
          permissions: data.data.user.permissions
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        console.error("Login failed:", data.message);
        setError(data.message || "Login failed");
        return false;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
        return false;
      }
      
      // Handle other errors
      console.error("Response data:", err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("username", userData.username);
      formData.append("password", userData.password);
      
      // Add avatar if provided
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }
      
      // Add cover image if provided
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage);
      }
      
      const response = await axiosInstance.post(
        `/api/v1/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      const { data } = response;
      
      if (data.success) {
        return true;
      } else {
        setError(data.message || "Registration failed");
        return false;
      }
    } catch (err: any) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        setError("Too many registration attempts. Please try again later.");
        return false;
      }
      
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (user) {
        await axiosInstance.post(`/api/v1/auth/logout`);
      }
      
      // Clear user data from localStorage
      localStorage.removeItem("user");
      setUser(null);
      
      // Redirect to login page
      router.push("/login");
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      
      // Even if API call fails, clear local data
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh the access token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.post(`/api/v1/auth/refresh-token`);
      
      if (response.data.success && user) {
        // Update user data with new tokens
        const userData = {
          ...user,
          accessToken: response.data.data.accessToken
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      
      return false;
    } catch (err: any) {
      // Handle rate limiting specifically
      if (err.response?.status === 429) {
        console.error("Token refresh rate limited. Will try again later.");
        // Wait before retrying
        return false;
      }
      
      console.error("Token refresh error:", err);
      return false;
    }
  };

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const refreshed = await refreshToken();
            
            if (refreshed && user) {
              // Update the authorization header
              originalRequest.headers.Authorization = `Bearer ${user.accessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // If refresh failed, logout
            await logout();
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Clean up interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [user]);

  // Set authorization header for all requests when user is logged in
  useEffect(() => {
    if (user && user.accessToken) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        error,
        clearError,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Helper function to check if we're in a browser environment
export function isBrowser() {
  return typeof window !== 'undefined';
}