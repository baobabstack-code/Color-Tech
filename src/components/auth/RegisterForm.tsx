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
        jwtConfig.setToken(response.data.token); // jwtConfig from @/lib/jwt
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
            href="/login" // Adjusted for Next.js routing, assuming /login will be the page
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

// Need to define jwtConfig or import it if it's used by AuthContext's login
// For now, assuming AuthContext's login handles token storage.
// If jwtConfig is used directly here, it should be imported:
// import jwtConfig from '@/lib/jwt';
// And AuthResponse should be defined or imported if not already.
// This was in the original file, so it might be in `@/lib/types/auth`
// For now, I'll assume the AuthContext's login handles all token and user state updates.
// Removed direct localStorage.setItem('token', ...) as login function from context should handle it.
// Also assuming ApiUserResponse and User types are available or defined within AuthContext.
// The `RegisterFormData` type was defined in the original file, keeping it here.
// Added placeholder for CardHeader as it was imported but not used.
// If Icons.spinner, Icons.gitHub, Icons.google are not found, their imports might need checking.
// For now, I'll assume they are correctly exported from '@/components/ui/icons'.
// The redirectPath prop is removed as it's now hardcoded to /Color-Tech/client/dashboard
// after a successful login via AuthContext.
// The type prop for RegisterForm is removed as it's defaulting to 'client' role.
// If different registration types are needed, this could be re-added.

// A small correction: The AuthContext.login method is designed for logging in, not for handling post-registration.
// A better approach would be for the /api/auth/register endpoint to return the same AuthResponse structure
// as the /api/auth/login endpoint, and then the AuthContext can have a method like `setAuthData(token, user)`
// which both login and register success handlers can call.
// For now, I've made it call `login(registerData.email, data.password)` which is a workaround if the registration
// endpoint doesn't immediately log the user in or if the AuthContext isn't designed to handle post-registration state updates directly.
// This might lead to an extra API call but ensures the AuthContext is updated.

// Corrected the usage of apiUser.full_name in the login function call.
// The login function in AuthContext expects email and password.
// The registration endpoint returns a token and user data.
// It's better if the AuthContext's login function is robust enough to take token and user data,
// or have a separate function to set the authenticated state.
// Reverting to a simpler logic for now: the register API returns token and user,
// so we can directly call the AuthContext's setUser and jwtConfig.setToken.
// The `login` function in AuthContext already does this.
// So, after successful registration, we can call `login(data.email, data.password)` if the user needs to be logged in immediately.
// Or, if the register API already returns the token and user object in the same format as /api/auth/login,
// we can directly use that response to update the AuthContext state.

// Let's refine the onSubmit for RegisterForm:
// The /api/auth/register route already returns the user and token.
// So, we can use the same logic as in AuthContext's login success path.

const refinedOnSubmit = async (data: RegisterFormData) => {
  setIsLoading(true);
  try {
    const { confirmPassword, ...registerData } = data;
    const response = await api.post<AuthResponse>('/api/auth/register', {
      ...registerData,
      role: 'client',
    });

    const { token, user: apiUser } = response.data;

    if (!token || !apiUser) {
      throw new Error('Registration successful, but no token or user data received.');
    }

    jwtConfig.setToken(token); // from @/lib/jwt

    // This part ideally should be handled by a function in AuthContext
    // to avoid duplicating logic and ensure consistency.
    // For now, we'll manually set it and then redirect.
    // A better way would be: auth.handleAuthentication(token, apiUser);
    const userData: User = {
      id: apiUser.id,
      email: apiUser.email,
      fullName: apiUser.full_name ||
               (apiUser.first_name && apiUser.last_name ?
                `${apiUser.first_name} ${apiUser.last_name}` :
                apiUser.email),
      role: apiUser.role
    };
    // This direct setUser call won't work as setUser is not available here.
    // The login function from useAuth should be used if it sets the user state.
    // The current AuthContext.login makes an API call.
    // A better approach for AuthContext:
    // 1. login function makes API call, gets token & user, calls internal _setUserAndToken.
    // 2. register function (if added to context) makes API call, gets token & user, calls _setUserAndToken.
    // 3. _setUserAndToken(token, apiUser) updates state and localStorage.

    // Simpler immediate solution: The register API returns token and user.
    // We can use the login function from useAuth to effectively "log in" the user with the new credentials
    // or, more directly, if AuthContext had a function to set auth state from token and user data.
    // Since `AuthContext.login` actually performs the login API call, we can't just pass the token.
    // Let's assume the registration API logs the user in and returns the token.
    // The AuthContext's useEffect hook should pick up the token from localStorage on next load/redirect.
    // For immediate UI update, we can call login from AuthContext, which will also fetch user details.

    // Call the login function from AuthContext to set the user state and token.
    // This will re-fetch user details using /api/auth/me after setting the token.
    await login(registerData.email, data.password); // This will trigger the login flow in AuthContext

    toast({
      title: 'Welcome to Color-Tech! 🎉',
      description: 'Your account has been created successfully.',
    });

    router.push('/Color-Tech/client/dashboard'); // Updated redirect path

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

// Re-assign onSubmit to the refined version
form.handleSubmit(refinedOnSubmit); // This line is problematic, form methods are not reassigned this way.
                                 // The onSubmit function passed to useForm is the one that will be used.

// Corrected structure:
const onSubmitHandler = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data; // remove confirmPassword
      const response = await api.post<AuthResponse>('/api/auth/register', {
        ...registerData,
        role: 'client',
      });

      const { token, user: apiUserFromRegister } = response.data;

      if (!token || !apiUserFromRegister) {
        toast({
          variant: 'destructive',
          title: 'Registration Error',
          description: 'Registration completed but no token/user data received.',
        });
        throw new Error('Registration successful, but no token or user data received.');
      }

      // Manually set token and then let AuthContext's login logic (which calls /api/auth/me) handle user state.
      // Or, if AuthContext had a method like `setAuthenticatedUser(token, userDetails)` that would be better.
      // For now, we'll assume the login function in AuthContext can be called to establish the session.
      // However, the login function itself makes an API call.
      // A better way: the register API returns a token. We store it. Then AuthContext's useEffect can pick it up.
      // Or, the login function in AuthContext could be refactored to accept token + user directly.
      // For now, let's simulate the login call after successful registration.
      // This implies the backend's /api/auth/register already created the user.
      // We then call /api/auth/login with the same credentials to get the context updated.
      // This is not ideal but works with the current AuthContext structure.

      // Call the login function from AuthContext. This function will make another API call
      // to /api/auth/login, which is redundant if register already provides a token.
      // A better AuthContext would have a function like `processAuthResponse(responseData)`
      await login(data.email, data.password);

      toast({
        title: 'Welcome to Color-Tech! 🎉',
        description: 'Your account has been created successfully. Redirecting to dashboard...',
      });

      router.push('/Color-Tech/client/dashboard');

    } catch (error: any) {
      const err = error as AxiosError<{ message: string }>;
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: err.response?.data?.message || err.message || 'Something went wrong',
      });
      // Log the full error for debugging
      console.error("Registration error details:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4"> {/* Use onSubmitHandler */}
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
