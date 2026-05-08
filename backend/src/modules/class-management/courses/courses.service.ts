import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CacheService } from '@common/services/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '@common/dto/pagination.dto';
import { S3Service } from '@modules/storage/s3.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    private cacheService: CacheService,
    private s3Service: S3Service,
  ) {}

  async create(createDto: CreateCourseDto): Promise<Course> {
    const cls = await this.classRepository.findOne({
      where: { id: createDto.classId },
    });
    if (!cls) {
      throw new NotFoundException(
        `Class with ID ${createDto.classId} not found`,
      );
    }

    const existing = await this.courseRepository.findOne({
      where: {
        cognitoId: createDto.cognitoId,
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
    return this.courseRepository.find({ relations: ['class'] });
  }

  async findAllWithPagination(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Course>> {
    const { page = 1, pageSize = 10, search } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereCondition: Record<string, unknown> = {};
    if (search) whereCondition.subjectName = Like(`%${search}%`);

    const [data, total] = await this.courseRepository.findAndCount({
      where: whereCondition,
      relations: ['class'],
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

  async findOne(id: number): Promise<Course> {
    return this.cacheService.getOrSet(`course:${id}`, async () => {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['class'],
      });
      if (!course)
        throw new NotFoundException(`Course with ID ${id} not found`);
      return course;
    });
  }

  async findByClass(classId: number): Promise<Course[]> {
    return this.courseRepository.find({ where: { classId } });
  }

  async findByCognitoId(cognitoId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: { cognitoId },
      relations: ['class'],
    });
  }

  async update(id: number, updateDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateDto);
    const updated = await this.courseRepository.save(course);
    await this.cacheService.del(`course:${id}`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
    await this.cacheService.del(`course:${id}`);
  }

  async uploadThumbnail(id: number, file: Express.Multer.File): Promise<{ thumbnailUrl: string }> {
    const course = await this.findOne(id);

    if (course.thumbnailKey) {
      await this.s3Service.delete(course.thumbnailKey);
    }

    const key = await this.s3Service.upload(file, 'thumbnails');
    await this.courseRepository.update(id, { thumbnailKey: key });
    await this.cacheService.del(`course:${id}`);

    const thumbnailUrl = await this.s3Service.getPresignedUrl(key);
    return { thumbnailUrl };
  }
}
