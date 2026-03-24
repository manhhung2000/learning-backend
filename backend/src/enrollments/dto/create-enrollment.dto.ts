import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsNumber()
  studentId: number;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
