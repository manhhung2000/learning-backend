import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import {
  CreateTeacherDto,
  CreateStudentDto,
} from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register/teacher')
  registerTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.authService.registerTeacher(createTeacherDto);
  }

  @Post('register/student')
  registerStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.authService.registerStudent(createStudentDto);
  }
}
