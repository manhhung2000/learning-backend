import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Class } from './entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import {
  Enrollment,
  EnrollmentStatus,
} from '../enrollments/entities/enrollment.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private enrollmentsService: EnrollmentsService,
  ) {}

  create(createClassDto: CreateClassDto): Promise<Class> {
    const cls = this.classRepository.create(createClassDto);
    return this.classRepository.save(cls);
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.classRepository.find({
      relations: ['courses'],
    });
    return classes;
  }

  async findOne(id: number): Promise<Class> {
    const cls = await this.classRepository.findOne({
      where: { id },
      relations: ['courses'],
    });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return cls;
  }

  async update(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);
    Object.assign(cls, updateClassDto);
    return this.classRepository.save(cls);
  }

  async remove(id: number): Promise<void> {
    const cls = await this.findOne(id);
    await this.classRepository.remove(cls);
  }

  async getStudents(classId: number): Promise<Student[]> {
    // Get courses for this class
    const courses = await this.courseRepository.find({
      where: { classId },
    });

    if (courses.length === 0) {
      return [];
    }

    // Get course IDs
    const courseIds = courses.map((c) => c.id);

    // Get enrollments for these courses
    const enrollments = await this.enrollmentRepository.find({
      where: {
        courseId: In(courseIds),
        status: EnrollmentStatus.ACTIVE,
      },
      relations: ['student'],
    });

    return enrollments.map((e) => e.student);
  }
}
