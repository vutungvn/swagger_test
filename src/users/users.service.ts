import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { UsersRepository } from './users.repository.js';

/** Postgres unique_violation error code. */
const POSTGRES_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.save(createUserDto);
    } catch (error) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException(
          `Email "${createUserDto.email}" đã được sử dụng`,
        );
      }
      throw error;
    }
  }

  private isDuplicateEmailError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: unknown }).code === POSTGRES_UNIQUE_VIOLATION
    );
  }
}
