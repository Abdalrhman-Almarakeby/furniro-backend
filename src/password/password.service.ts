import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = 10;
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
