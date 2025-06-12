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
import { useToast } from "@/components/ui/use-toast";
import api from '@/services/api'; // Will call API directly for now
import { useAuth } from '@/contexts/AuthContext'; // To use login function after registration
import { AxiosError } from 'axios';
import jwtConfig from '@/lib/jwt';

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

      const response = await api.post<AuthResponse>('/api/auth/register', { // Updated API endpoint
        ...registerData,
        role: 'client', // Default role for new registrations
      });

      // After successful registration, log the user in using the token from the response
      // This assumes the register endpoint returns a token and user object similar to login
      if (response.data.token && response.data.user) {
        // jwtConfig.setToken(response.data.token); // jwtConfig from @/lib/jwt
        const apiUser = response.data.user;
        const userData: User = {
          id: apiUser.id,
          email: apiUser.email,
          fullName: apiUser.full_name || apiUser.email,
          role: apiUser.role
        };
        localStorage.setItem('user', JSON.stringify(userData)); // Manually set user for now
        // Ideally, the login function from AuthContext should be called or a similar mechanism
        // For now, we manually update and then redirect.
        // To fully use AuthContext, it would need a method to setUser after registration.
        // A simpler approach is to call login() from AuthContext if register returns the same AuthResponse
        // Or, even better, the login function in AuthContext could be refactored to handle this.
        // For now, this is a direct way to set auth state after registration.

        // To properly update AuthContext state, we might need to call a function like `login`
        // or a new function `handleAuthentication(token, user)` if the register API returns these.
        // The current login function in AuthContext handles this.
        // We can call it with the credentials again, or if the register API returns the same structure,
        // we can reuse parts of the login logic.
        // For simplicity and to leverage existing AuthContext logic:
        await login(registerData.email, data.password); // Attempt to login to set context state

        toast({
          title: 'Welcome to Color-Tech! 🎉',
          description: 'Your account has been created successfully.',
        });
        router.push('/Color-Tech/client/dashboard'); // Updated redirect path
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
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} disabled={isLoading} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" type="email" {...field} disabled={isLoading} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} disabled={isLoading} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
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
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" disabled={isLoading}>
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline" disabled={isLoading}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login" // Assuming /login is the correct path for the login page
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
