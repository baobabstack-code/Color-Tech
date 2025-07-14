import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, EyeOff, Mail, Lock, 
  Loader2, User, Shield, Briefcase, AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LoginFormProps {
  type: 'client' | 'admin';
  redirectPath: string;
}

const getLoginSchema = (type: 'client' | 'admin') => {
  const baseSchema = {
    password: z.string().min(1, "Password is required"),
  };

  return z.object({
    email: z.string().email("Please enter a valid email"),
    ...baseSchema,
  });
};

export default function LoginForm({ type, redirectPath }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<ReturnType<typeof getLoginSchema>>>({
    resolver: zodResolver(getLoginSchema(type)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getIcon = () => {
    switch (type) {
      case 'client':
        return <User className="h-6 w-6 text-primary" />;
      case 'admin':
        return <Shield className="h-6 w-6 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'client':
        return 'Client Login';
      case 'admin':
        return 'Admin Portal';
    }
  };

  const onSubmit = async (values: z.infer<ReturnType<typeof getLoginSchema>>) => {
    setLoginError(null);
    try {
      await login(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      router.push(redirectPath);
    } catch (error: any) {
      const errorMessage = error.message ||
                           "Login failed. Please check your credentials and try again.";
      setLoginError(errorMessage);
    }
  };

  return (
    <Card className="w-full shadow-2xl border-white/20 bg-slate-900/80 rounded-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 sm:p-10">
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-slate-100">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 h-12 text-base bg-slate-800/80 border-slate-600 dark:text-white dark:placeholder-slate-300"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-slate-100">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 h-12 text-base bg-slate-800/80 border-slate-600 dark:text-white dark:placeholder-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-300 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-slate-500 dark:bg-slate-700"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-slate-200">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-primary text-white hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-600 shadow-lg transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-slate-200">
            <p>
              Need help? Contact{" "}
              <a href="mailto:support@colortech.com" className="font-medium text-primary hover:text-primary/80 dark:text-sky-300 dark:hover:text-sky-200">
                Support
              </a>
            </p>
          </div>
        </form>
      </Form>
    </Card>
  );
}