// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://brandorocha00:rv2mWMjqE7NqSXR4@clusterbank.znvdhe5.mongodb.net/?retryWrites=true&w=majority', 
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
