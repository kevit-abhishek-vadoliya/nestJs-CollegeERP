import { BadRequestException, Injectable } from '@nestjs/common';
import { AddAttendanceDto } from './dto/add-attendance.dto';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly studentService: StudentService) {}

  async addAttendance(addAttendanceDto: [AddAttendanceDto]) {
    try {
      addAttendanceDto.map(async (attendance: AddAttendanceDto) => {
        const student = await this.studentService.findOne(attendance.studentId);
        student.attendance.push({
          date: attendance.date,
          present: attendance.present,
        });
        await student.save();
        return true;
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
