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
import { Student } from '../students/entities/student.entity';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    // Verify student exists
    const student = await this.studentRepository.findOne({
      where: { id: createEnrollmentDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createEnrollmentDto.studentId} not found`,
      );
    }

    // Verify class exists
    const cls = await this.classRepository.findOne({
      where: { id: createEnrollmentDto.classId },
    });
    if (!cls) {
      throw new NotFoundException(
        `Class with ID ${createEnrollmentDto.classId} not found`,
      );
    }

    // Check if enrollment already exists
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        studentId: createEnrollmentDto.studentId,
        classId: createEnrollmentDto.classId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException(
        `Student ${createEnrollmentDto.studentId} is already enrolled in class ${createEnrollmentDto.classId}`,
      );
    }

    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
    return this.enrollmentRepository.save(enrollment);
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      relations: ['student', 'class'],
    });
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['student', 'class'],
    });
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async findByClass(classId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { classId },
      relations: ['student'],
    });
  }

  async findByStudent(studentId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({
      where: { studentId },
      relations: ['class'],
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
