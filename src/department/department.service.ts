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

  /**
   * creates new department in database
   * @param createDepartmentDto object for creating department
   * @returns object of created department
   */
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.departmentModel.create(createDepartmentDto);
      return department;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * lists all departments in the database
   * @returns array of all departments
   */
  async findAll() {
    try {
      const departments = await this.departmentModel.find();
      return departments;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * finds an department in DB using Id
   * @param id id of the department you want to find
   * @returns object of the department
   */
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

  /**
   * updates the department using given id
   * @param id id of department you want to find
   * @param updateDepartmentDto object conataining properties you want to update
   * @returns object of updated department
   */
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

  /**
   * deletes a department from the database
   * @param id id of the department you want to delete
   * @returns object of the deleted department
   */
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
