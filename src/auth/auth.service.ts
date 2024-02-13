import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcrypt';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { password } = registerAuthDto;
    const plainToHash = await hash(password, 10);
    registerAuthDto = { ...registerAuthDto, password: plainToHash };
    return this.userModel.create(registerAuthDto);
  }

  async login(loginUser: LoginAuthDto) {
    const { email } = loginUser;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser)
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    const isPasswordMatch = await compare(
      loginUser.password,
      findUser.password,
    );
    if (!isPasswordMatch)
      throw new HttpException('INVALID_PASSWORD', HttpStatus.UNAUTHORIZED);

    const token = this.jwtService.sign({
      id: findUser._id,
      name: findUser.name,
    });

    const data = {
      user: findUser,
      token: token,
    };
    return data;
  }
}
