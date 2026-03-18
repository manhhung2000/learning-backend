import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { Student } from '../students/entities/student.entity';

describe('ClassesService', () => {
  let service: ClassesService;

  // Mock repositories
  const mockClassRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockStudentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: getRepositoryToken(Class),
          useValue: mockClassRepository,
        },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
      ],
    }).compile();

    service = module.get<ClassesService>(ClassesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a class', async () => {
      const dto = { name: 'Math', description: 'Mathematics' };
      const cls = { id: 1, ...dto, students: [] };

      mockClassRepository.create.mockReturnValue(cls);
      mockClassRepository.save.mockResolvedValue(cls);

      const result = await service.create(dto);

      expect(mockClassRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(cls);
    });
  });

  describe('findAll', () => {
    it('should return array of classes', async () => {
      const classes = [
        { id: 1, name: 'Math', description: 'Mathematics', students: [] },
        { id: 2, name: 'English', description: 'English', students: [] },
      ];

      mockClassRepository.find.mockResolvedValue(classes);

      const result = await service.findAll();

      expect(mockClassRepository.find).toHaveBeenCalledWith({
        relations: ['students'],
      });
      expect(result).toEqual(classes);
    });
  });

  describe('findOne', () => {
    it('should return a class by id', async () => {
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [],
      };

      mockClassRepository.findOne.mockResolvedValue(cls);

      const result = await service.findOne(1);

      expect(mockClassRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['students'],
      });
      expect(result).toEqual(cls);
    });

    it('should throw NotFoundException if class not found', async () => {
      mockClassRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a class', async () => {
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [],
      };
      const updatedClass = { ...cls, name: 'Math Updated' };

      mockClassRepository.findOne.mockResolvedValue(cls);
      mockClassRepository.save.mockResolvedValue(updatedClass);

      const result = await service.update(1, { name: 'Math Updated' });

      expect(result.name).toBe('Math Updated');
    });
  });

  describe('remove', () => {
    it('should remove a class', async () => {
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [],
      };

      mockClassRepository.findOne.mockResolvedValue(cls);
      mockClassRepository.remove.mockResolvedValue(cls);

      await service.remove(1);

      expect(mockClassRepository.remove).toHaveBeenCalledWith(cls);
    });
  });

  describe('addStudent', () => {
    it('should add student to class', async () => {
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [],
      };
      const student = {
        id: 1,
        name: 'John',
        age: 20,
        email: 'john@test.com',
        classes: [],
      };

      mockClassRepository.findOne.mockResolvedValue(cls);
      mockStudentRepository.findOne.mockResolvedValue(student);
      mockClassRepository.save.mockResolvedValue({
        ...cls,
        students: [student],
      });

      const result = await service.addStudent(1, 1);

      expect(result.students).toContain(student);
    });

    it('should not add duplicate student', async () => {
      const student = {
        id: 1,
        name: 'John',
        age: 20,
        email: 'john@test.com',
        classes: [],
      };
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [student],
      };

      mockClassRepository.findOne.mockResolvedValue(cls);
      mockStudentRepository.findOne.mockResolvedValue(student);

      await service.addStudent(1, 1);

      // save should not be called since student already exists
      expect(mockClassRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if class not found', async () => {
      mockClassRepository.findOne.mockResolvedValue(null);

      await expect(service.addStudent(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if student not found', async () => {
      const cls = {
        id: 1,
        name: 'Math',
        description: 'Mathematics',
        students: [],
      };

      mockClassRepository.findOne.mockResolvedValue(cls);
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(service.addStudent(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
