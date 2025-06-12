// import { jest } from '@jest/globals';

// Increase timeout for all tests
jest.setTimeout(30000);

// Suppress console.log during tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
}; 

// beforeEach(() => {
//     jest.spyOn(console, 'log').mockImplementation(() => {});
//   });