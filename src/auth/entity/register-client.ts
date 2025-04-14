import { RegisterClientDto } from "../dto/register-client.dto";

export class RegisterClient {
  name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;

  constructor(dto: RegisterClientDto) {
    this.name = dto.name;
    this.last_name = dto.lastName;
    this.email = dto.email;
    this.password = dto.password;
    this.phone_number = dto.phoneNumber;
  }
}
