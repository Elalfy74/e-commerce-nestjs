import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Serialize } from '../../interceptor';
import { CreateUserDto } from '../dtos';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {}
}
