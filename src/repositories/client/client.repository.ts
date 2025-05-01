import { Injectable } from '@nestjs/common';
import { RegisterClient } from 'src/auth/entity/register-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(registerClient: RegisterClient, hashed: string) {
    return await this.prisma.clients.create({
      data: {
        ...registerClient,
        password: hashed,
        is_active: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.clients.findUnique({ where: { email } });
  }
}
