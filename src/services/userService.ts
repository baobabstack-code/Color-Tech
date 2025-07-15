export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/customers');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const customers = await response.json();
  
  // Transform customer data to user format
  return customers.map((customer: any) => ({
    id: customer.id?.toString() || customer.id,
    fullName: customer.name || customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: 'customer' as const,
    createdAt: customer.createdAt || new Date().toISOString(),
    updatedAt: customer.updatedAt || new Date().toISOString()
  }));
};

export const getUserById = async (id: string): Promise<User | null> => {
  const response = await fetch(`/api/customers/${id}`);
  if (!response.ok) {
    return null;
  }
  const customer = await response.json();
  
  return {
    id: customer.id?.toString() || customer.id,
    fullName: customer.name || customer.fullName,
    email: customer.email,
    phone: customer.phone,
    role: 'customer' as const,
    createdAt: customer.createdAt || new Date().toISOString(),
    updatedAt: customer.updatedAt || new Date().toISOString()
  };
};