import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { PluginManager } from '@nx-fullstack/plugins/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Initialize plugin system
  const pluginManager = app.get(PluginManager);
  await pluginManager.loadPlugins();
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors();
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NX Fullstack Framework API')
    .setDescription('API with dynamic plugin system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env['PORT'] || 3000;
  await app.listen(port);
  
  Logger.log(`🚀 API is running on: http://localhost:${port}/api`);
  Logger.log(`📚 Docs available at: http://localhost:${port}/api/docs`);
  Logger.log(`🔌 Loaded ${pluginManager.getLoadedPlugins().length} plugins`);
}

bootstrap();