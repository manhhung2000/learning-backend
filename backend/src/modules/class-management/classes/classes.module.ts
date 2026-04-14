import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { User } from '@modules/user-management/users/entities/user.entity';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';
import { EnrollmentsModule } from '@modules/class-management/enrollments/enrollments.module';
import { CoursesModule } from '@modules/class-management/courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, User, Course, Enrollment]),
    EnrollmentsModule,
    CoursesModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
