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
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

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
                <LoginForm type="client" redirectPath="/client/dashboard" />
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