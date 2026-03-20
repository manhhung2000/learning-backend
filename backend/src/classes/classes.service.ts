import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Student } from '../students/entities/student.entity';
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
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private enrollmentsService: EnrollmentsService,
  ) {}

  create(createClassDto: CreateClassDto): Promise<Class> {
    const cls = this.classRepository.create(createClassDto);
    return this.classRepository.save(cls);
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.classRepository.find();
    // Fetch students for each class through Enrollment
    for (const cls of classes) {
      const enrollments = await this.enrollmentRepository.find({
        where: { classId: cls.id, status: EnrollmentStatus.ACTIVE },
        relations: ['student'],
      });
      cls.students = enrollments.map((e) => e.student);
    }
    return classes;
  }

  async findOne(id: number): Promise<Class> {
    const cls = await this.classRepository.findOne({
      where: { id },
    });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    // Fetch students through Enrollment
    const enrollments = await this.enrollmentRepository.find({
      where: { classId: cls.id, status: EnrollmentStatus.ACTIVE },
      relations: ['student'],
    });
    cls.students = enrollments.map((e) => e.student);
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

  async addStudent(classId: number, studentId: number): Promise<Class> {
    const cls = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Use EnrollmentsService to enroll student
    try {
      await this.enrollmentsService.create({
        studentId,
        classId,
      });
    } catch (error) {
      // If already enrolled, ignore the error
      if (error instanceof ConflictException) {
        return cls;
      }
      throw error;
    }

    return cls;
  }

  async getStudents(classId: number): Promise<Student[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: { classId, status: EnrollmentStatus.ACTIVE },
      relations: ['student'],
    });
    return enrollments.map((e) => e.student);
  }
}
