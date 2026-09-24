import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';

/**
 * DI token / boundary for the persistence layer, so UsersService can be unit
 * tested against a mock without touching a real database.
 */
export abstract class UsersRepository {
  abstract save(createUserDto: CreateUserDto): Promise<User>;
}
