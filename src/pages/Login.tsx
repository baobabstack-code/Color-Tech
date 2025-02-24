import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return <LoginForm type="client" redirectPath="/client/dashboard" />;
} 