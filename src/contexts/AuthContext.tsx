"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants/URI";
import axiosInstance, { tryMultipleEndpoints } from "@/lib/axios";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Function to clear error messages
  const clearError = () => setError("");

  // Check if user is logged in on initial load
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

  // Login function with improved error handling
  const login = async (emailOrUsername: string, password: string) => {
    clearError();
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!emailOrUsername || !password) {
        setError("Email/username and password are required");
        return false;
      }
      
      // Determine if input is email or username
      const isEmail = emailOrUsername.includes("@");
      
      // Prepare login payload
      const loginData = {
        email: isEmail ? emailOrUsername : undefined,
        username: !isEmail ? emailOrUsername : undefined,
        password
      };
      
      console.log("Attempting login with:", { 
        ...(isEmail ? { email: emailOrUsername } : { username: emailOrUsername }),
        password: "********" 
      });
      
      // Use the tryMultipleEndpoints function to attempt login on multiple endpoints
      const response = await tryMultipleEndpoints(async (instance) => {
        return await instance.post('/users/login', loginData);
      });
      
      console.log("Login response status:", response.status);
      
      // Check if response has data
      if (!response.data) {
        console.error("No data in login response");
        setError("Server returned an empty response");
        return false;
      }
      
      const data = response.data;
      console.log("Login response data structure:", Object.keys(data));
      
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
          accessToken: data.data.accessToken
        };
        
        // Update state and localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("Login successful, user data stored");
        
        // Navigate to dashboard
        router.push("/dashboard");
        return true;
      } else {
        setError(data.message || "Login failed");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.userFriendlyMessage || error?.response?.data?.message || "Failed to connect to the server. Please check your internet connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with improved error handling
  const signup = async (fullName: string, email: string, username: string, password: string) => {
    clearError();
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!fullName || !email || !username || !password) {
        setError("All fields are required");
        return false;
      }
      
      console.log("Attempting signup with:", { fullName, email, username, password: "********" });
      
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      
      // For FormData, we don't need to set Content-Type as axios will set it automatically
      const response = await axiosInstance.post('/users/register', formData);
      
      console.log("Signup response status:", response.status);
      
      if (!response.data) {
        console.error("No data in signup response");
        setError("Server returned an empty response");
        return false;
      }
      
      const data = response.data;
      console.log("Signup response data:", data);
      
      if (response.status === 200 || response.status === 201) {
        // Redirect to login page after successful signup
        router.push("/login");
        return true;
      } else {
        const errorMessage = data.message || "Registration failed with status " + response.status;
        console.error("Signup failed:", errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Extract error message from response if available
      let errorMessage = "An error occurred during registration";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = "Email or username already exists";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error, please try again later";
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage = "No response from server, please check your connection";
      } else {
        console.error("Error message:", error.message);
        errorMessage = error.message || "Request failed";
      }
      
      setError(errorMessage);
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
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      error, 
      clearError, 
      refreshToken 
    }}>
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