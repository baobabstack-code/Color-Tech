// Frontend-compatible configuration
export const serviceConfig = {
  // API configuration
  apiUrl: 'http://localhost:1337/api', // Strapi backend URL
  
  // JWT configuration
  jwt: {
    expiresIn: '24h',
  },
};

export default serviceConfig;