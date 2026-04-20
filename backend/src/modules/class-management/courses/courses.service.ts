import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from '@modules/user-management/users/entities/user.entity';
import { UserRole } from '@modules/user-management/users/entities/user.entity';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '@common/dto/pagination.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createDto: CreateCourseDto): Promise<Course> {
    // Verify teacher exists and has TEACHER role
    const teacher = await this.userRepository.findOne({
      where: { id: createDto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(
        `User with ID ${createDto.teacherId} not found`,
      );
    }
    if (teacher.role !== UserRole.TEACHER) {
      throw new ConflictException(
        `User with ID ${createDto.teacherId} is not a teacher`,
      );
    }

    // Verify class exists
    const cls = await this.classRepository.findOne({
      where: { id: createDto.classId },
    });
    if (!cls) {
      throw new NotFoundException(
        `Class with ID ${createDto.classId} not found`,
      );
    }

    // Check if course already exists
    const existing = await this.courseRepository.findOne({
      where: {
        teacherId: createDto.teacherId,
        subjectName: createDto.subjectName,
        classId: createDto.classId,
        academicYear: createDto.academicYear,
        semester: createDto.semester,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Course already exists for this teacher, subject, class, and semester`,
      );
    }

    const course = this.courseRepository.create(createDto);
    return this.courseRepository.save(course);
  }

  findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['teacher', 'class'],
    });
  }

  async findAllWithPagination(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Course>> {
    const { page = 1, pageSize = 10, search } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereCondition: Record<string, unknown> = {};
    if (search) {
      whereCondition.subjectName = Like(`%${search}%`);
    }

    const [data, total] = await this.courseRepository.findAndCount({
      where: whereCondition,
      relations: ['teacher', 'class'],
      skip,
      take: pageSize,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      currentPage: page,
      pageSize: pageSize,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher', 'class'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findByClass(classId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { classId },
      relations: ['teacher'],
    });
  }

  async findByTeacher(teacherId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { teacherId },
      relations: ['class'],
    });
  }

  async update(id: number, updateDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateDto);
    return this.courseRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }
}
