"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants/URI";

type User = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  avatar?: string;
  coverImage?: string;
  isAdmin?: boolean;
  balance?: number;
} | null;

type AuthContextType = {
  user: User;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string;
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

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Keep the user logged in from localStorage while we verify with the server
        // This prevents flashing of login page during API verification
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            // If we have a user in localStorage, keep them logged in while we verify
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Don't set isLoading to false yet - we'll do that after API verification
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError);
            localStorage.removeItem("user");
            setUser(null);
          }
        }

        // Always verify the token is still valid by making a request to get current user
        // But don't clear user session if verification fails due to network issues
        try {
          // Set a timeout for the fetch request to prevent long waiting times
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout to 8 seconds
          
          const response = await fetch(`${API_URL}/users/current-user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include", // Important for cookies
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            // Update localStorage with the latest user data
            localStorage.setItem("user", JSON.stringify(data.data));
          } else {
            // Only clear user if API verification fails with an explicit authentication error
            // This prevents accidental logouts due to temporary server issues
            if (savedUser) {
              // Only clear on explicit authentication errors (401/403)
              if (response.status === 401 || response.status === 403) {
                console.warn("Authentication token expired or invalid, clearing session");
                localStorage.removeItem("user");
                setUser(null);
              } else {
                // For other error types (500, 502, etc), keep the user logged in from localStorage
                console.warn(`Server returned ${response.status}, keeping user session active`);
              }
            }
          }
        } catch (error) {
          const apiError = error as Error;
          console.error("API verification error:", apiError);
          // Don't clear user data on any network errors to allow offline access
          // Keep the user logged in from localStorage
          if (apiError && apiError.name === "AbortError") {
            console.log("API request timed out, using cached user data");
            // Keep the user from localStorage for offline access
          } else if (apiError instanceof TypeError || (apiError && apiError.name === "NetworkError")) {
            console.log("Network error detected, keeping user session active");
            // Keep the user logged in during network issues
          }
          // No longer clearing user session for any network-related errors
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Only clear user if there was a saved user and it's not a network error
        const savedUser = localStorage.getItem("user");
        if (savedUser && !(error instanceof TypeError)) {
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        // Ensure isLoading is set to false only after API verification completes
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Real login function that calls the backend API
  const login = async (emailOrUsername: string, password: string) => {
    setError("");
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          // Send as both email and username, backend will handle which one is provided
          email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
          username: !emailOrUsername.includes("@") ? emailOrUsername : undefined,
          password 
        }),
        credentials: "include" // Important for cookies
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Make sure we have valid user data before setting it
        if (data.data && data.data.user) {
          setUser(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
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
      
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        body: formData,
        credentials: "include" // Important for cookies
      });
      
      const data = await response.json();
      
      if (response.ok) {
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
      
      try {
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(`${API_URL}/users/logout`, {
          method: "POST",
          credentials: "include", // Important for cookies
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Success case - API call worked
          console.log("Logout successful");
        } else {
          // API returned an error
          const data = await response.json().catch(() => ({}));
          console.error("Logout API error:", data.message || "Unknown error");
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
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error }}>
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