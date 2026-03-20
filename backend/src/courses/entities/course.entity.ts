import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'academic_year' })
  academicYear: string;

  @Column({ name: 'semester' })
  semester: string;

  @Column({ type: 'jsonb', nullable: true })
  schedule: Record<string, any>;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
    onDelete: 'RESTRICT', // Không cho phép xóa giáo viên nếu đang có course
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Subject, {
    onDelete: 'RESTRICT', // Không cho phép xóa môn học nếu đang được dạy
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Class, {
    onDelete: 'RESTRICT', // Không cho phép xóa lớp học nếu đang có course
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
