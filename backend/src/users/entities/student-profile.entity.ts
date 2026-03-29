import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class StudentProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  age: number;

  @OneToOne(() => User, (user) => user.studentProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;
}
