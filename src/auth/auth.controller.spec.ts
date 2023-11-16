import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockStudentService = {};
  const mockJwtService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [StudentService, AuthService, JwtService, UserService],
    })
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
