import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  specialization: string;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];
}
