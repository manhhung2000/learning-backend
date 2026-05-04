import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { CacheServiceModule } from '@common/services/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Course]), CacheServiceModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
