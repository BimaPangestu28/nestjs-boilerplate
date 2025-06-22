import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PluginsCoreModule } from '@nx-fullstack/plugins/core';
import { DatabaseModule } from '@nx-fullstack/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PluginsCoreModule.forRoot({
      pluginsPath: './plugins',
      autoLoad: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}