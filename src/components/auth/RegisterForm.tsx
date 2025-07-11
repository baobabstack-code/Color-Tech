"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation'; // Changed from react-router-dom
import Link from 'next/link'; // Changed from react-router-dom
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Assuming CardHeader and CardFooter are used, though not in original Home.tsx
import { Icons } from '@/components/ui/icons';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api'; // Will call API directly for now
import { useAuth } from '@/contexts/AuthContext'; // To use login function after registration
import { AxiosError } from 'axios';

// Define the user interface for our application (can be shared or defined in types)
interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface ApiUserResponse {
  id: string;
  email: string;
  role: string;
  full_name?: string;
}

interface AuthResponse {
  token: string;
  user: ApiUserResponse;
  message?: string;
}

// Schema for registration form data
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() { // Renamed component
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Get login function from AuthContext

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Destructure to remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = data;

      const response = await api.post<AuthResponse>('/api/auth/register', {
        ...registerData,
        role: 'client',
      });

      if (response.data.token && response.data.user) {
        await login(registerData.email, data.password);

        toast({
          title: 'Welcome to Color-Tech! 🎉',
          description: 'Your account has been created successfully.',
        });
        router.push('/client/dashboard');
      } else {
        throw new Error("Registration successful, but no token/user received.");
      }

    } catch (error: any) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: err.response?.data?.message || err.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 dark:text-white">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isLoading}
                      className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200 border border-white/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 dark:text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                      disabled={isLoading}
                      className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200 border border-white/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 dark:text-white">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      {...field}
                      disabled={isLoading}
                      className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200 border border-white/40"
                    />
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
                  <FormLabel className="text-slate-800 dark:text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isLoading}
                      className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200 border border-white/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 dark:text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      disabled={isLoading}
                      className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-fuchsia-400 transition-all duration-200 border border-white/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 dark:bg-sky-500 dark:hover:bg-sky-600 shadow-lg transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground dark:text-gray-200">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" disabled={isLoading} className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
            <Icons.gitHub className="mr-2 h-4 w-4 text-slate-800 dark:text-white" />
            Github
          </Button>
          <Button variant="outline" disabled={isLoading} className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
            <Icons.google className="mr-2 h-4 w-4 text-slate-800 dark:text-white" />
            Google
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground dark:text-gray-200">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
