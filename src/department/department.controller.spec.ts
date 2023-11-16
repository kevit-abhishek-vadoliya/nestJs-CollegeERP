import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';

describe('DepartmentController', () => {
  let controller: DepartmentController;

  const mockDepartmentService = {}
  const mockStudentService={}
  const mockJwtService={}
  const mockUserService={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [DepartmentService, JwtService, UserService, StudentService],
    })
    .overrideProvider(DepartmentService).useValue(mockDepartmentService)
    .overrideProvider(StudentService).useValue(mockStudentService)
    .overrideProvider(JwtService).useValue(mockJwtService)
    .overrideProvider(UserService).useValue(mockUserService)
    .compile();

    controller = module.get<DepartmentController>(DepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
