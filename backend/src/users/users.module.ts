import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TeacherProfile } from './entities/teacher-profile.entity';
import { StudentProfile } from './entities/student-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeacherProfile, StudentProfile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
