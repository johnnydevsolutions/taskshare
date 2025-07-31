// Test setup file
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';

// Mock console.log to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
