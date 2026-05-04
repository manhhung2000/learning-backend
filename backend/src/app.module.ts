import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { CacheServiceModule } from '@common/services/cache.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from '@modules/class-management/classes/classes.module';
import { Class } from '@modules/class-management/classes/entities/class.entity';
import { EnrollmentsModule } from '@modules/class-management/enrollments/enrollments.module';
import { Enrollment } from '@modules/class-management/enrollments/entities/enrollment.entity';
import { CoursesModule } from '@modules/class-management/courses/courses.module';
import { Course } from '@modules/class-management/courses/entities/course.entity';
import { AuthModule } from '@modules/user-management/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'school'),
        entities: [Course, Class, Enrollment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const ttl = configService.get<number>('REDIS_TTL', 300);
        return {
          stores: [new KeyvRedis(`redis://${host}:${port}`)],
          ttl: ttl * 1000,
        };
      },
      inject: [ConfigService],
    }),
    CacheServiceModule,
    AuthModule,
    ClassesModule,
    EnrollmentsModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
