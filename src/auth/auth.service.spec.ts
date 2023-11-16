import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AttendanceService } from '../attendance/attendance.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockAttendanceService = {}
  const mockStudentService={}
  const mockJwtService={}
  const mockUserService={}
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,StudentService,JwtService,UserService],
    }).overrideProvider(AttendanceService).useValue(mockAttendanceService)
    .overrideProvider(StudentService).useValue(mockStudentService)
    .overrideProvider(JwtService).useValue(mockJwtService)
    .overrideProvider(UserService).useValue(mockUserService)
    .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
