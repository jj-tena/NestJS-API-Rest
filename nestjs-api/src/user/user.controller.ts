import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '.prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private UserService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.UserService.editUser(userId, dto);
  }
}
