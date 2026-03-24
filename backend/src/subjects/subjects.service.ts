import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import {
  PaginationQueryDto,
  PaginatedResult,
} from '../common/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(subject);
  }

  findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async findAllWithPagination(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Subject>> {
    const { page = 1, pageSize = 10, search } = paginationQuery;
    const skip = (page - 1) * pageSize;

    const whereCondition: Record<string, any> = {};
    if (search) {
      whereCondition.name = Like(`%${search}%`);
    }

    const [data, total] = await this.subjectRepository.findAndCount({
      where: whereCondition,
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

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
  }
}
