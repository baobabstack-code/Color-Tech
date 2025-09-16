// Define the structure of a Service object based on the database schema
export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number; // Duration in minutes
  category: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Get all services from the API
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/services`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    return []; // Return an empty array or re-throw a custom error
  }
};

// Get a single service by its ID
export const getServiceById = async (
  id: string | number
): Promise<Service | undefined> => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/services/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return undefined;
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching service:", error);
    return undefined;
  }
};

// Get all unique service categories
export const getServiceCategories = async (): Promise<string[]> => {
  const services = await getAllServices();
  const categories = services.map((s) => s.category);
  return [...new Set(categories)];
};

// Function to generate static paths for service pages
export const getServiceStaticPaths = async () => {
  const services = await getAllServices();
  return services.map((service) => ({
    id: service.id.toString(),
  }));
};
