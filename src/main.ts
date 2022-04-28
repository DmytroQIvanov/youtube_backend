import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new ExcludeNullInterceptor());
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.ORIGIN, '*','http://localhost:3000', '*:*'],
    // origin: ['https://avc-team.com.ua'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  config.update({
    region: 'eu-central-1',
    accessKeyId: 'AKIATGDPX3MLKOV2HOYY',
    secretAccessKey: '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',
  });

  const port = process.env.PORT || 8080;
  const server = await app.listen(port);
  console.log('Server has been started! PORT: ' + server.address().port);
}
bootstrap();
