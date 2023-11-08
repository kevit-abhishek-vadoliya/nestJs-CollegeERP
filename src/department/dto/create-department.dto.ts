import { IsString, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  department: string;

  @IsString()
  initial: string;

  @IsNumber()
  totalStudentsIntake: number;
}
