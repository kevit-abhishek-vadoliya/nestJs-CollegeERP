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
   * @returns {Department} object of created department
   */
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    try {
      const departmentObj =
        await this.departmentModel.create(createDepartmentDto);
      return departmentObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * lists all departments in the database
   * @returns {[Departments]} array of all departments
   */
  async findAllDepartments() {
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
   * @returns {Department} object of the department
   */
  async findOneDepartment(id: string) {
    try {
      const departmentObj = await this.departmentModel.findById(id);
      if (!departmentObj) {
        throw new NotFoundException('department not found');
      }
      return departmentObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * updates the department using given id
   * @param id id of department you want to find
   * @param updateDepartmentDto object containing properties you want to update
   * @returns {Department} object of updated department
   */
  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const departmentObj = await this.departmentModel.findById(id);
      if (!departmentObj) {
        throw new NotFoundException('Department Not Found');
      }
      Object.assign(departmentObj, updateDepartmentDto);
      return departmentObj.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * deletes a department from the database
   * @param id id of the department you want to delete
   * @returns {Department} object of the deleted department
   */
  async removeDepartment(id: string): Promise<Department> {
    try {
      const departmentObj = this.departmentModel.findByIdAndDelete(id);
      if (!departmentObj) {
        throw new NotFoundException('Department not found');
      }
      return departmentObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
