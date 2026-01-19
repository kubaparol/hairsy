import { Injectable } from '@nestjs/common';
import type { SignInResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  signIn(): SignInResponseDto {
    return {
      access_token: 'access-token',
    };
  }
}
