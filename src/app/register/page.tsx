"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { Icons } from '@/components/ui/icons';
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center pt-20">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center">
            <Icons.logo className="h-8 w-8 text-primary dark:text-white" />
            <h1 className="ml-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create an Account
            </h1>
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-200">
            Enter your details below to create your client account
          </p>
        </div>
        
        <RegisterForm />

        <p className="px-8 text-center text-sm text-muted-foreground dark:text-gray-200">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary dark:hover:text-white"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}