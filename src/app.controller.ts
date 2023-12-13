import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { Response } from 'express';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

export type User = {
  username: string;
  password: string;
  balance: number;
};

@Controller()
@ApiTags('Público')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Receber uma saudação' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  @ApiOperation({ summary: 'Criar uma conta' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string'},
        password: { type: 'string' },
        balance: { type: 'number' },
        kindAccount: { type: 'string' },
        agency: { type: 'string' },
      },
      example: {
        username: 'yourname',
        password: 'your password',
        balance: 0,
        kindAccount: 'savings ou current',
        agency: 'string',
      },
    },
  })
  async register(
    @Body() user: { username: string; password: string; balance: number },
    @Res() res: Response,
  ) {
    const userCreated = await this.usersService.create(user);
    return res.json({ userCreated });
  }
}
