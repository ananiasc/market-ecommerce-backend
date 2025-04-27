import { describe, vi, test, expect, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockClientRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
};

const mockJwtService = {
  signAsync: vi.fn().mockResolvedValue('generated_token'),
};

vi.mock('bcrypt', async () => ({
  ...(await vi.importActual('bcrypt')),
  compare: vi.fn().mockImplementation(() => Promise.resolve(true)),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    authService = new AuthService(mockJwtService as any, mockClientRepository as any);
  });

  describe('login', () => {
    test('deve retornar um token JWT quando as credenciais estiverem corretas', async () => {
      const mockClient = {
        id: 123,
        email: 'test@email.com',
        password: 'hashed_password'
      }

      mockClientRepository.findByEmail.mockResolvedValue(mockClient);

      const result = await authService.login('test@email.com', 'correct_password');

      expect(result).toEqual({ token: 'generated_token' });
      expect(mockClientRepository.findByEmail).toHaveBeenCalledWith('test@email.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('correct_password', 'hashed_password');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        clientEmail: 'test@email.com',
        sub: 123
      });
    });

    test('deve lançar UnauthorizedException quando o email não existe', async () => {
      mockClientRepository.findByEmail.mockResolvedValue(null);
      
      await expect(authService.login('nonexistent@example.com', 'any_password'))
        .rejects.toThrow(UnauthorizedException);
    });

    test('deve lançar UnauthorizedException quando a senha estiver incorreta', async () => {
      const mockClient = {
        id: 123,
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      mockClientRepository.findByEmail.mockResolvedValue(mockClient);
      vi.mocked(bcrypt.compare).mockImplementationOnce(() => Promise.resolve(false));
      
      await expect(authService.login('test@example.com', 'wrong_password'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
