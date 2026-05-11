import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CognitoAuthGuard } from '@common/guards/cognito-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@Controller('users')
@UseGuards(CognitoAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.usersService.create(createDto, file);
  }

  @Put(':username')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('username') username: string,
    @Body() updateDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.usersService.update(username, { ...updateDto, file });
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
