import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/user/enums/roles';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddAttendanceDto } from './dto/add-attendance.dto';
import { StudentService } from 'src/student/student.service';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
    private studentService: StudentService,
  ) {}

  //adds attendance of students
  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  addAttendance(@Body() addAttendanceDto: [AddAttendanceDto]) {
    return this.attendanceService.addAttendance(addAttendanceDto);
  }

  //gets all absent students on particular date
  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/absent')
  listAbsentStudents(@Body() body) {
    return this.studentService.listAbsentStudents(
      body.date,
      body.batchYear,
      body.department,
      body.semester,
    );
  }

  //gets students with attendance less than 75%
  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/lessAttendance')
  listLessAttendanceStudents(@Body() body) {
    return this.studentService.listLessAttendanceStudents(
      body.batchYear,
      body.department,
      body.semester,
    );
  }

  //gets year wise analysis of every batch total students and whole college
  @Role(Roles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Get('/yearlyAnalysis')
  getYearlyAnalysis() {
    return this.studentService.getYearlyAnalysis();
  }

  //gets year wise vacant seats for every branch and whole college
  @Role(Roles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(200)
  @Post('/vacantSeats')
  getVacantSeats(@Body() body) {
    return this.studentService.getVacnatSeats(body.batchYear, body.branch);
  }
}
