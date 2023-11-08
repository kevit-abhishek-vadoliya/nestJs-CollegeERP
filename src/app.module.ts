import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from './department/department.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URL'),
        };
      },
      inject: [ConfigService],
    }),
    DepartmentModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
