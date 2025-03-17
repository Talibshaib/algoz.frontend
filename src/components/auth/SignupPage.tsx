"use client"

import Link from "next/link"
import { Button } from "@nextui-org/react"
import { Input } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { MotionDiv } from "@/components/ui/motion"
import { toast } from "sonner"

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signup, error: authError, clearError, user } = useAuth();
  const router = useRouter();

  // Clear errors when component mounts
  useEffect(() => {
    clearError?.();
    setLocalError("");
  }, [clearError]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isStrongPassword = (password: string) => {
    return password.length >= 8;
  };

  // Handle input validation
  const validateInputs = () => {
    if (!fullName.trim()) {
      setLocalError("Full name is required");
      return false;
    }
    
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email address");
      return false;
    }
    
    if (!username.trim()) {
      setLocalError("Username is required");
      return false;
    }
    
    if (username.length < 3) {
      setLocalError("Username must be at least 3 characters long");
      return false;
    }
    
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    
    if (!isStrongPassword(password)) {
      setLocalError("Password must be at least 8 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    
    if (!acceptTerms) {
      setLocalError("You must accept the terms and conditions");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError?.();
    
    // Validate inputs before submission
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the simplified signup function
      const success = await signup({ 
        fullName, 
        email, 
        username, 
        password 
      });
      
      if (success) {
        toast.success("Account created successfully!");
        router.push("/login?registered=true");
      } else {
        setLocalError(authError || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setLocalError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which error to display (local or from context)
  const displayError = localError || authError;
  
  return (
    <div className="flex h-screen max-w-screen items-center justify-center">
      <div className="mx-auto grid w-full max-w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Enter your information to create an account</p>
        </div>
        
        {displayError && (
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
            <label htmlFor="fullName">Full Name</label>
            <Input 
              id="fullName" 
              type="text" 
              placeholder="John Doe" 
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && !fullName.trim()}
              color={localError && !fullName.trim() ? "danger" : "default"}
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && (!email.trim() || !isValidEmail(email))}
              color={localError && (!email.trim() || !isValidEmail(email)) ? "danger" : "default"}
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            <Input 
              id="username" 
              type="text" 
              placeholder="johndoe" 
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && (!username.trim() || username.length < 3)}
              color={localError && (!username.trim() || username.length < 3) ? "danger" : "default"}
              required 
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && (!password || !isStrongPassword(password))}
              color={localError && (!password || !isStrongPassword(password)) ? "danger" : "default"}
              required 
            />
            {password && !isStrongPassword(password) && (
              <p className="text-xs text-amber-600">Password must be at least 8 characters long</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="confirm-password">Confirm Password</label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && password !== confirmPassword && confirmPassword !== ""}
              color={localError && password !== confirmPassword && confirmPassword !== "" ? "danger" : "default"}
              required 
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-amber-600">Passwords do not match</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              isSelected={acceptTerms} 
              onValueChange={(value) => {
                setAcceptTerms(value);
                if (localError) setLocalError("");
              }}
              isInvalid={!!localError && !acceptTerms}
              color={localError && !acceptTerms ? "danger" : "default"}
            />
            <label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white" 
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
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
          <Button variant="bordered" disabled>
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
          <Button variant="bordered" disabled>
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
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

