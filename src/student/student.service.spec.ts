import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './student.schema';

describe('StudentService', () => {
  let service: StudentService;

  const mockStudentModel={}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService,{
        provide: getModelToken(Student.name),
        useValue: mockStudentModel
      }],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
