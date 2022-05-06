import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../Entities/user.entity';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { VideoEntity } from '../Entities/video.entity';
import { VideoService } from './video.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
  // controllers: [UserController],
  providers: [VideoService],
  exports: [TypeOrmModule],
})
export class VideoModule {}
