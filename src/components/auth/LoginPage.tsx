"use client"

import { Button, Checkbox } from "@nextui-org/react"
import Link from "next/link"
import { Input } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { useRouter } from "next/navigation"
import { MotionDiv } from "@/components/ui/motion"
import { API_URL } from "@/constants/URI"

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingServer, setIsCheckingServer] = useState(false);
  const [serverStatus, setServerStatus] = useState<"unknown" | "online" | "offline">("unknown");
  const { login, error: authError, clearError, user } = useAuth();
  const { login: adminLogin, error: adminAuthError, admin } = useAdminAuth();
  const router = useRouter();
  
  // Clear errors when component mounts or when switching between admin/user login
  useEffect(() => {
    clearError?.();
    setLocalError("");
  }, [isAdminLogin, clearError]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else if (admin) {
      router.replace("/admin");
    }
  }, [user, admin, router]);

  // Check server status on component mount
  useEffect(() => {
    const checkServerStatus = async () => {
      setIsCheckingServer(true);
      try {
        // Extract the base URL from the API_URL
        const baseUrl = API_URL.split('/api')[0];
        
        // Use fetch with a timeout to check if the server is reachable
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${baseUrl}/health`, {
          method: 'GET',
          mode: 'no-cors', // This allows us to at least check if the server responds
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setServerStatus("online");
      } catch (error) {
        console.error("Server status check failed:", error);
        setServerStatus("offline");
      } finally {
        setIsCheckingServer(false);
      }
    };
    
    checkServerStatus();
  }, []);
  
  // Handle input validation
  const validateInputs = () => {
    if (!emailOrUsername.trim()) {
      setLocalError("Email or username is required");
      return false;
    }
    
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError?.();
    
    // Check server status first
    if (serverStatus === "offline") {
      setLocalError("The server appears to be offline. Please try again later.");
      return;
    }
    
    // Validate inputs before submission
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isAdminLogin) {
        // Admin login
        console.log("Attempting admin login with:", emailOrUsername);
        const adminSuccess = await adminLogin(emailOrUsername, password);
        if (!adminSuccess) {
          setLocalError(adminAuthError || "Invalid admin credentials");
        }
      } else {
        // Regular user login
        console.log("Attempting user login with:", emailOrUsername);
        const success = await login(emailOrUsername, password);
        if (!success) {
          setLocalError(authError || "Invalid username/email or password");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle network errors specifically
      if (err.code === "ERR_NETWORK" || err.code === "ERR_NAME_NOT_RESOLVED") {
        setLocalError("Unable to connect to the server. Please check your internet connection and try again.");
        setServerStatus("offline");
      } else if (err.userFriendlyMessage) {
        // Use the user-friendly message if available
        setLocalError(err.userFriendlyMessage);
      } else {
        setLocalError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine which error to display (local or from context)
  const displayError = localError || (isAdminLogin ? adminAuthError : authError);
  
  // Function to retry server connection
  const retryServerConnection = async () => {
    setIsCheckingServer(true);
    setLocalError("");
    
    try {
      // Extract the base URL from the API_URL
      const baseUrl = API_URL.split('/api')[0];
      
      // Use fetch with a timeout to check if the server is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(`${baseUrl}/health`, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setServerStatus("online");
      setLocalError("");
    } catch (error) {
      console.error("Server retry failed:", error);
      setServerStatus("offline");
      setLocalError("Still unable to connect to the server. The service might be temporarily unavailable.");
    } finally {
      setIsCheckingServer(false);
    }
  };
  
  return (
    <div className="flex h-screen max-w-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        {serverStatus === "offline" && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 text-sm bg-amber-100 border border-amber-200 text-amber-800 rounded-md"
          >
            <p className="font-medium mb-2">Server Connection Issue</p>
            <p className="mb-3">We're having trouble connecting to our servers. This could be due to:</p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>Temporary server maintenance</li>
              <li>Network connectivity issues</li>
              <li>DNS resolution problems</li>
            </ul>
            <Button 
              size="sm"
              className="bg-amber-600 text-white hover:bg-amber-700 mt-2"
              onClick={retryServerConnection}
              disabled={isCheckingServer}
            >
              {isCheckingServer ? "Checking..." : "Retry Connection"}
            </Button>
          </MotionDiv>
        )}
        
        {displayError && serverStatus !== "offline" && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md"
          >
            {displayError}
          </MotionDiv>
        )}
        
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <Input 
              id="emailOrUsername" 
              type="text" 
              placeholder="name@example.com or username" 
              value={emailOrUsername}
              onChange={(e) => {
                setEmailOrUsername(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && !emailOrUsername.trim()}
              color={localError && !emailOrUsername.trim() ? "danger" : "default"}
              required 
              disabled={serverStatus === "offline" || isCheckingServer}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && !password}
              color={localError && !password ? "danger" : "default"}
              required 
              disabled={serverStatus === "offline" || isCheckingServer}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="adminLogin" 
              isSelected={isAdminLogin}
              onValueChange={setIsAdminLogin}
              disabled={serverStatus === "offline" || isCheckingServer}
            />
            <label htmlFor="adminLogin" className="text-sm font-normal">
              Login as Admin
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              disabled={serverStatus === "offline" || isCheckingServer}
            />
            <label htmlFor="remember" className="text-sm font-normal">
              Remember me for 30 days
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={isLoading || serverStatus === "offline" || isCheckingServer}
          >
            {isLoading ? "Logging in..." : isCheckingServer ? "Checking server..." : isAdminLogin ? "Login as Admin" : "Login"}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="bordered"
            disabled={serverStatus === "offline" || isCheckingServer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </Button>
          <Button 
            variant="bordered"
            disabled={serverStatus === "offline" || isCheckingServer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            Facebook
          </Button>
        </div>
        
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

