import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student.entity';
import { ClassesModule } from './classes/classes.module';
import { Class } from './classes/entities/class.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { Enrollment } from './enrollments/entities/enrollment.entity';
import { SubjectsModule } from './subjects/subjects.module';
import { Subject } from './subjects/entities/subject.entity';
import { TeachersModule } from './teachers/teachers.module';
import { Teacher } from './teachers/entities/teacher.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'school',
      entities: [Student, Class, Enrollment, Subject, Teacher, Course],
      synchronize: true, // Tự động tạo bảng (chỉ dùng dev)
    }),
    StudentsModule,
    ClassesModule,
    EnrollmentsModule,
    SubjectsModule,
    TeachersModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
