import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../decorators/roles.decorator';
import { Roles } from './enums/roles';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //creates new user in DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  //lists all users in DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  //finds one user using ID
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUser(id);
  }

  //updates a user in DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  //removes a user from DB
  @Role(Roles.Admin)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
