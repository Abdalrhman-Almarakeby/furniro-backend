import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/config/config.interface';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService<ConfigVariables, true>) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'auto' }, (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) {
            reject(new Error('Failed to upload file'));
          } else {
            resolve(result.secure_url);
          }
        })
        .end(file.buffer);
    });
  }
}
