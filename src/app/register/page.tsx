"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return <LoginPage />;
};

export default RegisterPage;