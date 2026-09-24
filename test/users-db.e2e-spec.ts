import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'node:child_process';
import { CreateUserDto } from '../src/users/dto/create-user.dto.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { PrismaUsersRepository } from '../src/users/prisma-users.repository.js';
import { UsersRepository } from '../src/users/users.repository.js';
import { UsersService } from '../src/users/users.service.js';

describe('Users + real Postgres via Testcontainers (e2e)', () => {
  let container: StartedPostgreSqlContainer;
  let moduleRef: TestingModule;
  let prisma: PrismaService;
  let usersService: UsersService;

  beforeAll(async () => {
    // Bước 1: spin up 1 container Postgres thật (Docker), không mock.
    container = await new PostgreSqlContainer('postgres:16-alpine').start();
    process.env.DATABASE_URL = container.getConnectionUri();

    // Bước 2: đẩy schema Prisma vào DB vừa tạo trong container.
    execSync('npx prisma db push --accept-data-loss', {
      env: { ...process.env, DATABASE_URL: container.getConnectionUri() },
      stdio: 'inherit',
    });

    // Bước 3: cho NestJS kết nối vào DB thật này qua PrismaService.
    moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
        { provide: UsersRepository, useClass: PrismaUsersRepository },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
    prisma = moduleRef.get(PrismaService);
  }, 180_000);

  afterAll(async () => {
    // Dọn dẹp: đóng kết nối Prisma rồi tắt + xoá container.
    await moduleRef?.close();
    await container?.stop();
  });

  it('creates a user for real inside the Testcontainers Postgres instance', async () => {
    const dto: CreateUserDto = {
      email: 'real-db@example.com',
      name: 'Real DB User',
    };

    const user = await usersService.create(dto);

    expect(user.id).toBeDefined();
    expect(user.email).toBe(dto.email);

    const rowInDb = await prisma.user.findUnique({ where: { email: dto.email } });
    expect(rowInDb).not.toBeNull();
  });

  it('throws ConflictException when Postgres rejects the duplicate email via its unique constraint', async () => {
    const dto: CreateUserDto = {
      email: 'duplicate-real@example.com',
      name: 'First',
    };
    await usersService.create(dto);

    await expect(async () => {
      await usersService.create({ ...dto, name: 'Second' });
    }).rejects.toThrow(ConflictException);
  });
});
