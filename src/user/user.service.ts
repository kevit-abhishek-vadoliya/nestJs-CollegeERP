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
   * @returns {User} object of created user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userObj = await this.userModel.create(createUserDto);
      return userObj;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * lists all users in the database
   * @returns {[User]} array of all users
   */
  async findAllUsers() {
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
   * @returns {User} object of the user
   */
  async findOneUser(id: string) {
    try {
      const userObj = await this.userModel.findById(id);
      if (!userObj) {
        throw new NotFoundException('User not found');
      }
      return userObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * finds a user from DB using email
   * @param email email of the user you want to find
   * @returns {User} object of the user
   */
  async findUserByMail(email: string) {
    try {
      const userObj = await this.userModel.findOne({ email });
      if (!userObj) {
        throw new NotFoundException('User not found');
      }
      return userObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * updates the user using given id
   * @param id id of user you want to find
   * @param updateUserDto object containing properties you want to update
   * @returns {User} object of updated user
   */
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userObj = await this.userModel.findById(id);
      if (!userObj) {
        throw new NotFoundException('User Not Found');
      }
      Object.assign(userObj, updateUserDto);
      return userObj.save();
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }

  /**
   * deletes a user from the database
   * @param id id of the user you want to delete
   * @returns {User} object of the deleted user
   */
  removeUser(id: string): Promise<User> {
    try {
      const userObj = this.userModel.findByIdAndDelete(id);
      if (!userObj) {
        throw new NotFoundException('User not found');
      }
      return userObj;
    } catch (err) {
      throw new HttpException(err.response, err.status);
    }
  }
}
