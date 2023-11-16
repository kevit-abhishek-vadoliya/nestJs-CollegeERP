import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from '../student/student.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private studentService: StudentService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    try {
      let user;
      try {
        user = await this.studentService.findOneStudent(decoded._id);
      } catch (err) {
        user = await this.userService.findOneUser(decoded._id);
      }

      if (!user) {
        throw new UnauthorizedException('Please authenticate');
      }
      if (user.authToken == token) {
        request.token = token;
        request.user = user;
      } else {
        throw new UnauthorizedException();
      }
    } catch (err) {
      throw new UnauthorizedException('Please Authenticate');
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
