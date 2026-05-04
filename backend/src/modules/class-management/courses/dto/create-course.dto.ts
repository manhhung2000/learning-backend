import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  cognitoId: string;

  @IsString()
  subjectName: string;

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
