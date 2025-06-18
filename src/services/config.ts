// Frontend-compatible configuration
export const serviceConfig = {
  // API configuration
  apiUrl: '/api', // Use relative path for Next.js API routes
  
  // JWT configuration
  jwt: {
    expiresIn: '24h',
  },
};

export default serviceConfig;