import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@modules/user-management/users/entities/user.entity';
import { Course } from '@modules/class-management/courses/entities/course.entity';

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DROPPED = 'dropped',
}

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({
    name: 'enrolled_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enrolledAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Course, (course: Course) => course.enrollments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
