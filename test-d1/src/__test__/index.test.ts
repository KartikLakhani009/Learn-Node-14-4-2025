import { UserRepositoryImpl } from '../index';
import { User } from '../services/UserService';

describe('UserRepositoryImpl', () => {
    let userRepository: UserRepositoryImpl;

    beforeEach(() => {
        userRepository = new UserRepositoryImpl();
    });

    describe('findById', () => {
        it('should return null when user not found', async () => {
            const result = await userRepository.findById(1);
            expect(result).toBeNull();
        });

        it('should return user when found', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com'
            };

            await userRepository.save(user);
            const result = await userRepository.findById(1);

            expect(result).toEqual(user);
        });
    });

    describe('save', () => {
        it('should save user successfully', async () => {
            const user: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com'
            };

            const result = await userRepository.save(user);

            expect(result).toEqual(user);

            // Verify user was actually saved
            const savedUser = await userRepository.findById(1);
            expect(savedUser).toEqual(user);
        });

        it('should save multiple users', async () => {
            const user1: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com'
            };

            const user2: User = {
                id: 2,
                name: 'Jane Doe',
                email: 'jane@example.com'
            };

            await userRepository.save(user1);
            await userRepository.save(user2);

            const result1 = await userRepository.findById(1);
            const result2 = await userRepository.findById(2);

            expect(result1).toEqual(user1);
            expect(result2).toEqual(user2);
        });
    });
});
