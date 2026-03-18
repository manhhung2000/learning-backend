import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Student, (student) => student.classes)
  students: Student[];
}
