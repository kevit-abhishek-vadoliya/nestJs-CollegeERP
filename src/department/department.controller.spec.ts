import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { StudentService } from '../student/student.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentController', () => {
  let controller: DepartmentController;
  const mockDepartmentService = {
    createDepartment: jest.fn(async (dto: CreateDepartmentDto) => ({
      id: Date.now(),
      ...dto,
    })),
    findAllDepartments: jest.fn(async () => {
      return [];
    }),
    // eslint-disable-next-line
    findOneDepartment: jest.fn(async (id) => {
      return {};
    }),
    updateDepartment: jest.fn(
      async (id: string, updateDto: UpdateDepartmentDto) => {
        return {
          id,
          ...updateDto,
        };
      },
    ),
    // eslint-disable-next-line
    removeDepartment: jest.fn(async (id: string) => {
      return {};
    }),
  };
  const mockStudentService = {};
  const mockJwtService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [DepartmentService, JwtService, UserService, StudentService],
    })
      .overrideProvider(DepartmentService)
      .useValue(mockDepartmentService)
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<DepartmentController>(DepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new department', async () => {
    const createDto: CreateDepartmentDto = {
      department: 'CE',
      initial: 'CE',
      totalStudentsIntake: 120,
    };

    const expectedResult = {
      id: expect.any(Number),
      ...createDto,
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(expectedResult);
    expect(mockDepartmentService.createDepartment).toHaveBeenCalledWith(
      createDto,
    );
  });

  it('should find all departments', async () => {
    const expectedResult = expect.any(Array);

    const result = await controller.findAll();

    expect(result).toEqual(expectedResult);
  });

  it('should find one department', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(expect.any(Object));
  });

  it('should delete a department', async () => {
    const result = await controller.remove('1234');
    expect(result).toEqual(expect.any(Object));
  });

  it('should update a department', async () => {
    const updateDto: UpdateDepartmentDto = {
      department: 'Computer Engineering',
      totalStudentsIntake: 180,
    };
    const id = '1234';

    const expectedResult = {
      id: expect.any(String),
      ...updateDto,
    };

    const result = await controller.update(id, updateDto);

    expect(result).toEqual(expectedResult);
    expect(mockDepartmentService.updateDepartment).toHaveBeenCalledWith(
      id,
      updateDto,
    );
  });
});
