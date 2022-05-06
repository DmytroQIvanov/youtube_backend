import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    console.log('Request...');
    const access_token = req.cookies.access_token;
    if (!access_token) {
      throw new HttpException('Access was not found', 401);
      return;
    }
    const verify = jwt.verify(access_token, 'smth');
    if (!verify) {
      throw new HttpException('Token is not valid', 401);
      return;
    }
    req.user = verify;
    console.log(req.user);

    next();
  }
}
