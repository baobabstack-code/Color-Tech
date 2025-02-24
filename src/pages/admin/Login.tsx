import LoginForm from '@/components/auth/LoginForm';

export default function AdminLogin() {
  return <LoginForm type="admin" redirectPath="/admin/dashboard" />;
} 