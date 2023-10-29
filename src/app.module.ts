import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AutenticacaoGuard } from './autenticacao.guard';
import { DbModule } from './config/db/db.module';
import { DbService } from './config/db/db.service';
import { PostagemController } from './postagem/postagem.controller';


const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DbModule],
      useClass: DbService,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DbModule,
  ],
  controllers: [AppController, PostagemController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AutenticacaoGuard,
    },
  ],
})
export class AppModule { }
