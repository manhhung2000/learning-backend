import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
