import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { InMemoryUsersRepository } from './in-memory-users.repository.js';
import { UsersController } from './users.controller.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: UsersRepository, useClass: InMemoryUsersRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
