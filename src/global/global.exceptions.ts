import { BadRequestException } from '@nestjs/common';

export class ClientAlreadyExistException extends BadRequestException {
  constructor(msg: string) {
    super(msg);
  }
}
