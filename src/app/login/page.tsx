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

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-10 w-10 text-primary dark:text-white" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Portal
          </h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Sign in to access your account
          </p>
        </div>
        <LoginForm type="admin" redirectPath="/admin/dashboard" />
      </div>
    </main>
  );
}