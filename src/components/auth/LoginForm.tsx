"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Loader2, User, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

interface LoginFormProps {
  type: "client" | "admin";
  redirectPath: string;
}

export default function LoginForm({ type, redirectPath }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const getIcon = () => {
    switch (type) {
      case "client":
        return <User className="h-6 w-6 text-primary" />;
      case "admin":
        return <Shield className="h-6 w-6 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "client":
        return "Client Login";
      case "admin":
        return "Admin Portal";
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: redirectPath,
      });

      if (result?.error) {
        setLoginError("Failed to sign in with Google. Please try again.");
        setIsLoading(false);
        return;
      }

      // Get the session to check user role
      const session = await getSession();

      if (session?.user) {
        // Check if user has the required role for this login type
        if (type === "admin" && session.user.role !== "admin") {
          setLoginError("Access denied. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        toast({
          title: "Welcome back!",
          description: `Successfully signed in with Google`,
        });

        // Redirect based on user role
        if (session.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border-white/20 bg-slate-900/80 rounded-2xl">
      <div className="space-y-6 p-8 sm:p-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center">{getIcon()}</div>
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          <p className="text-slate-300">
            {type === "admin"
              ? "Sign in with your admin Google account"
              : "Sign in with your Google account"}
          </p>
        </div>

        {loginError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sign In Failed</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full h-12 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-lg transition-colors duration-200 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        {type === "admin" && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Admin Access Only
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Only authorized Gmail accounts can access the admin portal.
                  Contact your administrator if you need access.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-slate-300">
          <p>
            Need help? Contact{" "}
            <a
              href="mailto:support@colortech.co.zw"
              className="font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200"
            >
              Support
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
}
