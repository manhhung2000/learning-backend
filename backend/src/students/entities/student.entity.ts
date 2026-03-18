import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';

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

  @ManyToMany(() => Class, (cls) => cls.students)
  @JoinTable({
    name: 'student_class', // Tên bảng trung gian
  })
  classes: Class[];
}
