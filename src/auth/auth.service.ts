import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class AuthService {
  constructor(
    private studentService: StudentService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signInUser(email: string, pass: string) {
    const user = await this.userService.findByMail(email);

    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({
      _id: user._id,
      email: user.email,
    });

    user.authToken = token;
    await user.save();
    return user;
  }

  async signOutUser(req) {
    const user = await this.userService.findOne(req.user._id);
    user.authToken = '';
    await user.save();
    return 'Logout Successfull';
  }

  async signInStudent(email: string, pass: string) {
    const student = await this.studentService.findByMail(email);

    const match = await bcrypt.compare(pass, student.password);
    if (!match) {
      return new UnauthorizedException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({
      _id: student._id,
      email: student.email,
    });

    student.authToken = token;
    await student.save();
    return student;
  }
  async signOutStudent(req) {
    const student = await this.studentService.findOne(req.user._id);
    student.authToken = '';
    await student.save();
    return 'Logout Successfull';
  }
}
