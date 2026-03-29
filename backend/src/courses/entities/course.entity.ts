import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

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
  schedule: Record<string, unknown>;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @ManyToOne(() => User, (user) => user.courses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Subject, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Class, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
