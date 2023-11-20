import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { StudentService } from '../student/student.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockStudentService = {
    // eslint-disable-next-line
    findOneStudent: jest.fn((id) => {}),
    save: jest.fn(() => {}),
  };
  const mockAttendanceService = {
    // eslint-disable-next-line
    addAttendance: jest.fn((addAttendanceDto) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService, StudentService],
    })
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(AttendanceService)
      .useValue(mockAttendanceService)
      .compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add attendance', () => {
    const attendanceDto = {
      studentId: '123245',
      date: '12/12/12',
      present: true,
    };
    expect(service.addAttendance([attendanceDto])).toBe(true);
  });
});
