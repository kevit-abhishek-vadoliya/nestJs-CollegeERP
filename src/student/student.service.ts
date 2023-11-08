import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './student.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = await this.studentModel.create(createStudentDto);
      return student;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const students = await this.studentModel.find();
      return students;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findOne(id: string) {
    try {
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return student;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new NotFoundException('Student Not Found');
      }
      Object.assign(student, updateStudentDto);
      return student.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  remove(id: string) {
    try {
      const student = this.studentModel.findByIdAndDelete(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return student;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
