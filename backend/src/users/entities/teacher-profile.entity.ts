import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TeacherProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  specialization: string;

  @OneToOne(() => User, (user) => user.teacherProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;
}
