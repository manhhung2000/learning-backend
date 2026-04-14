import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { EnrollmentStatus } from '../entities/enrollment.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
