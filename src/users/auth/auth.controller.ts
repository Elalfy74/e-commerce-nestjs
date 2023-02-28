import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Serialize } from '@/common/interceptors';

import { AuthResponseDto, CreateUserDto, LoginDto } from '../dtos';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'The auth user data',
    type: AuthResponseDto,
  })
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The auth user data',
    type: AuthResponseDto,
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
