import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from './student.schema';

describe('StudentService', () => {
  let service: StudentService;

  const mockStudentModel = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        id: '1234',
        ...dto,
      };
    }),
    find: jest.fn().mockImplementation(),
    findById: jest.fn().mockImplementation((id) => id),
    findByIdAndDelete: jest.fn().mockImplementation((id) => id),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create new student and return that', async () => {
    const dto = {
      department: 'CE',
      name: 'Alex',
      contactNo: 323232323,
      email: 'abc@gmail.com',
      password: '1234abcd',
      semester: 7,
      batchYear: 2021,
    };
    expect(await service.createStudent(dto)).toEqual({
      id: '1234',
      ...dto,
    });
  });

  it('should find all students in the database', () => {
    expect(service.findAllStudents()).toEqual(expect.any(Object));
  });

  it('should find One student in the database', () => {
    expect(service.findOneStudent('13246')).toEqual(expect.any(Object));
  });

  it('should delete a student from data', () => {
    expect(service.removeStudent('1234')).toEqual(expect.any(String));
  });
});
