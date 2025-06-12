import { AsyncService } from '../AsyncService';

describe('AsyncService', () => {
  let asyncService: AsyncService;

  beforeEach(() => {
    asyncService = new AsyncService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // jest.useRealTimers();
  });

  describe('fetchData', () => {
    it('should resolve with success message', async () => {
      const promise = asyncService.fetchData();

      jest.advanceTimersByTime(1000);

      await expect(promise).resolves.toBe('Data fetched successfully');
    });
  });

  describe('fetchDataWithError', () => {
    it('should reject with error', async () => {
      const promise = asyncService.fetchDataWithError();

      jest.advanceTimersByTime(1000);

      await expect(promise).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('processItems', () => {
    it('should process items asynchronously', async () => {
      const items = ['a', 'b', 'c'];
      const promise = asyncService.processItems(items);

      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toEqual(['A', 'B', 'C']);
    });

    it('should handle empty array', async () => {
      const promise = asyncService.processItems([]);

      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toEqual([]);
    });
  });
}); 