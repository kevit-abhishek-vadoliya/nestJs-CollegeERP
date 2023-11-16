import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { Department } from './department.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('DepartmentService', () => {
  let service: DepartmentService;

  const mockDepartmentModel = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentService,{
        provide: getModelToken(Department.name),
        useValue: mockDepartmentModel
      }],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
