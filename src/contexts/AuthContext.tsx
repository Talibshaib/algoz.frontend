"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants/URI";
import axiosInstance from "@/lib/axios";

type User = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  avatar?: string;
  coverImage?: string;
  isAdmin?: boolean;
  balance?: number;
  accessToken?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user is logged in on initial load - simplified to prioritize localStorage persistence
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Always prioritize the user data from localStorage
        // This ensures persistent authentication without frequent API checks
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            // If we have a user in localStorage, keep them logged in
            const parsedUser = JSON.parse(savedUser);
            
            // Ensure the user object has an accessToken
            if (!parsedUser.accessToken) {
              console.error("No access token found in saved user data");
              localStorage.removeItem("user");
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            setUser(parsedUser);
            setIsLoading(false);
            
            // Perform a background verification without affecting the user experience
            // This is just to keep the server-side session in sync
            backgroundVerifyToken();
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError);
            localStorage.removeItem("user");
            setUser(null);
            setIsLoading(false);
          }
        } else {
          // No saved user, set loading to false immediately
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false);
      }
    };
    
    // Background verification that doesn't affect user experience
    const backgroundVerifyToken = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await axiosInstance.get('/users/current-user', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 200) {
          // Only update user data if verification succeeds
          const data = response.data;
          if (data.data && data.data.accessToken) {
            // Make sure we preserve the access token
            const updatedUser = {
              ...data.data,
              accessToken: data.data.accessToken
            };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("User data refreshed successfully");
          } else {
            console.warn("Token verification succeeded but no token in response");
          }
        }
        // If verification fails, we keep using the localStorage data
        // Only explicit logout will clear the user session
      } catch (error) {
        // Silently handle errors in background verification
        // This ensures the user experience isn't affected by network issues
        console.log("Background verification failed, using cached user data");
      }
    };
    
    checkAuthStatus();
  }, []);

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.get('/users/refresh-token');
      
      if (response.status === 200 && response.data.data && response.data.data.accessToken) {
        // Update user with new token
        const currentUser = user ? { ...user } : null;
        if (currentUser) {
          currentUser.accessToken = response.data.data.accessToken;
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          console.log("Token refreshed successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real login function that calls the backend API
  const login = async (emailOrUsername: string, password: string) => {
    setError("");
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post('/users/login', { 
        // Send as both email and username, backend will handle which one is provided
        email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
        username: !emailOrUsername.includes("@") ? emailOrUsername : undefined,
        password 
      });
      
      
      const data = response.data;
      console.log("Login response data:", data); // Added console log
      
      if (response.status === 200) {
        // Make sure we have valid user data before setting it
        if (data.data && data.data.user) {
          // Store both user data and tokens
          // Create a userData object that includes the user data and accessToken
          const userData = {
            ...data.data.user,
            accessToken: data.data.accessToken
          };
          
          // Update the user state with the complete userData including accessToken
          setUser(userData);
          
          // Store user data and access token in localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("User data stored in localStorage with token");
          router.push("/dashboard");
          return true;
        } else {
          console.error("Login response missing user data:", data);
          setError("Invalid response from server");
          return false;
        }
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Real signup function that calls the backend API
  const signup = async (fullName: string, email: string, username: string, password: string) => {
    setError("");
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      
      // For FormData, we don't need to set Content-Type as axios will set it automatically
      const response = await axiosInstance.post('/users/register', formData);
      
      const data = response.data;
      
      if (response.status === 200) {
        // Don't set user or store in localStorage after signup
        // Instead, redirect to landing page for explicit login
        router.push("/");
        return true;
      } else {
        setError(data.message || "Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during registration");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear local state before calling the API
      setUser(null);
      localStorage.removeItem("user");

      try {
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await axiosInstance.post('/users/logout', {}, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.status === 200) {
          // Success case - API call worked
          console.log("Logout successful");
        } else {
          // API returned an error
          console.error("Logout API error:", response.data?.message || "Unknown error");
        }
      } catch (apiError) {
        // Network error or timeout - just log it
        console.error("Logout API call failed:", apiError);
      }
      
      // Always clear local state regardless of API response
      setUser(null);
      localStorage.removeItem("user");
      router.push("/");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an unexpected error, still clear local state
      setUser(null);
      localStorage.removeItem("user");
      router.push("/");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to check if we're in a browser environment
export function isBrowser() {
  return typeof window !== 'undefined';
}