import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Placeholder authentication logic
    const isAuthenticated = await authenticateUser(values.email, values.password);

    if (isAuthenticated) {
      // Store token (in local storage for now)
      localStorage.setItem('token', 'dummy_token');

      // Redirect to customer or admin dashboard based on role
      if (values.email === 'admin@example.com') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } else {
      // Display error message
      alert('Invalid credentials');
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
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email and password to login</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
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
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Login</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
