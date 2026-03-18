import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';

describe('StudentsService', () => {
  let service: StudentsService;

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a student', async () => {
      const dto = { name: 'John', age: 20, email: 'john@test.com' };
      const student = { id: 1, ...dto, classes: [] };

      mockRepository.create.mockReturnValue(student);
      mockRepository.save.mockResolvedValue(student);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(student);
      expect(result).toEqual(student);
    });
  });

  describe('findAll', () => {
    it('should return array of students', async () => {
      const students = [
        { id: 1, name: 'John', age: 20, email: 'john@test.com', classes: [] },
        { id: 2, name: 'Jane', age: 21, email: 'jane@test.com', classes: [] },
      ];

      mockRepository.find.mockResolvedValue(students);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['classes'],
      });
      expect(result).toEqual(students);
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      const student = {
        id: 1,
        name: 'John',
        age: 20,
        email: 'john@test.com',
        classes: [],
      };

      mockRepository.findOne.mockResolvedValue(student);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['classes'],
      });
      expect(result).toEqual(student);
    });

    it('should throw NotFoundException if student not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const student = {
        id: 1,
        name: 'John',
        age: 20,
        email: 'john@test.com',
        classes: [],
      };
      const updatedStudent = { ...student, name: 'John Updated' };

      mockRepository.findOne.mockResolvedValue(student);
      mockRepository.save.mockResolvedValue(updatedStudent);

      const result = await service.update(1, { name: 'John Updated' });

      expect(result.name).toBe('John Updated');
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const student = {
        id: 1,
        name: 'John',
        age: 20,
        email: 'john@test.com',
        classes: [],
      };

      mockRepository.findOne.mockResolvedValue(student);
      mockRepository.remove.mockResolvedValue(student);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(student);
    });

    it('should throw NotFoundException if student not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
