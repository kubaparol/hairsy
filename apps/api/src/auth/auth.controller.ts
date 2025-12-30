import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignInResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(): SignInResponseDto {
    return this.authService.signIn();
  }
}
