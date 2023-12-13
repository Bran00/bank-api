import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type Transaction = {
  type: string;
  amount: number;
  date: string;
};

export type User = {
  username: string;
  password: string;
  balance: number;
  agency?: number;
  kindAccount?: string;
  accountNumber?: string;
  creationDate?: string;
  lastUpdatedDate?: string;
  transactions?: Transaction[];
};

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findOne(numberAccountReceived: string) {
    const userFound = await this.userModel
      .findOne({ accountNumber: numberAccountReceived })
      .exec();
    return userFound;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    let accountNumber: string;
    do {
      accountNumber = (10000 + Math.floor(Math.random() * 90000)).toString();
    } while (await this.userModel.findOne({ accountNumber }).exec());

    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
      accountNumber,
      creationDate: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
      lastUpdatedDate: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    });

    const userCreated = createdUser.save();
    return userCreated;
  }

  async updateProfile(
    accountNumber: string,
    updatedData: Partial<User>,
  ): Promise<User> {
    try {
      let user = await this.userModel.findOne({ accountNumber }).exec();
      if (!user) {
        throw new NotFoundException('Conta não encontrada');
      }

      if (!updatedData || Object.keys(updatedData).length === 0) {
        throw new BadRequestException(
          'Dados atualizados são obrigatórios para a atualização',
        );
      }

      if (updatedData.username !== undefined) {
        user.username = updatedData.username;
      }

      if (updatedData.agency !== undefined) {
        user.agency = updatedData.agency;
      }
      if (updatedData.kindAccount !== undefined) {
        user.kindAccount = updatedData.kindAccount;
      }
      if (updatedData.balance !== undefined) {
        user.balance = updatedData.balance;
      }

      user.lastUpdatedDate = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      user = Object.assign(user, updatedData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Erro durante a atualização do usuário:', error);
      throw error;
    }
  }

  async deleteByAccountNumber(
    accountNumber: string,
    password: string,
  ): Promise<void> {
    try {
      const user = await this.userModel.findOne({ accountNumber }).exec();

      if (!user) {
        throw new NotFoundException('Conta não encontrada');
      }

      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new BadRequestException('Senha Inválida');
      }

      return await this.userModel.findOneAndDelete({ accountNumber})
    } catch (error) {
      console.error('Erro durante a exclusão do usuário:', error);
      throw error;
    }
  }
}
