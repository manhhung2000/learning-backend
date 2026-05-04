import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';
import { EnrollmentsModule } from '@modules/class-management/enrollments/enrollments.module';
import { CacheServiceModule } from '@common/services/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Course, Enrollment]),
    EnrollmentsModule,
    CacheServiceModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
