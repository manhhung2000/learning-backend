import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Teacher, Subject, Class])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
