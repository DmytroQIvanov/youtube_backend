import { HttpException, Injectable } from '@nestjs/common';
import { createUserDto, loginUserDto } from '../dto/userDto';
import { UserEntity } from '../Entities/user.entity';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as http from 'http';
import { StatusCodes } from 'http-status-codes';
import { VideoService } from '../video/video.service';
import { createVideoDto } from '../dto/videoDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private videoService: VideoService,
  ) {}

  async createUser(props: createUserDto) {
    console.log(props);
    const { password, ...other } = props;
    if (!other.email && !other.lastName && !other.lastName && !password)
      throw new HttpException('BAD_REQUEST', StatusCodes.BAD_REQUEST);
    if (props.password.length < 6)
      throw new HttpException(
        'Password length less than 6',
        StatusCodes.BAD_REQUEST,
      );
    const hashedPassword = await bcrypt.hash(props.password, 10);
    const user = await this.usersRepository.create({
      ...other,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);
    return;
  }

  getUsers() {
    try {
      const users = this.usersRepository.find({
        select: ['email', 'firstName', 'lastName', 'password', 'id'],
        relations: ['videos'],
      });
      return users;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  getUser(id: number) {
    try {
      const user = this.usersRepository.findOne({
        where: { id },
        select: ['email', 'firstName', 'lastName'],
      });
      return user;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async login(props: loginUserDto, res) {
    const user = await this.usersRepository.findOne({ email: props.email });
    if (!user) {
      throw new HttpException('User is not found', 400);
    }

    const isPasswordMatching = await bcrypt.compare(
      props.password,
      user.password,
    );
    console.log(isPasswordMatching);
    if (isPasswordMatching) {
      const { password, ...other } = user;
      // console.log(res);
      res.cookie(
        'access_token',
        jwt.sign({ email: other.email, sub: other.id }, 'smth'),
      );
      // throw new HttpException('Login is succesfull', 200,);
      // console.log(res);

      return other;
    }
  }

  async auth(user: { email: string; sub: number }) {
    console.log(user.sub);
    const returnUser = await this.getUser(user.sub);

    // const verify = jwt.verify(token, 'smth');
    // if (!verify) {
    //   return;
    // }
    // const userJWTDecode = jwt.decode(token);
    // return { userJWTDecode };
    return returnUser;
  }

  async addVideo(userId: string, file: any, data: createVideoDto) {
    console.log('userId', userId);
    console.log('file', file);
    console.log('data', data);
    console.log('file.originalName', file.originalname);
    const video = await this.videoService.addVideo(file, file.originalname, {
      title: data.title,
      description: data.description,
    });
    if (!video) {
      throw new HttpException('Something went wrong (missing video)', 400);
    }
    console.log('video', video);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['videos'],
    });
    user.videos.push(video);
    return await this.usersRepository.save(user);
  }

  async getVideo(id: number) {
    return await this.videoService.getPrivateFile(id);
  }
  async getVideos() {
    return await this.videoService.getVideos();
  }
}
