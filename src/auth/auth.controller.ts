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

  //Does the sign in for user
  @Post('/user')
  @HttpCode(200)
  signInUser(@Body() body: SignInUserDto) {
    return this.authService.signInUser(body.email, body.password);
  }

  //Does the sign out for user
  @UseGuards(AuthGuard)
  @Post('/user/logout')
  signOutUser(@Req() req) {
    return this.authService.signOutUser(req);
  }

  //Does the sign in for student
  @Post('/student')
  @HttpCode(200)
  signInStudent(@Body() body: SignInUserDto) {
    return this.authService.signInStudent(body.email, body.password);
  }

  //Does the sign out for the user
  @UseGuards(AuthGuard)
  @Post('/student/logout')
  signOutStudent(@Req() req) {
    return this.authService.signOutStudent(req);
  }
}
