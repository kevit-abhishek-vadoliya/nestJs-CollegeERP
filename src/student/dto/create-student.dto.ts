import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsNumber()
  contactNo: number;

  @IsString()
  department: string;

  @IsEmail()
  email: string;

  @IsNumber()
  batchYear: number;

  @IsNumber()
  semester: number;

  @IsString()
  password: string;
}
