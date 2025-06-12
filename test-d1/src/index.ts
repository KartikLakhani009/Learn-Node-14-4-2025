import { UserService, UserRepository, User } from "./services/UserService";

export class UserRepositoryImpl implements UserRepository {

  private users: User[] = [];

  findById(id: number): Promise<User | null> {
    return Promise.resolve(this.users.find((user) => user.id === id) || null);
  }
  save(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }
}


function main() {
  const userService = new UserService(new UserRepositoryImpl());

  userService.getUserById(1).then((user) => {
    console.log(user);
  });

  userService.createUser("John Doe", "john.doe@example.com").then((user) => {
    console.log(user);
  });

}

main();

