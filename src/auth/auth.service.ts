import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterClient } from './entity/register-client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerClient: RegisterClient) {
    const hashed = await bcrypt.hash(registerClient.password, 10);

    await this.prisma.clients.create({
      data: {
        ...registerClient,
        password: hashed,
        is_active: true,
      },
    });
  }

  async login(email: string, password: string) {
    const client = await this.prisma.clients.findUnique({ where: { email } });
    if (!client || !(await bcrypt.compare(password, client.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { clientEmail: client.email, sub: client.id  };
    const token = await this.jwtService.signAsync(payload);
    return { token: token };
  }
}
