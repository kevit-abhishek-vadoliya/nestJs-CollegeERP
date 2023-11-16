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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/user/enums/roles';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  //creates new department in DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  //lists all departments in DB
  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  //finds one department by ID
  @Role(Roles.Admin, Roles.Faculty)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  //updates a department
  @Role(Roles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  //deletes a department from DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
