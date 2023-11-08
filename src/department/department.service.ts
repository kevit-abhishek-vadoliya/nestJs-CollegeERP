import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from './department.schema';
import { Model } from 'mongoose';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.departmentModel.create(createDepartmentDto);
      return department;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findAll() {
    try {
      const departments = await this.departmentModel.find();
      return departments;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findOne(id: string) {
    try {
      const department = await this.departmentModel.findById(id);
      if (!department) {
        throw new NotFoundException('department not found');
      }
      return department;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try {
      const department = await this.departmentModel.findById(id);
      if (!department) {
        throw new NotFoundException('Department Not Found');
      }
      Object.assign(department, updateDepartmentDto);
      return department.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async remove(id: string) {
    try {
      const department = this.departmentModel.findByIdAndDelete(id);
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      return department;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
