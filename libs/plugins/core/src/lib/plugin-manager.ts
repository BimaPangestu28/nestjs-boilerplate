import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PluginLoader } from './plugin-loader';
import { PluginHooksService } from './plugin-hooks';
import { 
  LoadedPlugin, 
  PluginLoadOptions, 
  PluginAPI, 
  PluginConfig,
  PluginHook,
  PluginEvent 
} from './interfaces';
import { 
  PLUGIN_HOOK_KEY, 
  PLUGIN_EVENT_HANDLER_KEY 
} from './decorators';

@Injectable()
export class PluginManager implements PluginAPI {
  private readonly logger = new Logger(PluginManager.name);
  private loadedPlugins: LoadedPlugin[] = [];
  private pluginInstances = new Map<string, any>();
  private pluginConfigs = new Map<string, PluginConfig>();

  constructor(
    private moduleRef: ModuleRef,
    private pluginLoader: PluginLoader,
    private hooksService: PluginHooksService
  ) {}

  /**
   * Load all plugins
   */
  async loadPlugins(options?: PluginLoadOptions): Promise<void> {
    const defaultOptions: PluginLoadOptions = {
      pluginsPath: './plugins',
      autoLoad: true,
      ...options,
    };

    this.loadedPlugins = await this.pluginLoader.loadPlugins(defaultOptions);

    // Initialize loaded plugins
    for (const plugin of this.loadedPlugins) {
      if (plugin.status === 'loaded') {
        await this.initializePlugin(plugin);
      }
    }

    this.logger.log(`Initialized ${this.loadedPlugins.filter(p => p.status === 'loaded').length} plugins`);
  }

  /**
   * Initialize a single plugin
   */
  private async initializePlugin(plugin: LoadedPlugin): Promise<void> {
    try {
      // Create plugin instance
      const instance = new plugin.module();
      this.pluginInstances.set(plugin.name, instance);

      // Store plugin config
      this.pluginConfigs.set(plugin.name, plugin.config);

      // Register hooks
      this.registerPluginHooks(instance, plugin.name);

      // Register event handlers
      this.registerPluginEventHandlers(instance, plugin.name);

      // Call onLoad hook if exists
      if (typeof instance.onLoad === 'function') {
        await instance.onLoad(this);
      }

      this.logger.log(`Initialized plugin: ${plugin.name}`);
    } catch (error) {
      this.logger.error(`Failed to initialize plugin ${plugin.name}:`, error);
      plugin.status = 'error';
      plugin.error = error.message;
    }
  }

  /**
   * Register plugin hooks
   */
  private registerPluginHooks(instance: any, pluginName: string): void {
    const hooks = Reflect.getMetadata(PLUGIN_HOOK_KEY, instance) || [];

    for (const hookMeta of hooks) {
      const hook: PluginHook = {
        name: hookMeta.name,
        handler: (...args: any[]) => instance[hookMeta.method](...args),
        priority: hookMeta.priority,
      };

      this.hooksService.registerHook(hook);
      this.logger.debug(`Registered hook ${hookMeta.name} from plugin ${pluginName}`);
    }
  }

  /**
   * Register plugin event handlers
   */
  private registerPluginEventHandlers(instance: any, pluginName: string): void {
    const handlers = Reflect.getMetadata(PLUGIN_EVENT_HANDLER_KEY, instance) || [];

    for (const handlerMeta of handlers) {
      this.hooksService.onEvent(handlerMeta.eventName, (event: PluginEvent) => {
        instance[handlerMeta.method](event);
      });

      this.logger.debug(`Registered event handler for ${handlerMeta.eventName} from plugin ${pluginName}`);
    }
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): LoadedPlugin[] {
    return this.loadedPlugins;
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): LoadedPlugin | undefined {
    return this.loadedPlugins.find(p => p.name === name);
  }

  /**
   * Get plugin instance
   */
  getPluginInstance(name: string): any {
    return this.pluginInstances.get(name);
  }

  /**
   * Enable/disable plugin
   */
  async setPluginStatus(name: string, enabled: boolean): Promise<void> {
    const plugin = this.getPlugin(name);
    if (!plugin) {
      throw new Error(`Plugin not found: ${name}`);
    }

    if (enabled && plugin.status !== 'loaded') {
      await this.initializePlugin(plugin);
    } else if (!enabled && plugin.status === 'loaded') {
      await this.unloadPlugin(name);
    }
  }

  /**
   * Unload a plugin
   */
  private async unloadPlugin(name: string): Promise<void> {
    const instance = this.pluginInstances.get(name);
    
    if (instance && typeof instance.onUnload === 'function') {
      await instance.onUnload();
    }

    this.pluginInstances.delete(name);
    this.pluginConfigs.delete(name);

    const plugin = this.getPlugin(name);
    if (plugin) {
      plugin.status = 'disabled';
    }

    this.logger.log(`Unloaded plugin: ${name}`);
  }

  // PluginAPI implementation

  registerHook(hook: PluginHook): void {
    this.hooksService.registerHook(hook);
  }

  async callHook(name: string, ...args: any[]): Promise<any[]> {
    return this.hooksService.callHook(name, ...args);
  }

  emitEvent(event: PluginEvent): void {
    this.hooksService.emitEvent(event);
  }

  onEvent(eventName: string, handler: (event: PluginEvent) => void): void {
    this.hooksService.onEvent(eventName, handler);
  }

  getConfig(pluginName: string): PluginConfig | undefined {
    return this.pluginConfigs.get(pluginName);
  }

  setConfig(pluginName: string, config: PluginConfig): void {
    this.pluginConfigs.set(pluginName, config);
    
    // Emit config change event
    this.emitEvent({
      name: 'plugin.config.changed',
      data: { pluginName, config },
      timestamp: new Date(),
    });
  }
}