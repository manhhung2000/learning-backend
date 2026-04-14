import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  UserRole,
} from '@modules/user-management/users/entities/user.entity';
import { CreateUserDto } from '@modules/user-management/users/dto/create-user.dto';
import { UpdateUserDto } from '@modules/user-management/users/dto/update-user.dto';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '@common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllWithPagination(
    paginationQuery: PaginationQueryDto,
    role?: UserRole,
  ): Promise<PaginatedResult<User>> {
    const { page = 1, pageSize = 10, search } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(pageSize)
      .orderBy('user.id', 'DESC');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    if (search) {
      const searchCondition =
        '(user.name ILIKE :search OR user.email ILIKE :search)';
      if (role) {
        queryBuilder.andWhere(searchCondition, { search: `%${search}%` });
      } else {
        queryBuilder.where(searchCondition, { search: `%${search}%` });
      }
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      currentPage: page,
      pageSize: pageSize,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
