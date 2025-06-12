export class AsyncService {
  async fetchData(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Data fetched successfully');
      }, 1000);
    });
  }

  async fetchDataWithError(): Promise<string> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Failed to fetch data'));
      }, 1000);
    });
  }

  async processItems(items: string[]): Promise<string[]> {
    return Promise.all(
      items.map(async (item) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return item.toUpperCase();
      })
    );
  }
} 