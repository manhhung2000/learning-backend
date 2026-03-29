import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('ADMIN', 'TEACHER')
  create(@Body() createDto: CreateCourseDto) {
    return this.coursesService.create(createDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coursesService.findAllWithPagination(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Get('class/:classId')
  findByClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.coursesService.findByClass(classId);
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.coursesService.findByTeacher(teacherId);
  }

  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
