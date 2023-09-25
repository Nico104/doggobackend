import { Test, TestingModule } from '@nestjs/testing';
import { ContactusController } from './contactus.controller';

describe('ContactusController', () => {
  let controller: ContactusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactusController],
    }).compile();

    controller = module.get<ContactusController>(ContactusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
