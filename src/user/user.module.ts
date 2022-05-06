import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../Entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { VideoService } from '../video/video.service';
import { VideoEntity } from '../Entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity])],
  controllers: [UserController],
  providers: [UserService, VideoService],
  exports: [TypeOrmModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/user/auth', method: RequestMethod.GET },
        { path: '/user/uploadVideo', method: RequestMethod.POST },
      );
  }
}
