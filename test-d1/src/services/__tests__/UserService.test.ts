import { UserService, User, UserRepository } from '../UserService';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn()
    };
    userService = new UserService(mockUserRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const newUser: User = {
        id: expect.any(Number),
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await userService.createUser('Jane Doe', 'jane@example.com');

      expect(result).toEqual(newUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com'
      }));
    });
  });
}); 