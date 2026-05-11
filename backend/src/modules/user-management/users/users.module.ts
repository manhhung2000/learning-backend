import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { S3Module } from '@modules/storage/s3.module';

@Module({
  imports: [S3Module],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
