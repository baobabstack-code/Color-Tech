export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'client' | 'admin';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  token: string;
} 