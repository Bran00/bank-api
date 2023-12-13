import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return a welcome message', () => {
 
      const result = appService.getHello();

      expect(result).toBe('Seja Bem Vindo ao Banco da Gente');
    });
  });
});
