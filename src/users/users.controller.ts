import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../common/guards';
import { Serialize } from '../common/interceptors';
import { GetUser } from './decorators';
import { UserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
@Serialize(UserDto)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @ApiOkResponse({
    description: 'The user data',
    type: UserDto,
  })
  findOne(@GetUser() user: { userId: string }) {
    return this.usersService.findOne({
      id: user.userId,
    });
  }
}
