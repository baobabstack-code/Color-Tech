import api from './api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'client' | 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role?: 'client' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: 'client' | 'admin' | 'staff';
  status?: 'active' | 'inactive';
}

// User authentication
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/local/register', {
    username: data.email,
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phone: data.phone,
    role: data.role || 'client'
  });
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/local', {
    identifier: data.email,
    password: data.password
  });
  return response.data;
};

// User profile management
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateUserData): Promise<User> => {
  const response = await api.put('/users/me', data);
  return response.data;
};

// Admin user management
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string; user?: User }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};