import {
  Controller,
  Post,
  Body,
  Res,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from './guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

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
@ApiTags('Autenticação')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Começar sessão do usuário no sistema' })
  @ApiResponse({ status: 200, description: 'Sessão iniciada com sucesso' })
  @ApiResponse({ status: 400, description: 'Falha ao Login do Usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string' },
        password: { type: 'string' },
      },
      example: { accountNumber: 'your account number', password: 'your password' },
    },
  })
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

  @Get('profile/:accountNumber/:password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Receber informações da conta' })
  @ApiResponse({ status: 200, description: 'Sucesso ao encontrar a conta' })
  @ApiResponse({ status: 400, description: 'Falha ao encontrar a conta' })
  @ApiParam({ name: 'accountNumber', type: String })
  @ApiParam({ name: 'password', type: String })
  async getUserByAccountNumber(
    @Param('accountNumber') accountNumber: string,
    @Param('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.getUserByAccountNumber(
        accountNumber,
        password,
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
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string' },
        password: { type: 'string' },
        kindAccount: {type: 'string'},
        username: {type: 'string'},
      },
      example: { accountNumber: 'your number account', password: 'your password', kindAccount: 'savings ou current', username: 'your username' },
    },
  })
  @ApiOperation({ summary: 'Atualizar informações do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar o usuário' })
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer saque na conta' })
  @ApiResponse({ status: 200, description: 'Sucesso com a transação' })
  @ApiResponse({ status: 400, description: 'Falha com a transação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string' },
        password: { type: 'string' },
        amount: { type: 'number' },
      },
      example: { accountNumber: 'your account number', password: 'your password', amount: 0 },
    },
  })
  async withdraw(
    @Body() body: { accountNumber: string; password: string; amount: number },
  ) {
    return this.authService.withdraw(
      body.accountNumber,
      body.password,
      body.amount,
    );
  }

  @Put('deposit')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer depósito na conta' })
  @ApiResponse({ status: 200, description: 'Sucesso na transação' })
  @ApiResponse({ status: 400, description: 'Falha na transação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string' },
        password: { type: 'string' },
        amount: { type: 'number' },
      },
      example: { accountNumber: 'your account number', password: 'your password', amount: 0 },
    },
  })
  async deposit(
    @Body() body: { accountNumber: string; password: string; amount: number },
  ) {
    return this.authService.deposit(
      body.accountNumber,
      body.password,
      body.amount,
    );
  }

  @Delete('/delete')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Apagar a conta' })
  @ApiResponse({ status: 200, description: 'Conta apagada com sucesso!' })
  @ApiResponse({ status: 400, description: 'Falha ao apagar a conta!' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountNumber: { type: 'string' },
        password: { type: 'string' },
       
      },
      example: { accountNumber: 'your account number', password: 'your password'},
    },
  })

  async deleteUserByAccountNumber(
    @Body() body: { accountNumber: string; password: string; amount: number },
    @Res() res: Response,
  ) {
    try {
      await this.authService.deleteUserByAccountNumber(
        body.accountNumber,
        body.password
      );
      return res.json({ message: 'Conta apagada com sucesso' });
    } catch (error) {
      console.error('Erro durante a exclusão do usuário:', error);
      throw error;
    }
  }
}
