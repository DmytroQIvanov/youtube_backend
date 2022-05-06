import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { createUserDto } from '../dto/userDto';
import { StatusCodes } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import { createVideoDto } from '../dto/videoDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../Entities/user.entity';
import { Repository } from 'typeorm';
import { VideoEntity } from '../Entities/video.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoEntity: Repository<VideoEntity>,
  ) {}

  async addVideo(dataBuffer: any, filename: string, props: createVideoDto) {
    const { description, title } = props;
    console.log('props', props);
    console.log('filename', filename);
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: dataBuffer.buffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    console.log('uploadResult', uploadResult);

    console.log('Key', uploadResult.Key);
    console.log('Location', uploadResult.Location);

    const newFile = this.videoEntity.create({
      description,
      title,
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.videoEntity.save(newFile);
    return newFile;
  }
  public async getPrivateFile(fileId: number) {
    const s3 = new S3();

    console.log(fileId);
    const fileInfo = await this.videoEntity.findOne(
      { id: fileId },
      { relations: ['user'] },
    );
    console.log(fileInfo);
    if (fileInfo) {
      return s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileInfo.key,
      });

      // const stream = await s3
      //   .getObject({
      //     Bucket: process.env.AWS_BUCKET_NAME,
      //     Key: fileInfo.key,
      //   })
      //   .createReadStream();
      // return {
      //   stream,
      //   info: fileInfo,
      // };
    }
    throw new NotFoundException();
  }
  async getVideos() {
    const videos = await this.videoEntity.find({ relations: ['user'] });
    return videos;
  }
}
