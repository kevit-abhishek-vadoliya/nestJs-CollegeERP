import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { StudentService } from '../student/student.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockStudentService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService,StudentService],
    }).overrideProvider(StudentService).useValue(mockStudentService).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
