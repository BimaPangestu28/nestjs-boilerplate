import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'NX Fullstack Framework',
      version: '1.0.0',
      description: 'Full-stack framework with plugin system',
      framework: 'NestJS + Next.js + NX',
      features: [
        'Plugin System',
        'Admin Dashboard',
        'API Documentation',
        'Type Safety',
        'Monorepo Architecture'
      ]
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      },
    };
  }
}