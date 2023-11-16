import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { User } from 'src/user/user.schema';
import { Student } from 'src/student/student.schema';

@Injectable()
export class AuthService {
  constructor(
    private studentService: StudentService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * signs in an user
   * @param email email address of the user
   * @param pass password of the user
   * @returns {User} user object of signed in user
   */
  async signInUser(email: string, pass: string): Promise<User> {
    const userObj = await this.userService.findUserByMail(email);

    const match = await bcrypt.compare(pass, userObj.password);
    if (!match) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({
      _id: userObj._id,
      email: userObj.email,
    });

    userObj.authToken = token;
    await userObj.save();
    return userObj;
  }

  /**
   * signs out an user
   * @param req express request
   * @returns string of logout successful
   */
  async signOutUser(req) {
    const userObj = await this.userService.findOneUser(req.user._id);
    userObj.authToken = '';
    await userObj.save();
    return 'Logout Successful';
  }

  /**
   * signs in an user
   * @param email email address of the user
   * @param pass password of the user
   * @returns {Student} user object of signed in user
   */
  async signInStudent(email: string, pass: string): Promise<Student> {
    const studentObj = await this.studentService.findStudentByMail(email);

    const match = await bcrypt.compare(pass, studentObj.password);
    if (!match) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({
      _id: studentObj._id,
      email: studentObj.email,
    });

    studentObj.authToken = token;
    await studentObj.save();
    return studentObj;
  }

  /**
   * signs out an user
   * @param req express request
   * @returns string of logout successful
   */
  async signOutStudent(req) {
    const studentObj = await this.studentService.findOneStudent(req.user._id);
    studentObj.authToken = '';
    await studentObj.save();
    return 'Logout Successful';
  }
}
