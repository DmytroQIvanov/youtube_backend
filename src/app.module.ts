import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserEntity } from './Entities/user.entity';
import { Connection } from 'typeorm';
import { VideoService } from './video/video.service';
import { VideoModule } from './video/video.module';
import { VideoEntity } from './Entities/video.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // type: process.env.TYPE,
      host: process.env.HOST,
      port: 5432,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [UserEntity, VideoEntity],
      // entities: [["dist/**/*.entity{.ts,.js}"],
      ssl: false,
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    UserModule,
    VideoModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, VideoService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
