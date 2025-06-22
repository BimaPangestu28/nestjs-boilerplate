import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PluginManager } from '@nx-fullstack/plugins/core';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pluginManager: PluginManager
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get application info' })
  @ApiResponse({ status: 200, description: 'Application information' })
  getAppInfo() {
    return this.appService.getAppInfo();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health status' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('plugins')
  @ApiOperation({ summary: 'Get loaded plugins' })
  @ApiResponse({ status: 200, description: 'List of loaded plugins' })
  getPlugins() {
    return {
      plugins: this.pluginManager.getLoadedPlugins(),
      total: this.pluginManager.getLoadedPlugins().length,
    };
  }
}