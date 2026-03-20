import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  specialization?: string;
}
