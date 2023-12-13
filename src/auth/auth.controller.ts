// auth.controller.ts

import {
  Controller,
  Post,
  Body,
  Res,
  Put,
  Delete,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './guards/jwt.guard';

interface UserRequest extends Request {
  user: {
    username: string;
    password: string;
    balance: number;
    accountNumber?: string;
    creationDate?: string;
    lastUpdatedDate?: string;
  };
}
 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginByAccountNumberAndPassword(
    @Body() body: { accountNumber: string; password: string },
    @Res() res: Response,
  ) {
    const accessToken = await this.authService.signIn(
      body.accountNumber,
      body.password,
    );
    return res.json({ accountToken: accessToken });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getUserByAccountNumber(
    @Body() body: { accountNumber: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.getUserByAccountNumber(
        body.accountNumber,
        body.password,
      );
      return res.json({ user });
    } catch (error) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado.', error });
    }
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async updateAccountByAccountNumber(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: UserRequest,
  ) {
    try {
      const updatedUser = await this.authService.updateUser(req.user, body);
      return res.json({ account: updatedUser });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Erro ao atualizar o usuário.', error });
    }
  }

  @Put('withdraw')
  async withdraw(
    @Body() body: { accountNumber: string;  password: string; amount: number },
  ) {
    return this.authService.withdraw(body.accountNumber, body.password, body.amount);
  }

  @Put('deposit')
  async deposit(
    @Body() body: { accountNumber: string; password: string; amount: number },
  ) {
    return this.authService.deposit(body.accountNumber, body.password, body.amount);
  }

  @Delete('/delete')
  async deleteUserByAccountNumber(
    @Body() body: { accountNumber: string; password: string; amount: number },
    @Res() res: Response,
  ) {
    try {
      await this.authService.withdraw(
        body.accountNumber,
        body.password,
        body.amount
      );
      return res.json({ message: 'Conta apagada com sucesso' });
    } catch (error) {
      console.error('Erro durante a exclusão do usuário:', error);
      throw error;
    }
  }
}
