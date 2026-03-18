import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  create(createClassDto: CreateClassDto): Promise<Class> {
    const cls = this.classRepository.create(createClassDto);
    return this.classRepository.save(cls);
  }

  findAll(): Promise<Class[]> {
    return this.classRepository.find({ relations: ['students'] });
  }

  async findOne(id: number): Promise<Class> {
    const cls = await this.classRepository.findOne({
      where: { id },
      relations: ['students'],
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

  async addStudent(classId: number, studentId: number): Promise<Class> {
    const cls = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['students'],
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

    // Check if student is already enrolled
    const isEnrolled = cls.students.some((s) => s.id === studentId);
    if (!isEnrolled) {
      cls.students.push(student);
      await this.classRepository.save(cls);
    }

    return cls;
  }
}
