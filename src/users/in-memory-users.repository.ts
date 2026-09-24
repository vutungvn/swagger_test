import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';

/**
 * In-memory stand-in for a real database so the app can boot without one.
 * Mimics Postgres by rejecting with a `23505` (unique_violation) error when
 * the email already exists.
 */
@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  private readonly usersByEmail = new Map<string, User>();

  async save(createUserDto: CreateUserDto): Promise<User> {
    if (this.usersByEmail.has(createUserDto.email)) {
      return Promise.reject({
        code: '23505',
        detail: `Key (email)=(${createUserDto.email}) already exists.`,
      });
    }

    const user: User = {
      id: randomUUID(),
      email: createUserDto.email,
      name: createUserDto.name,
      createdAt: new Date(),
    };
    this.usersByEmail.set(user.email, user);
    return user;
  }
}
