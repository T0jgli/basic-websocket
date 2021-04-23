import { IUsers } from "./interfaces";

export class User implements IUsers {
  constructor(public userId: string, public socketId: string) {}
}

export class UsersRepository {
  private users: User[];
  constructor() {
    this.users = [];
  }

  pushUser(user: User) {
    this.users.push(user);
  }

  removeUser(socketId: string) {
    const foundIndex = this.users.findIndex(
      (user) => user.socketId === socketId
    );

    if (foundIndex === -1) throw new Error("No user found");

    this.users.splice(foundIndex, 1);
  }

  get getUsers() {
    return this.users;
  }
}
