import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(createUserDto);
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async findByMail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      Object.assign(user, updateUserDto);
      return user.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  remove(id: string) {
    try {
      const user = this.userModel.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
