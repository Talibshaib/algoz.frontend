"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants/URI";
import axiosInstance, { tryMultipleEndpoints } from "@/lib/axios";

// Define types
export type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken?: string;
  loginTimestamp?: number;
  tokenExpiry?: number;
  avatar?: string;
  coverImage?: string;
  balance?: number;
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
  isTokenExpired: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiration constants
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEFAULT_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user state from sessionStorage if available (more secure than localStorage)
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to clear error messages
  const clearError = () => setError("");

  // Function to check if token is expired
  const isTokenExpired = () => {
    if (!user) return true;
    
    // If we have a tokenExpiry field, use it
    if (user.tokenExpiry) {
      return Date.now() >= user.tokenExpiry - TOKEN_EXPIRY_BUFFER;
    }
    
    // Fallback: Check if token is older than the default expiry time
    if (user.loginTimestamp) {
      return Date.now() >= user.loginTimestamp + DEFAULT_TOKEN_EXPIRY - TOKEN_EXPIRY_BUFFER;
    }
    
    // If we can't determine, assume it's expired to be safe
    return true;
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Always prioritize the user data from sessionStorage
        const savedUser = sessionStorage.getItem("user");
        if (savedUser) {
          try {
            // If we have a user in sessionStorage, check token validity
            const parsedUser = JSON.parse(savedUser);
            
            // Ensure the user object has an accessToken
            if (!parsedUser.accessToken) {
              console.error("No access token found in saved user data");
              sessionStorage.removeItem("user");
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            // Check if token is expired based on our local calculation
            const tokenExpired = isTokenExpired();
            if (tokenExpired) {
              console.log("Token appears to be expired, attempting refresh");
              // Try to refresh the token
              const refreshed = await refreshTokenInternal();
              if (!refreshed) {
                console.log("Token refresh failed, logging out");
                sessionStorage.removeItem("user");
                setUser(null);
                setIsLoading(false);
                return;
              }
            } else {
              // Token is still valid
              setUser(parsedUser);
              setIsLoading(false);
              
              // Perform a background verification without affecting the user experience
              backgroundVerifyToken();
            }
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError);
            sessionStorage.removeItem("user");
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
          if (data.data) {
            // Create a default user object with empty values
            const defaultUser: User = {
              _id: "",
              username: "",
              email: "",
              fullName: "",
              accessToken: "",
            };
            
            // Use the current user data or default values
            const currentUser = user || defaultUser;
            
            const updatedUser = {
              ...data.data,
              accessToken: currentUser.accessToken,
              refreshToken: currentUser.refreshToken,
              loginTimestamp: currentUser.loginTimestamp,
              tokenExpiry: currentUser.tokenExpiry
            };
            setUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("User data refreshed successfully");
          } else {
            console.warn("Token verification succeeded but no user data in response");
          }
        }
      } catch (error: any) {
        // Silently handle errors in background verification
        console.log("Background verification failed, using cached user data");
        
        // If we get a 401/403, the token might be invalid
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("Token appears to be invalid, attempting refresh");
          refreshTokenInternal();
        }
      }
    };
    
    checkAuthStatus();
  }, []);

  // Internal function to refresh the token
  const refreshTokenInternal = async () => {
    try {
      if (!user || !user.refreshToken) {
        console.error("No refresh token available");
        return false;
      }
      
      const response = await axiosInstance.post('/users/refresh-token', {
        refreshToken: user.refreshToken
      });
      
      if (response.status === 200 && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        
        if (accessToken) {
          // Update user with new tokens
          const updatedUser = { 
            ...user, 
            accessToken,
            refreshToken: refreshToken || user.refreshToken,
            loginTimestamp: Date.now(),
            tokenExpiry: Date.now() + DEFAULT_TOKEN_EXPIRY
          };
          
          setUser(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          console.log("Token refreshed successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Public function to refresh the token
  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const result = await refreshTokenInternal();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to login
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
      const response = await axiosInstance.post('/users/login', loginData);
      
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
        
        // Check for user data
        if (!data.data.user) {
          console.error("Missing user data in response:", data.data);
          setError("User data not found in response");
          return false;
        }
        
        // Check for access token
        if (!data.data.accessToken) {
          console.error("Missing access token in response:", data.data);
          setError("Access token not found in response");
          return false;
        }
        
        // Create complete user object with token
        const userData = {
          ...data.data.user,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken, // Store refresh token as well
          loginTimestamp: Date.now(), // Add timestamp for token freshness tracking
          tokenExpiry: Date.now() + DEFAULT_TOKEN_EXPIRY // Calculate token expiry
        };
        
        // Update state and sessionStorage
        setUser(userData);
        
        // Store in sessionStorage with proper error handling
        try {
          sessionStorage.setItem("user", JSON.stringify(userData));
          console.log("Login successful, user data stored in sessionStorage");
        } catch (storageError) {
          console.error("Failed to store user data in sessionStorage:", storageError);
          // Continue anyway since we have the user in state
        }
        
        // Navigate to dashboard
        router.push("/dashboard");
        return true;
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
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

  // Function to signup
  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      setError("");
      
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password || !userData.fullName) {
        setError("All fields are required");
        return false;
      }
      
      // Make signup request
      const response = await axiosInstance.post('/users/register', userData);
      
      // Get response data
      const data = response.data;
      
      // Check for success status
      if (response.status === 200 || response.status === 201) {
        // Navigate to login page on successful signup
        router.push("/login");
        return true;
      } else {
        setError(data.message || "Signup failed");
        return false;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle different error scenarios
      if (error.response) {
        const errorMessage = error.response.data?.message || "Signup failed";
        setError(errorMessage);
      } else if (error.request) {
        setError("No response from server. Please check your internet connection.");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
      
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
      sessionStorage.removeItem("user");

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
      sessionStorage.removeItem("user");
      router.push("/");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an unexpected error, still clear local state
      setUser(null);
      sessionStorage.removeItem("user");
      router.push("/");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      error, 
      clearError, 
      refreshToken,
      isTokenExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
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