import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DbService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const host = this.configService.get<string>('DB_HOST', 'localhost');
    const username = this.configService.get<string>('DB_USERNAME', 'postgres');
    const password = this.configService.get<string>('DB_PASS', 'postgres');
    const database = this.configService.get<string>('DB_DATABASE', 'gerocuidado-forum-db');

    const port = parseInt(this.configService.get<string>('DB_PORT', '5002'), 10);

    return Promise.resolve<TypeOrmModuleOptions>({
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    });
  }
}
