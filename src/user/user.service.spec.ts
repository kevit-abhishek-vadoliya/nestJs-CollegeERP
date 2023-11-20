import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
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
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create new user and return that', async () => {
    const dto = {
      department: 'CE',
      name: 'Alex',
      email: 'abc@gmail.com',
      password: '1234abcd',
      role: 'Faculty',
    };
    expect(await service.createUser(dto)).toEqual({
      id: '1234',
      ...dto,
    });
  });

  it('should find all users in the database', () => {
    expect(service.findAllUsers()).toEqual(expect.any(Object));
  });

  it('should find One user in the database', () => {
    expect(service.findOneUser('13246')).toEqual(expect.any(Object));
  });

  it('should delete a user from data', () => {
    expect(service.removeUser('1234')).toEqual(expect.any(String));
  });
});
