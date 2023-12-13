import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { Response } from 'express';

export type User = {
  username: string;
  password: string;
  balance: number;
};

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  async register(
    @Body() user: { username: string; password: string; balance: number },
    @Res() res: Response,
  ) {
    const userCreated = await this.usersService.create(user);
    return res.json({ userCreated });
  }
}