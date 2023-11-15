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

  /**
   * creates new user in database
   * @param createUserDto object for creating user
   * @returns object of created user
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(createUserDto);
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * lists all users in the database
   * @returns array of all users
   */
  async findAll() {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * finds an user in DB using Id
   * @param id id of the user you want to find
   * @returns object of the user
   */
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

  /**
   * finds a user from DB using email
   * @param email email of the user you want to find
   * @returns object of the user
   */
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

  /**
   * updates the user using given id
   * @param id id of user you want to find
   * @param updateUserDto object conataining properties you want to update
   * @returns object of updated user
   */
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

  /**
   * deletes a user from the database
   * @param id id of the user you want to delete
   * @returns object of the deleted user
   */
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
