import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, 
  Loader2, User, Shield, Briefcase 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
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

interface LoginFormProps {
  type: 'client' | 'admin';
  redirectPath: string;
}

const getLoginSchema = (type: 'client' | 'admin') => {
  const baseSchema = {
    password: z.string().min(8, "Password must be at least 8 characters"),
  };

  switch (type) {
    case 'admin':
      return z.object({
        email: z
          .string()
          .email("Please enter a valid email")
          .regex(/^admin@/, "Please use an admin email"),
        ...baseSchema,
      });
    default:
      return z.object({
        email: z.string().email("Please enter a valid email"),
        ...baseSchema,
      });
  }
};

export default function LoginForm({ type, redirectPath }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof getLoginSchema>>({
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

  const onSubmit = async (values: z.infer<typeof getLoginSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      navigate(redirectPath);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {getIcon()}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <Card className="mt-8 p-6 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          className="pl-10"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
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
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Need help? Contact{" "}
            <a href="mailto:support@colortech.com" className="font-medium text-primary hover:text-primary/80">
              Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 