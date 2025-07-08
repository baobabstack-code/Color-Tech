"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import type { RegisterFormData, AuthResponse } from '@/lib/types/auth';
import { AxiosError } from 'axios';
import { useRouter } from "next/navigation";
import Link from "next/link";

// Login Form Schema
const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Register Form Schema
const registerFormInputSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login Form Component
const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    try {
      // Placeholder authentication logic
      const isAuthenticated = await authenticateUser(values.email, values.password);

      if (isAuthenticated) {
        localStorage.setItem('token', 'dummy_token');
        if (values.email === 'admin@example.com') {
          router.push('/admin/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid credentials. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const authenticateUser = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded credentials for demonstration purposes
    if (email === 'test@example.com' && password === 'password') {
      return true; // Simulate customer login
    } else if (email === 'admin@example.com' && password === 'password') {
      return true; // Simulate admin login
    } else {
      return false;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800 dark:text-gray-200">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} className="bg-white/80 dark:bg-slate-800/80" />
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
              <FormLabel className="text-slate-800 dark:text-gray-200">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} className="bg-white/80 dark:bg-slate-800/80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </Button>
      </form>
    </Form>
  );
};

// Register Form Component
const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerFormInputSchema>>({
    resolver: zodResolver(registerFormInputSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerFormInputSchema>) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...formInputData } = data;
      const registerData: RegisterFormData = {
        ...formInputData,
        role: 'client',
      };
      const response = await api.post<AuthResponse>('/users/register', registerData);
      
      localStorage.setItem('token', response.data.token);
      
      toast({
        title: 'Welcome to Color-Tech! 🎉',
        description: 'Your account has been created successfully.',
      });

      router.push('/client/dashboard');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-800 dark:text-gray-200">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="bg-white/80 dark:bg-slate-800/80" />
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
              <FormLabel className="text-slate-800 dark:text-gray-200">Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} className="bg-white/80 dark:bg-slate-800/80" />
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
              <FormLabel className="text-slate-800 dark:text-gray-200">Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} className="bg-white/80 dark:bg-slate-800/80" />
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
              <FormLabel className="text-slate-800 dark:text-gray-200">Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="bg-white/80 dark:bg-slate-800/80" />
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
              <FormLabel className="text-slate-800 dark:text-gray-200">Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="bg-white/80 dark:bg-slate-800/80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center">
            <Icons.logo className="h-8 w-8 text-primary dark:text-white" />
            <h1 className="ml-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Color-Tech
            </h1>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-200">
            Your trusted partner in vehicle transformation
          </p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-800 dark:data-[state=inactive]:text-gray-200 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-800 dark:data-[state=inactive]:text-gray-200 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-200">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <Card className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30">
              <CardContent className="pt-6">
                <LoginForm />
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
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <Icons.gitHub className="mr-2 h-4 w-4 text-slate-800 dark:text-white" />
                    Github
                  </Button>
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <Icons.google className="mr-2 h-4 w-4 text-slate-800 dark:text-white" />
                    Google
                  </Button>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground dark:text-gray-200">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <Card className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl border border-white/30">
              <CardContent className="pt-6">
                <RegisterForm />
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
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <Icons.gitHub className="mr-2 h-4 w-4 text-slate-800 dark:text-white" />
                    Github
                  </Button>
                  <Button variant="outline" className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}