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
    <div className="container flex min-h-screen items-center justify-center pt-20">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center">
            <Icons.logo className="h-8 w-8 text-primary dark:text-white" />
            <h1 className="ml-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Color-Tech Admin
            </h1>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-200">
            Sign in to access the admin portal
          </p>
        </div>
        
        <LoginForm type="admin" redirectPath="/admin/dashboard" />
      </div>
    </div>
  );
}