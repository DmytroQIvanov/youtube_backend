import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto, loginUserDto } from '../dto/userDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createVideoDto } from '../dto/videoDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/video/:id')
  getVideo(@Req() request) {
    return this.userService.getVideo(request.params.id);
  }
  @Get('/videos')
  getVideos() {
    console.log();
    return this.userService.getVideos();
  }
  @Post()
  @HttpCode(201)
  createUser(@Body() createUserDto: createUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }
  @Get()
  getUsers(@Req() request) {
    console.log(request.cookies);
    return this.userService.getUsers();
  }
  @Post('/login')
  @HttpCode(202)
  login(@Res({ passthrough: true }) response, @Body() loginUserDto) {
    console.log('login', loginUserDto);

    return this.userService.login(loginUserDto, response);
  }
  @Get('/auth')
  auth(@Req() request) {
    return this.userService.auth(request.user);
  }
  @Post('/uploadVideo')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file, @Body() body: createVideoDto, @Req() req) {
    const userId = req.user.sub;
    console.log(req.user);
    return this.userService.addVideo(userId, file, {
      description: body.description,
      title: body.title,
    });
  }

  @Get(':id')
  getUser(@Req() request) {
    return this.userService.getUser(request.params.id);
  }
}
