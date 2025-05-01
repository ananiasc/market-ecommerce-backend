import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterClient } from './entity/register-client';
import { ClientAlreadyExistException } from 'src/global/global.exceptions';
import { ErrorMessages } from 'src/global/global.messages';
import { ClientRepository } from 'src/repositories/client/client.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clientRepository: ClientRepository,
  ) {}

  async register(registerClient: RegisterClient) {
    const hashed = await bcrypt.hash(registerClient.password, 10);
    const client = await this.clientRepository.findByEmail(
      registerClient.email,
    );
    if (client) {
      throw new ClientAlreadyExistException(ErrorMessages.EMAIL_ALREADY_EXIST);
    }

    await this.clientRepository.create(registerClient, hashed);
  }

  async login(email: string, password: string) {
    const client = await this.clientRepository.findByEmail(email);
    if (!client || !(await bcrypt.compare(password, client.password))) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENCIALS);
    }
    const payload = { clientEmail: client.email, sub: client.id };
    const token = await this.jwtService.signAsync(payload);
    return { token: token };
  }
}
