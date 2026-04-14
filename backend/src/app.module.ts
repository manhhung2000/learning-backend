import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from '@modules/class-management/classes/classes.module';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import { EnrollmentsModule } from '@modules/class-management/enrollments/enrollments.module';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';
import { CoursesModule } from '@modules/class-management/courses/courses.module';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { AuthModule } from '@modules/user-management/auth/auth.module';
import { UsersModule } from '@modules/user-management/users/users.module';
import { User } from '@modules/user-management/users/entities/user.entity';

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
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'school'),
        entities: [User, Course, Class, Enrollment],
        synchronize: true, // Tự động tạo bảng (chỉ dùng dev)
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ClassesModule,
    EnrollmentsModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
