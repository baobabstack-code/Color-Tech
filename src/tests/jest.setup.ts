import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn((props) => props),
}));

// Mock environment variables
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  configurable: true
});
Object.defineProperty(process.env, 'NEXT_PUBLIC_API_URL', {
  value: 'http://localhost:3000',
  configurable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    root: Element | Document | null = null;
    rootMargin: string = '0px';
    thresholds: ReadonlyArray<number> = [0];

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.root = options?.root || null;
        this.rootMargin = options?.rootMargin || '0px';
        this.thresholds = options?.threshold ?
            (Array.isArray(options.threshold) ? options.threshold : [options.threshold]) :
            [0];
    }

    observe() {
        return null;
    }

    disconnect() {
        return null;
    }

    unobserve() {
        return null;
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
(global as any).localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

// Set up test timeout
jest.setTimeout(30000);
