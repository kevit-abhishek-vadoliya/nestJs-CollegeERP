import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createUser: jest.fn(async (dto: CreateUserDto) => ({
      id: Date.now(),
      ...dto,
    })),
    findAllUsers: jest.fn(async () => {
      return [];
    }),
    // eslint-disable-next-line
    findOneUser: jest.fn(async (id) => {
      return {};
    }),
    updateUser: jest.fn(async (id: string, updateDto: UpdateUserDto) => {
      return {
        id,
        ...updateDto,
      };
    }),
    // eslint-disable-next-line
    removeUser: jest.fn(async (id: string) => {
      return {};
    }),
  };
  const mockStudentService = {};
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, JwtService, StudentService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create new user', async () => {
    const createDto: CreateUserDto = {
      department: 'CE',
      name: 'Alex',
      email: 'abc@gmail.com',
      password: '1234abcd',
      role: 'Faculty',
    };

    const expectedResult = {
      id: expect.any(Number),
      ...createDto,
    };

    const result = await controller.create(createDto);

    expect(result).toEqual(expectedResult);
    expect(mockUserService.createUser).toHaveBeenCalledWith(createDto);
  });

  it('should find all users', async () => {
    const expectedResult = expect.any(Array);

    const result = await controller.findAll();

    expect(result).toEqual(expectedResult);
  });

  it('should find one user', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(expect.any(Object));
  });

  it('should delete a user', async () => {
    const result = await controller.remove('1234');
    expect(result).toEqual(expect.any(Object));
  });

  it('should update a user', async () => {
    const updateDto: UpdateUserDto = {
      department: 'Computer Engineering',
    };
    const id = '1234';

    const expectedResult = {
      id: expect.any(String),
      ...updateDto,
    };

    const result = await controller.update(id, updateDto);

    expect(result).toEqual(expectedResult);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(id, updateDto);
  });
});
