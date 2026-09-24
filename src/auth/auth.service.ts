import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';

interface DemoUser {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly demoUser: DemoUser = {
    email: 'demo@example.com',
    password: 'Password123!',
  };

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    if (
      loginDto.email !== this.demoUser.email ||
      loginDto.password !== this.demoUser.password
    ) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: this.demoUser.email, email: this.demoUser.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
