import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateCourseDto {
  @IsNumber()
  teacherId: number;

  @IsNumber()
  subjectId: number;

  @IsNumber()
  classId: number;

  @IsString()
  academicYear: string;

  @IsString()
  semester: string;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
