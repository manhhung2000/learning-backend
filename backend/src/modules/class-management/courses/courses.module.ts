import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { User } from '@modules/user-management/users/entities/user.entity';
import { Class } from '@modules/class-management/classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User, Class])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
