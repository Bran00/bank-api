import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

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
    @Body() user: { username: string; password: string; balance: number},
  ): Promise<void> {
    await this.usersService.create(user);
  }
}