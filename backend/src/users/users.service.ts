import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { StudentProfile } from './entities/student-profile.entity';
import {
  CreateUserDto,
  CreateTeacherDto,
  CreateStudentDto,
} from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TeacherProfile)
    private teacherProfileRepository: Repository<TeacherProfile>,
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<User> {
    const { email, password, name, phone, specialization } = createTeacherDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with TEACHER role
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.TEACHER,
    });

    const savedUser = await this.userRepository.save(user);

    // Create teacher profile
    const teacherProfile = this.teacherProfileRepository.create({
      userId: savedUser.id,
      phone,
      specialization,
    });

    await this.teacherProfileRepository.save(teacherProfile);

    return savedUser;
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<User> {
    const { email, password, name, age } = createStudentDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with STUDENT role
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.STUDENT,
    });

    const savedUser = await this.userRepository.save(user);

    // Create student profile
    const studentProfile = this.studentProfileRepository.create({
      userId: savedUser.id,
      age,
    });

    await this.studentProfileRepository.save(studentProfile);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['teacherProfile', 'studentProfile'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['teacherProfile', 'studentProfile'],
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
