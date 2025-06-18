import { jest } from '@jest/globals';

const mockPool = {
  query: jest.fn(),
  // Add other methods if they are used and need mocking (e.g., connect, end, on)
};

export default mockPool;