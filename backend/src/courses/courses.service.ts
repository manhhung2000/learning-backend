import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createDto: CreateCourseDto): Promise<Course> {
    // Verify teacher exists
    const teacher = await this.teacherRepository.findOne({
      where: { id: createDto.teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${createDto.teacherId} not found`,
      );
    }

    // Verify subject exists
    const subject = await this.subjectRepository.findOne({
      where: { id: createDto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${createDto.subjectId} not found`,
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
        subjectId: createDto.subjectId,
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
      relations: ['teacher', 'subject', 'class'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher', 'subject', 'class'],
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findByClass(classId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { classId },
      relations: ['teacher', 'subject'],
    });
  }

  async findByTeacher(teacherId: number): Promise<Course[]> {
    return this.courseRepository.find({
      where: { teacherId },
      relations: ['subject', 'class'],
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
