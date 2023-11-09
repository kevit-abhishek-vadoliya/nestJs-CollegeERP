import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { StudentModule } from 'src/student/student.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    StudentModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
