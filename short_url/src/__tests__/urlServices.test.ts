// import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { createOrGetShortUrl, getUrls } from '../services/urlServices';
import Url from '../model/urlSchema';
import { User } from '../types/user';

// Mock the ShortUniqueId
jest.mock('short-unique-id', () => {
    return jest.fn().mockImplementation(() => ({
        randomUUID: () => 'test123'
    }));
});

describe('URL Services', () => {
    let mockUser: User;

    beforeAll(async () => {
        // Connect to a test database
        await mongoose.connect('mongodb://localhost:27017/test_short_url_db');
        mockUser = {
            _id: new mongoose.Types.ObjectId(),
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        } as User;
    });

    afterAll(async () => {
        // Clean up and close the database connection
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the URL collection before each test
        await Url.deleteMany({});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    describe('createOrGetShortUrl', () => {
        it('should create a new short URL when URL does not exist', async () => {
            const originalUrl = 'https://example.com';
            const result = await createOrGetShortUrl(mockUser, originalUrl);

            expect(result.statusCode).toBe(201);
            expect(result.data).toBeDefined();
            expect(result.data?.shortUrl).toBe('test123');
            expect(result.data?.originalUrl).toBe(originalUrl);
            expect(result.data?.createdBy?.toString()).toBe(mockUser._id.toString());
        });

        it('should return existing URL when URL already exists', async () => {
            const originalUrl = 'https://example.com';
            
            // First create a URL
            await createOrGetShortUrl(mockUser, originalUrl);
            
            // Try to create the same URL again
            const result = await createOrGetShortUrl(mockUser, originalUrl);

            expect(result.statusCode).toBe(200);
            expect(result.data?.originalUrl).toBe(originalUrl);
        });

        it('should throw error when original URL is not provided', async () => {
            await expect(createOrGetShortUrl(mockUser)).rejects.toThrow('Original URL is required');
        });
    });

    describe('getUrls', () => {
        it('should return empty array when no URLs exist', async () => {
            const result = await getUrls(mockUser._id.toString());
            expect(result.statusCode).toBe(200);
            expect(result.data).toHaveLength(0);
        });

        it('should return all URLs for a user with visit count', async () => {
            // Create some test URLs
            const urls = [
                { shortUrl: 'abc123', originalUrl: 'https://example1.com', createdBy: mockUser._id },
                { shortUrl: 'def456', originalUrl: 'https://example2.com', createdBy: mockUser._id }
            ];

            await Url.insertMany(urls);

            const result = await getUrls(mockUser._id.toString());
            
            expect(result.statusCode).toBe(200);
            expect(result.data).toHaveLength(2);
            expect(result.data?.[0]).toHaveProperty('visitCount', 0);
            expect(result.data?.[1]).toHaveProperty('visitCount', 0);
        });

        it('should not return URLs from other users', async () => {
            const otherUser = {
                _id: new mongoose.Types.ObjectId(),
                name: 'Other User',
                email: 'other@example.com'
            } as User;

            // Create URLs for both users
            await Url.create({
                shortUrl: 'abc123',
                originalUrl: 'https://example1.com',
                createdBy: otherUser._id
            });

            await Url.create({
                shortUrl: 'def456',
                originalUrl: 'https://example2.com',
                createdBy: mockUser._id
            });

            const result = await getUrls(mockUser._id.toString());
            
            expect(result.statusCode).toBe(200);
            expect(result.data).toHaveLength(1);
            expect(result.data?.[0]?.shortUrl).toBe('def456');
        });
    });
}); 