import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import { CacheServiceModule } from '@common/services/cache.module';
import { S3Module } from '@modules/storage/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Class]),
    CacheServiceModule,
    S3Module,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
