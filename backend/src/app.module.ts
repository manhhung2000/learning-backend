import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TeacherProfile } from './users/entities/teacher-profile.entity';
import { StudentProfile } from './users/entities/student-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đọc biến môi trường toàn cục
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'learning_db'),
        entities: [
          Student,
          Class,
          Enrollment,
          Subject,
          Teacher,
          Course,
          User,
          TeacherProfile,
          StudentProfile,
        ],
        synchronize: true, // Tự động tạo bảng (chỉ dùng dev)
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
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
