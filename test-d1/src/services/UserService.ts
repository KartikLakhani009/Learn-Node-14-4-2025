export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
}

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(name: string, email: string): Promise<User> {
    const user: User = {
      id: Date.now(),
      name,
      email
    };
    return this.userRepository.save(user);
  }
} 