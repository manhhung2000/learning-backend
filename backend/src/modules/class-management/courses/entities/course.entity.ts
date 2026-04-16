import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@modules/user-management/users/entities/user.entity';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @Column({ name: 'subject_name' })
  subjectName: string;

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

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Class, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
