import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(user: User): string {
    //ADD payload JWT {id user}
    return this.jwtService.sign({ id: user.id });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user: User = await this.usersService.create(signupInput);
    return {
      token: this.getJwtToken(user),
      user,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user: User = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Email / Password do not match`);
    }

    return {
      token: this.getJwtToken(user),
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user: User = await this.usersService.findOneById(id);
    if (!user.isActive)
      throw new UnauthorizedException(`User is Inactive, talk with an admin`);

    delete user.password;

    return user;
  }

  revaliteToken(user: User): AuthResponse {
    const token = this.getJwtToken(user);
    return { token, user };
  }
}
