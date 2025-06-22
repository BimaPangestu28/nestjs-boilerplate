import { Module, DynamicModule, Global } from '@nestjs/common';
import { PluginManager } from './plugin-manager';
import { PluginLoader } from './plugin-loader';
import { PluginHooksService } from './plugin-hooks';
import { PluginRegistry } from './plugin-registry';
import { PluginLoadOptions } from './interfaces';

@Global()
@Module({})
export class PluginsCoreModule {
  static forRoot(options?: PluginLoadOptions): DynamicModule {
    return {
      module: PluginsCoreModule,
      providers: [
        PluginManager,
        PluginLoader,
        PluginHooksService,
        PluginRegistry,
        {
          provide: 'PLUGIN_OPTIONS',
          useValue: options || {},
        },
      ],
      exports: [
        PluginManager,
        PluginLoader,
        PluginHooksService,
        PluginRegistry,
      ],
    };
  }
}