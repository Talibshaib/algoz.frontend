"use client"

import Link from "next/link"
import { Button } from "@nextui-org/react"
import { Input } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react"
import { useState } from "react"
import { MotionDiv } from "@/components/ui/motion"
import { toast } from "sonner"
import supabase from "@/lib/supabase"
import { DASHBOARD_ROUTE, LOGIN_ROUTE, TERMS_ROUTE, PRIVACY_ROUTE } from "@/constants/routes"

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const isStrongPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle signup success
  const handleSignupSuccess = (hasSession: boolean) => {
    if (hasSession) {
      toast.success("Account created successfully! Redirecting to dashboard...");
      // Redirect to dashboard
      window.location.href = DASHBOARD_ROUTE;
    } else {
      toast.success("Account created successfully!");
      toast.info(
        "Please check your email for a confirmation link. You'll need to verify your email before logging in.",
        { duration: 10000 }
      );
      
      // Clear the form
      setFullName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate full name
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    
    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Validate username
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
    
    // Validate password
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)");
      return;
    }
    
    // Confirm passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Check terms acceptance
    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register with Supabase directly
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: fullName,
            avatar_url: ''
          }
        }
      });
      
      if (signupError) {
        throw signupError;
      }
      
      if (data) {
        // Check if email confirmation is required
        handleSignupSuccess(!!data.session);
      } else {
        throw new Error("Signup failed");
      }
    } catch (err: any) {
      console.error("Signup error:", err.message);
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen max-w-screen-md items-center justify-center">
      <div className="mx-auto grid max-w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Enter your information to create an account</p>
        </div>
        
        {error && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md"
          >
            {error}
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
                if (error) setError("");
              }}
              isInvalid={!!error && !fullName.trim()}
              color={error && !fullName.trim() ? "danger" : "default"}
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
                if (error) setError("");
              }}
              isInvalid={!!error && (!email.trim() || !isValidEmail(email))}
              color={error && (!email.trim() || !isValidEmail(email)) ? "danger" : "default"}
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
                if (error) setError("");
              }}
              isInvalid={!!error && (!username.trim() || username.length < 3)}
              color={error && (!username.trim() || username.length < 3) ? "danger" : "default"}
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
                if (error) setError("");
              }}
              isInvalid={!!error && (!password || !isStrongPassword(password))}
              color={error && (!password || !isStrongPassword(password)) ? "danger" : "default"}
              required 
            />
            {password && !isStrongPassword(password) && (
              <div className="text-xs text-muted-foreground mt-1">
                Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).
              </div>
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
                if (error) setError("");
              }}
              isInvalid={!!error && password !== confirmPassword && confirmPassword !== ""}
              color={error && password !== confirmPassword && confirmPassword !== "" ? "danger" : "default"}
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
                if (error) setError("");
              }}
              isInvalid={!!error && !acceptTerms}
              color={error && !acceptTerms ? "danger" : "default"}
            />
            <label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <Link href={TERMS_ROUTE} className="text-primary underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={PRIVACY_ROUTE} className="text-primary underline-offset-4 hover:underline">
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
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
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
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
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
            <span>GitHub</span>
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
            <span>Facebook</span>
          </Button>
        </div>
        
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href={LOGIN_ROUTE} className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

