import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockAttendanceService = {}
  const mockStudentService={}
  const mockJwtService={}
  const mockUserService={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [AttendanceService,StudentService,JwtService,UserService]
    }).overrideProvider(AttendanceService).useValue(mockAttendanceService)
    .overrideProvider(StudentService).useValue(mockStudentService)
    .overrideProvider(JwtService).useValue(mockJwtService)
    .overrideProvider(UserService).useValue(mockUserService)
    .compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
