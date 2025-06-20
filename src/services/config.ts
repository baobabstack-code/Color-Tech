// Frontend-compatible configuration
export const serviceConfig = {
  // API configuration
  apiUrl: '/api', // Use relative URL for Next.js fullstack
  
  // JWT configuration
  jwt: {
    expiresIn: '24h',
  },
};

export default serviceConfig;