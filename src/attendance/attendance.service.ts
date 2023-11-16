import { BadRequestException, Injectable } from '@nestjs/common';
import { AddAttendanceDto } from './dto/add-attendance.dto';
import { StudentService } from '../student/student.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly studentService: StudentService) {}

  /**
   * adds attendance of every students
   * @param addAttendanceDto array of attendance objects for every students
   */
  async addAttendance(addAttendanceDto: [AddAttendanceDto]) {
    try {
      addAttendanceDto.map(async (attendance: AddAttendanceDto) => {
        const student = await this.studentService.findOneStudent(
          attendance.studentId,
        );
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
