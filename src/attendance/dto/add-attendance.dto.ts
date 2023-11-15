import { IsString, IsBoolean } from 'class-validator';

export class AddAttendanceDto {
  @IsString()
  studentId: string;

  @IsString()
  date: string;

  @IsBoolean()
  present: boolean;
}
