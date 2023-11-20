import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentController', () => {
  let controller: StudentController;

  const mockStudentService = {
    createStudent: jest.fn(async (dto: CreateStudentDto) => ({
      id: Date.now(),
      ...dto,
    })),
    findAllStudents: jest.fn(async () => {
      return [];
    }),
    // eslint-disable-next-line
    findOneStudent: jest.fn(async (id) => {
      return {};
    }),
    updateStudent: jest.fn(async (id: string, updateDto: UpdateStudentDto) => {
      return {
        id,
        ...updateDto,
      };
    }),
    // eslint-disable-next-line
    removeStudent: jest.fn(async (id: string) => {
      return {};
    }),
  };
  const mockJwtService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [StudentService, JwtService, UserService],
    })
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new student', async () => {
    const createDto: CreateStudentDto = {
      department: 'CE',
      name: 'Alex',
      contactNo: 323232323,
      email: 'abc@gmail.com',
      password: '1234abcd',
      semester: 7,
      batchYear: 2021,
    };

    const expectedResult = {
      id: expect.any(Number),
      ...createDto,
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(expectedResult);
    expect(mockStudentService.createStudent).toHaveBeenCalledWith(createDto);
  });

  it('should find all students', async () => {
    const expectedResult = expect.any(Array);

    const result = await controller.findAll();

    expect(result).toEqual(expectedResult);
  });

  it('should find one student', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(expect.any(Object));
  });

  it('should delete a student', async () => {
    const result = await controller.remove('1234');
    expect(result).toEqual(expect.any(Object));
  });

  it('should update a student', async () => {
    const updateDto: UpdateStudentDto = {
      department: 'Computer Engineering',
    };
    const id = '1234';

    const expectedResult = {
      id: expect.any(String),
      ...updateDto,
    };

    const result = await controller.update(id, updateDto);

    expect(result).toEqual(expectedResult);
    expect(mockStudentService.updateStudent).toHaveBeenCalledWith(
      id,
      updateDto,
    );
  });
});
