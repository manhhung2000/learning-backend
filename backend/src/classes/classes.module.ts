import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, Student, Enrollment]),
    EnrollmentsModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
