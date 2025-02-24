import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '@/components/auth/LoginForm';
import { Register } from '@/pages/auth/Register';
import { Icons } from '@/components/ui/icons';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-2xl font-semibold tracking-tight">
              Color-Tech
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Your trusted partner in vehicle transformation
          </p>
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm type="client" redirectPath="/client/dashboard" />
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <Register />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 