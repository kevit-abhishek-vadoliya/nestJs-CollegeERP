import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { Department } from './department.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('DepartmentService', () => {
  let service: DepartmentService;

  const mockDepartmentModel = {
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
        DepartmentService,
        {
          provide: getModelToken(Department.name),
          useValue: mockDepartmentModel,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new department and return that', async () => {
    const dto = {
      department: 'CE',
      initial: 'CE',
      totalStudentsIntake: 120,
    };
    expect(await service.createDepartment(dto)).toEqual({
      id: '1234',
      ...dto,
    });
  });

  it('should find all departments in the database', () => {
    expect(service.findAllDepartments()).toEqual(expect.any(Object));
  });

  it('should find One department in the database', () => {
    expect(service.findOneDepartment('13246')).toEqual(expect.any(Object));
  });

  it('should delete a department from data', () => {
    expect(service.removeDepartment('1234')).toEqual(expect.any(Object));
  });
});
