import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @OneToMany(() => Course, (course: Course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment: Enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
