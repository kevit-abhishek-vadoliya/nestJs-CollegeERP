import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Roles } from '../enums/roles';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  department: string;

  @IsEnum(Roles)
  role: string;

  @IsString()
  password: string;
}
