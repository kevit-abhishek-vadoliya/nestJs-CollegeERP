import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockAttendanceService = {
    addAttendance: jest.fn((attendanceDto) => {
      attendanceDto;
      return true;
    }),
  };
  const mockStudentService = {
    // eslint-disable-next-line
    listAbsentStudents: jest.fn((date, batchYear, department) => []),
    listLessAttendanceStudents: jest.fn(
      // eslint-disable-next-line
      (batchYear, department, semester) => [],
    ),
    getYearlyAnalysis: jest.fn(() => []),
    // eslint-disable-next-line
    getVacantSeats: jest.fn((batchYear, department) => []),
  };
  const mockJwtService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [AttendanceService, StudentService, JwtService, UserService],
    })
      .overrideProvider(AttendanceService)
      .useValue(mockAttendanceService)
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add attendance', () => {
    const attendanceDto = {
      studentId: '123245',
      date: '12/12/12',
      present: true,
    };
    expect(controller.addAttendance([attendanceDto])).toBe(true);
  });

  it('should list absent students', () => {
    expect(controller.listAbsentStudents({ date: '12/12/12' })).toEqual(
      expect.any(Array),
    );
  });

  it('should list less attendance students', () => {
    expect(controller.listLessAttendanceStudents({})).toEqual(
      expect.any(Array),
    );
  });

  it('should get yearly seats analysis', () => {
    expect(controller.getYearlyAnalysis()).toEqual(expect.any(Array));
  });

  it('should get vacant seats', () => {
    expect(controller.getVacantSeats({ batchYear: 2021 })).toEqual(
      expect.any(Array),
    );
  });
});
