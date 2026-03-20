import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsNumber()
  studentId: number;

  @IsNumber()
  classId: number;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
