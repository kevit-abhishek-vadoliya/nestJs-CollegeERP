import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/signIn-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/user')
  @HttpCode(200)
  signInUser(@Body() body: SignInUserDto) {
    return this.authService.signInUser(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Post('/user/logout')
  signOutUser(@Req() req: Request) {
    return this.authService.signOutUser(req);
  }

  @Post('/student')
  @HttpCode(200)
  signInStudent(@Body() body: SignInUserDto) {
    return this.authService.signInStudent(body.email, body.password);
  }

  @UseGuards(AuthGuard)
  @Post('/student/logout')
  signOutStudent(@Req() req) {
    return this.authService.signOutStudent(req);
  }
}
