import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '@common/dto/pagination.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const course = await this.courseRepository.findOne({
      where: { id: createEnrollmentDto.courseId },
    });
    if (!course) {
      throw new NotFoundException(
        `Course with ID ${createEnrollmentDto.courseId} not found`,
      );
    }

    const existing = await this.enrollmentRepository.findOne({
      where: {
        cognitoId: createEnrollmentDto.cognitoId,
        courseId: createEnrollmentDto.courseId,
      },
    });
    if (existing) {
      throw new ConflictException(`Student is already enrolled in this course`);
    }

    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
    return this.enrollmentRepository.save(enrollment);
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ relations: ['course'] });
  }

  async findAllWithPagination(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Enrollment>> {
    const { page = 1, pageSize = 10, search } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereCondition: Record<string, any> = {};
    if (search) {
      whereCondition.status = search as EnrollmentStatus;
    }

    const [data, total] = await this.enrollmentRepository.findAndCount({
      where: whereCondition,
      relations: ['course'],
      skip,
      take: pageSize,
      order: { id: 'DESC' },
    });

    return {
      data,
      total,
      currentPage: page,
      pageSize,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async findByCourse(courseId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ where: { courseId } });
  }

  async findByCognitoId(cognitoId: string): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { cognitoId },
      relations: ['course'],
    });
  }

  async update(
    id: number,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    Object.assign(enrollment, updateEnrollmentDto);
    return this.enrollmentRepository.save(enrollment);
  }

  async remove(id: number): Promise<void> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
  }

  async updateStatus(
    id: number,
    status: EnrollmentStatus,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id);
    enrollment.status = status;
    return this.enrollmentRepository.save(enrollment);
  }
}
