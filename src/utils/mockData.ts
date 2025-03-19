import { Vehicle } from '../services/vehicleService';
import { Service } from '../services/serviceService';
import { Booking } from '../services/bookingService';

// Mock vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    userId: 'user1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Silver',
    licensePlate: 'ABC123',
    vin: '1HGCM82633A123456',
    notes: 'Regular maintenance only',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    color: 'Blue',
    licensePlate: 'XYZ789',
    vin: '2HGFC2F52KH123456',
    notes: 'Minor scratch on rear bumper',
    createdAt: '2023-02-20T14:15:00Z',
    updatedAt: '2023-02-20T14:15:00Z'
  }
];

// Mock services
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Basic Wash',
    description: 'Exterior hand wash with premium soap',
    basePrice: 29.99,
    durationMinutes: 30,
    category: 'Exterior Detailing',
    status: 'active',
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'Premium Wash',
    description: 'Exterior hand wash with wax protection',
    basePrice: 49.99,
    durationMinutes: 45,
    category: 'Exterior Detailing',
    status: 'active',
    createdAt: '2023-01-01T08:15:00Z',
    updatedAt: '2023-01-01T08:15:00Z'
  },
  {
    id: '3',
    name: 'Interior Vacuum',
    description: 'Complete interior vacuum and wipe down',
    basePrice: 39.99,
    durationMinutes: 30,
    category: 'Interior Detailing',
    status: 'active',
    createdAt: '2023-01-01T08:30:00Z',
    updatedAt: '2023-01-01T08:30:00Z'
  },
  {
    id: '4',
    name: 'Full Interior Detail',
    description: 'Deep cleaning of all interior surfaces',
    basePrice: 129.99,
    durationMinutes: 120,
    category: 'Interior Detailing',
    status: 'active',
    createdAt: '2023-01-01T09:00:00Z',
    updatedAt: '2023-01-01T09:00:00Z'
  }
];

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    vehicleId: '1',
    serviceId: '1',
    scheduledDate: '2023-04-15',
    scheduledTime: '10:00',
    status: 'completed',
    notes: 'Please pay extra attention to the wheels',
    createdAt: '2023-04-10T09:30:00Z',
    updatedAt: '2023-04-15T11:30:00Z',
    clientName: 'John Doe',
    serviceName: 'Basic Wash',
    serviceDescription: 'Exterior hand wash with premium soap'
  },
  {
    id: '2',
    userId: 'user1',
    vehicleId: '2',
    serviceId: '4',
    scheduledDate: '2023-05-20',
    scheduledTime: '14:00',
    status: 'confirmed',
    notes: 'Pet hair removal needed',
    createdAt: '2023-05-15T16:45:00Z',
    updatedAt: '2023-05-15T17:00:00Z',
    clientName: 'John Doe',
    serviceName: 'Full Interior Detail',
    serviceDescription: 'Deep cleaning of all interior surfaces'
  }
];

// Helper function to initialize mock data in localStorage
export const initializeMockData = () => {
  if (typeof window !== 'undefined') {
    // Only run in browser environment
    if (!localStorage.getItem('mockVehiclesInitialized')) {
      localStorage.setItem('mockVehicles', JSON.stringify(mockVehicles));
      localStorage.setItem('mockVehiclesInitialized', 'true');
    }
    
    if (!localStorage.getItem('mockServicesInitialized')) {
      localStorage.setItem('mockServices', JSON.stringify(mockServices));
      localStorage.setItem('mockServicesInitialized', 'true');
    }
    
    if (!localStorage.getItem('mockBookingsInitialized')) {
      localStorage.setItem('mockBookings', JSON.stringify(mockBookings));
      localStorage.setItem('mockBookingsInitialized', 'true');
    }
  }
}; 