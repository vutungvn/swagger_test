import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: { save: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    usersRepository = {
      save: vi.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepository },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'duplicate@example.com',
      name: 'John Doe',
    };

    it('should throw ConflictException when the database reports a duplicate email', async () => {
      // Giả lập lỗi Postgres unique_violation khi email đã tồn tại
      usersRepository.save.mockRejectedValueOnce({
        code: '23505',
        detail: 'Key (email)=(duplicate@example.com) already exists.',
      });

      await expect(async () => {
        await service.create(createUserDto);
      }).rejects.toThrow(ConflictException);

      expect(usersRepository.save).toHaveBeenCalledWith(createUserDto);
    });

    it('should rethrow unexpected database errors as-is', async () => {
      const unexpectedError = new Error('Connection timeout');
      usersRepository.save.mockRejectedValueOnce(unexpectedError);

      await expect(async () => {
        await service.create(createUserDto);
      }).rejects.toThrow('Connection timeout');
    });

    it('should return the created user on success', async () => {
      const createdUser = {
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name,
        createdAt: new Date(),
      };
      usersRepository.save.mockResolvedValueOnce(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });
});
