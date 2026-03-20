import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Class } from '../../classes/entities/class.entity';

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

  @Column({ name: 'class_id' })
  classId: number;

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

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE', // Xóa enrollment khi xóa student
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Class, (cls) => cls.enrollments, {
    onDelete: 'CASCADE', // Xóa enrollment khi xóa class
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
