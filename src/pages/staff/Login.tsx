import LoginForm from '@/components/auth/LoginForm';

export default function StaffLogin() {
  return <LoginForm type="staff" redirectPath="/staff/dashboard" />;
} 