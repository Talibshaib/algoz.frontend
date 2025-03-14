"use client"

import { Button, Checkbox } from "@nextui-org/react"
import Link from "next/link"
import { Input } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { useRouter } from "next/navigation"
import { MotionDiv } from "@/components/ui/motion"
import { API_URL, getApiUrl } from "@/constants/URI"
import { toast } from "sonner"

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
        // Check if the server is reachable
        const response = await fetch(`${API_URL}/health`, {
          method: 'HEAD',
          cache: 'no-store',
        }).catch(() => null);
        
        if (response && response.ok) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
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
        const adminSuccess = await adminLogin(emailOrUsername, password);
        if (!adminSuccess) {
          setLocalError(adminAuthError || "Invalid admin credentials");
        }
      } else {
        // Regular user login
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
      // Check if the server is reachable
      const response = await fetch(`${API_URL}/health`, {
        method: 'HEAD',
        cache: 'no-store',
      }).catch(() => null);
      
      if (response && response.ok) {
        setServerStatus("online");
        toast.success("Successfully connected to server");
        setLocalError("");
      } else {
        setServerStatus("offline");
        setLocalError("Still unable to connect to the server. The service might be temporarily unavailable.");
      }
    } catch (error) {
      console.error("Server retry failed:", error);
      setServerStatus("offline");
      setLocalError("Still unable to connect to the server. Please try again later.");
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
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm"
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={retryServerConnection}
                disabled={isCheckingServer}
              >
                {isCheckingServer ? "Checking..." : "Retry Connection"}
              </Button>
            </div>
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
            >
              Login as Admin
            </Checkbox>
          </div>
          <Button 
            type="submit" 
            color="primary" 
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || serverStatus === "offline" || isCheckingServer}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full" variant="bordered">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </Button>
          <Button className="w-full" variant="bordered">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}

