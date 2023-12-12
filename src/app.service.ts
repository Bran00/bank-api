import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Seja Bem Vindo ao Banco da Gente';
  }
}
