import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.class)
  enrollments: Enrollment[];

  students: Student[];
}
