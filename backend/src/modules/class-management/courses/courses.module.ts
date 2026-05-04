import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import { CacheServiceModule } from '@common/services/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Class]), CacheServiceModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
