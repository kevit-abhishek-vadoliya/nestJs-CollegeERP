import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/user/enums/roles';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
