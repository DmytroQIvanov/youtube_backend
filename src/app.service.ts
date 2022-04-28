import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppService {
  async getHello() {
    // try {
    //   const data=s3.upload({
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Key: 'video.mp4',
    //     Expires: 36000,
    //   });
    const s3 = new S3();
    const url = s3.getSignedUrl('getObject', {
        Bucket: 'youtube-pet-project',
        Key: 'video.mp4',
        Expires:360000
      });

      return { url };
    //
    // } catch (e) {
    //   console.log(e);
    // }

    /////////////////////////
    // console.log(process.env.AWS_BUCKET_NAME);
    // const smth = s3.getObject(
    //   { Bucket: 'youtube-pet-project', Key: 'video.mp4' },
    //   function (err, data) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('Successfully downloaded data from  bucket');
    //       return data;
    //     }
    //   },
    // );
    // const d = await smth.promise();
    // console.log(d)
    // const s3 = new S3();
    // const stream = await s3
    //   .getObject({
    //     Bucket: 'youtube-pet-project',
    //     Key: 'video.mp4',
    //   })
    //   .createReadStream();
    // return {
    //   stream,
    // };
  }
}
