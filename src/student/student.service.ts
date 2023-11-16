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

  /**
   * creates new student in database
   * @param createStudentDto object for creating student
   * @returns {Student} object of created student
   */
  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const studentObj = await this.studentModel.create(createStudentDto);
      return studentObj;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * lists all students in the database
   * @returns {[Student]} array of all students
   */
  async findAllStudents() {
    try {
      const students = await this.studentModel.find();
      return students;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * finds one student from DB using id
   * @param id id of student you want to find
   * @returns {Student}object of student
   */
  async findOneStudent(id: string) {
    try {
      const studentObj = await this.studentModel.findById(id);
      if (!studentObj) {
        throw new NotFoundException('Student not found');
      }
      return studentObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * finds a student from DB using email
   * @param email email of the student you want to find
   * @returns {Student} object of student
   */
  async findStudentByMail(email: string) {
    try {
      const studentObj = await this.studentModel.findOne({ email });
      if (!studentObj) {
        throw new NotFoundException('Student not found');
      }
      return studentObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * updates the student using given id
   * @param id id of student you want to find
   * @param updateStudentDto object containing properties you want to update
   * @returns {Student} object of updated student
   */
  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    try {
      const studentObj = await this.studentModel.findById(id);
      if (!studentObj) {
        throw new NotFoundException('Student Not Found');
      }
      Object.assign(studentObj, updateStudentDto);
      return studentObj.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * deletes a student from the database
   * @param id id of the student you want to delete
   * @returns {Student} object of the deleted student
   */
  removeStudent(id: string): Promise<Student> {
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

  /**
   * lists the absent student on particular date
   * @param date date you want to check for
   * @param batchYear (optional) batchYear for filtering
   * @param department (optional) department for filtering
   * @param semester (optional) semester for filtering
   * @returns {[Student]}Array of absent students on that date
   */
  async listAbsentStudents(
    date: string,
    batchYear: number = undefined,
    department: string = undefined,
    semester: number = undefined,
  ) {
    try {
      const stages: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $project: {
            name: 1,
            phone_number: 1,
            batchYear: 1,
            department: '$result.initial',
            attendance: 1,
            semester: 1,
            emailId: 1,
          },
        },
        {
          $match: {
            attendance: {
              date: date,
              present: false,
            },
          },
        },
        {
          $project: {
            name: 1,
            batchYear: 1,
            semester: 1,
            emailId: 1,
            department: 1,
          },
        },
      ];
      if (batchYear) {
        stages.unshift({
          $match: {
            batchYear: batchYear,
          },
        });
      }
      if (department) {
        stages.push({
          $match: {
            department: department,
          },
        });
      }
      if (semester) {
        stages.unshift({
          $match: {
            semester: semester,
          },
        });
      }
      return await this.studentModel.aggregate(stages);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * list all the students with less than 75% attendance
   * @param batchYear (optional) batchYear for filtering
   * @param department (optional) department for filtering
   * @param semester (optional) semester for filtering
   * @returns {[Student]} Array of students with less than 75% attendance
   */
  async listLessAttendanceStudents(
    batchYear = undefined,
    department = undefined,
    semester = undefined,
  ) {
    try {
      const stages: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            department: '$result.initial',
            batchYear: 1,
            semester: 1,
            attendance: 1,
          },
        },
        {
          $unwind: {
            path: '$attendance',
          },
        },
        {
          $group: {
            _id: {
              _id: '$_id',
              name: '$name',
              batchYear: '$batchYear',
              semester: '$semester',
            },
            presentDays: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$attendance.present', true],
                  },
                  1,
                  0,
                ],
              },
            },
            totalDays: {
              $count: {},
            },
            department: {
              $first: '$department',
            },
          },
        },
        {
          $project: {
            _id: '$_id._id',
            name: '$_id.name',
            batchYear: '$_id.batchYear',
            semester: '$_id.semester',
            department: 1,
            attendancePercent: {
              $multiply: [
                {
                  $divide: ['$presentDays', '$totalDays'],
                },
                100,
              ],
            },
          },
        },
        {
          $match: {
            attendancePercent: {
              $lt: 75,
            },
          },
        },
      ];
      if (batchYear) {
        stages.unshift({
          $match: {
            batchYear: batchYear,
          },
        });
      }
      if (department) {
        stages.push({
          $match: {
            department: department,
          },
        });
      }
      if (semester) {
        stages.unshift({
          $match: {
            semester: semester,
          },
        });
      }
      return await this.studentModel.aggregate(stages);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * get year wise analysis of total students in all batches and college
   * @returns Array of yearly analysis of total students batch wise
   */
  async getYearlyAnalysis() {
    try {
      return await this.studentModel.aggregate([
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'result',
          },
        },
        {
          $unwind: {
            path: '$result',
          },
        },
        {
          $project: {
            name: 1,
            phone_number: 1,
            batchYear: 1,
            department: '$result.initial',
          },
        },
        {
          $group: {
            _id: {
              branches: '$department',
              batchYear: '$batchYear',
            },
            totalStudents: {
              $sum: 1,
            },
          },
        },
        {
          $group: {
            _id: '$_id.batchYear',
            branches: {
              $push: {
                branch: '$_id.branches',
                branchStudents: '$totalStudents',
              },
            },
          },
        },
        {
          $project: {
            totalStudents: {
              $reduce: {
                input: '$branches',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.branchStudents'],
                },
              },
            },
            Year: '$_id',
            _id: 0,
            branches: 1,
          },
        },
        {
          $project: {
            branches: {
              $arrayToObject: {
                $map: {
                  input: '$branches',
                  as: 'branch',
                  in: {
                    k: '$$branch.branch',
                    v: '$$branch.branchStudents',
                  },
                },
              },
            },
            Year: 1,
            totalStudents: 1,
          },
        },
      ]);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * get list of year wise vacant seats in all the branches and whole college
   * @param batchYear (optional) for filtering
   * @param branch (optional) for filtering
   * @returns array of year wise vacant seats
   */
  async getVacantSeats(
    batchYear: number = undefined,
    branch: string = undefined,
  ) {
    try {
      const stages: any = [
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'department',
          },
        },
        {
          $unwind: {
            path: '$department',
          },
        },
        {
          $group: {
            _id: {
              batchYear: '$batchYear',
              department: '$department.initial',
            },
            totalStudents: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id.department',
            foreignField: 'initial',
            as: 'department',
          },
        },
        {
          $unwind: {
            path: '$department',
          },
        },
        {
          $group: {
            _id: {
              batchYear: '$_id.batchYear',
            },
            totalStudents: {
              $sum: '$totalStudents',
            },
            departments: {
              $push: {
                department: '$department.initial',
                totalStudents: '$totalStudents',
                totalStudentsIntake: '$department.totalStudentsIntake',
                availableIntake: {
                  $subtract: [
                    '$department.totalStudentsIntake',
                    '$totalStudents',
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            batchYear: '$_id.batchYear',
            _id: 0,
            totalStudents: 1,
            totalStudentsIntake: {
              $reduce: {
                input: '$departments',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.totalStudentsIntake'],
                },
              },
            },
            availableIntake: {
              $reduce: {
                input: '$departments',
                initialValue: 0,
                in: {
                  $add: ['$$value', '$$this.availableIntake'],
                },
              },
            },
            branches: {
              $arrayToObject: {
                $map: {
                  input: '$departments',
                  as: 'branch',
                  in: {
                    k: '$$branch.department',
                    v: {
                      totalStudents: '$$branch.totalStudents',
                      totalStudentsIntake: '$$branch.totalStudentsIntake',
                      availableIntake: '$$branch.availableIntake',
                    },
                  },
                },
              },
            },
          },
        },
      ];

      if (branch) {
        stages.splice(2, 0, {
          $match: {
            'department.initial': branch,
          },
        });
      }
      if (batchYear) {
        stages.unshift({
          $match: {
            batchYear: batchYear,
          },
        });
      }
      return await this.studentModel.aggregate(stages);
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
