import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(accountNumber: string, password: string): Promise<string> {
    if (!accountNumber || !password) {
      throw new UnauthorizedException('Insira seus dados corretamente');
    }

    try {
      const user = await this.usersService.findOne(accountNumber);

      if (!user) {
        throw new NotFoundException('Conta não encontrada');
      }

      const passValid = await bcrypt.compare(password, user.password);

      if (passValid) {
        const payload = { sub: user.accountNumber, username: user.username };
        return this.jwtService.sign(payload, {
          privateKey: jwtConstants.secret,
        });
      } else {
        throw new UnauthorizedException('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro durante a busca da conta:', error);
      throw error;
    }
  }

  async getUserByAccountNumber(
    accountNumber: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOne(accountNumber);
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new NotFoundException('Essa conta não pertence a você');
      }
      return user;
    } catch (error) {
      console.error('Erro durante a busca do usuário:', error);
      throw error;
    }
  }

  async updateUser(
    user: User,
    updateData: {
      username?: string;
      password?: string;
      accountNumber?: string;
    },
  ) {
    try {
      const foundUser = await this.usersService.findOne(
        updateData.accountNumber,
      );

      user = foundUser;

      if (updateData.username !== undefined) {
        user.username = updateData.username;
      }

      if (updateData.password !== undefined) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(updateData.password, saltRounds);
      }

      user.lastUpdatedDate = new Date(8.64e15).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      let updatedData = {
        username: user.username,
        password: user.password,
        accountNumber: user.accountNumber,
        agency: user.agency,
        kindAccount: user.kindAccount,
        lastUpdatedData: user.lastUpdatedDate,
      };

      updatedData.password = user.password;

      const result = await this.usersService.updateProfile(
        user.accountNumber,
        updatedData,
      );

      return result;
    } catch (error) {
      console.error('Erro durante a busca do usuário:', error);
    }
    throw Error;
  }

  async withdraw(
    accountNumber: string,
    password: string,
    amount: number,
  ): Promise<User> {
    const user = await this.usersService.findOne(accountNumber);

    if (!user) {
      throw new NotFoundException('Conta não encontrada');
    }

    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      throw new BadRequestException('Senha Inválida');
    }

    if (user.balance < amount) {
      throw new BadRequestException('Saldo insuficiente para realizar o saque');
    }

    user.balance -= amount;
    user.transactions.push({
      type: 'saque',
      amount,
      date: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    });

    return this.usersService.updateProfile(accountNumber, user);
  }

  async deposit(
    accountNumber: string,
    password: string,
    amount: number,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOne(accountNumber);

      if (!user) {
        throw new NotFoundException('Conta não encontrada');
      }

      const pass = await bcrypt.compare(password, user.password);

      if (!pass) {
        throw new BadRequestException('Senha Inválida');
      }

      user.transactions.push({
        type: 'deposito',
        amount,
        date: new Date(8.64e15).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
        }),
      });

      user.balance += amount;

      await this.usersService.updateProfile(accountNumber, user);

      return user;
    } catch (error) {
      console.error('Erro durante o depósito:', error);
      throw error;
    }
  }

  async deleteUserByAccountNumber(accountNumber: string, password: string) {
    try {
      const user = await this.usersService.findOne(accountNumber);

      if (!user) {
        throw new NotFoundException('Conta não encontrada');
      }

      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new BadRequestException('Senha Inválida');
      }

      await this.usersService.deleteByAccountNumber(accountNumber, password);

    } catch (error) {
      console.error('Erro durante a exclusão do usuário:', error);
      throw error;
    }
  }
}
