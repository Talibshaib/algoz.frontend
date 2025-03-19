"use client"

import { Button, Checkbox } from "@nextui-org/react"
import Link from "next/link"
import { Input } from "@nextui-org/react"
import { useState } from "react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { MotionDiv } from "@/components/ui/motion"
import {
  DASHBOARD_ROUTE,
  ADMIN_ROUTE,
  SIGNUP_ROUTE,
  FORGOT_PASSWORD_ROUTE
} from "@/constants/routes"
import supabase from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || DASHBOARD_ROUTE;

  // Simple email validation
  const isValidEmail = (email: string) => {
    return email.includes('@');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Supabase directly
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) {
        throw loginError;
      }

      if (data?.session) {
        // Check if admin login is required
        if (isAdminLogin) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', data.session.user.id)
            .single();

          if (userError || !userData?.is_admin) {
            await supabase.auth.signOut();
            throw new Error("Unauthorized: Admin access required");
          }

          // Admin login successful
          toast.success("Admin login successful!");

          // Redirect to admin page
          window.location.href = ADMIN_ROUTE;
          return;
        }

        // Regular login successful
        toast.success("Login successful!");

        // Redirect to the intended destination
        window.location.href = redirectTo;
      }
    } catch (error: any) {
      console.error("Login error:", error.message);

      if (error.message?.toLowerCase().includes("invalid login")) {
        setError("Invalid email or password");
      } else if (error.message?.toLowerCase().includes("email not confirmed")) {
        setError("Please verify your email before logging in");
        toast.error("Please check your inbox and verify your email", { duration: 5000 });
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-w-screen-md items-center justify-center">
      <div className="mx-auto grid max-w-[400px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
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
            <label htmlFor="email">Email Address</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              isInvalid={!!error && !email.trim()}
              color={error && !email.trim() ? "danger" : "default"}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <Link href={FORGOT_PASSWORD_ROUTE} className="text-sm text-primary underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              isInvalid={!!error && !password}
              color={error && !password ? "danger" : "default"}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              isDisabled  //temporary
              id="adminLogin"
              isSelected={isAdminLogin}
              onValueChange={setIsAdminLogin}
            >
              Login as Admin
            </Checkbox>
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white"
            isLoading={isLoading}
          >
            <span>{isLoading ? "Logging in..." : "Login"}</span>
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href={SIGNUP_ROUTE} className="text-primary underline-offset-4 hover:underline">
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
          <Button className="w-full" variant="bordered" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </Button>
          <Button className="w-full" variant="bordered" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg>
            <span>Facebook</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

