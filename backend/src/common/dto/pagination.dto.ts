import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPage: number;
}
