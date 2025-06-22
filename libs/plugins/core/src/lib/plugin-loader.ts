import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { PluginModule, PluginLoadOptions, LoadedPlugin, PluginMetadata } from './interfaces';
import { PLUGIN_METADATA_KEY } from './decorators';

@Injectable()
export class PluginLoader {
  private readonly logger = new Logger(PluginLoader.name);

  constructor(private moduleRef: ModuleRef) {}

  /**
   * Load plugins from the specified directory
   */
  async loadPlugins(options: PluginLoadOptions): Promise<LoadedPlugin[]> {
    const { pluginsPath, enabled = [], disabled = [] } = options;
    const loadedPlugins: LoadedPlugin[] = [];

    if (!fs.existsSync(pluginsPath)) {
      this.logger.warn(`Plugins directory not found: ${pluginsPath}`);
      return loadedPlugins;
    }

    const pluginDirs = fs.readdirSync(pluginsPath).filter(dir => {
      const pluginPath = path.join(pluginsPath, dir);
      return fs.statSync(pluginPath).isDirectory();
    });

    for (const pluginDir of pluginDirs) {
      try {
        const plugin = await this.loadPlugin(path.join(pluginsPath, pluginDir));
        
        if (plugin) {
          // Check if plugin should be enabled/disabled
          const isExplicitlyEnabled = enabled.length === 0 || enabled.includes(plugin.name);
          const isExplicitlyDisabled = disabled.includes(plugin.name);
          
          if (isExplicitlyEnabled && !isExplicitlyDisabled) {
            plugin.status = 'loaded';
            loadedPlugins.push(plugin);
            this.logger.log(`Loaded plugin: ${plugin.name}@${plugin.version}`);
          } else {
            plugin.status = 'disabled';
            loadedPlugins.push(plugin);
            this.logger.log(`Plugin disabled: ${plugin.name}@${plugin.version}`);
          }
        }
      } catch (error) {
        this.logger.error(`Failed to load plugin from ${pluginDir}:`, error);
        loadedPlugins.push({
          name: pluginDir,
          version: 'unknown',
          module: null as any,
          metadata: {} as PluginMetadata,
          config: { enabled: false },
          status: 'error',
          error: error.message,
        });
      }
    }

    return loadedPlugins;
  }

  /**
   * Load a single plugin from a directory
   */
  private async loadPlugin(pluginPath: string): Promise<LoadedPlugin | null> {
    const packageJsonPath = path.join(pluginPath, 'package.json');
    const indexPath = path.join(pluginPath, 'index.js');

    // Check if package.json exists
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    // Check if index.js exists
    if (!fs.existsSync(indexPath)) {
      throw new Error('index.js not found');
    }

    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Dynamically import the plugin module
    const pluginModule = await import(indexPath);
    const PluginClass = pluginModule.default || pluginModule[Object.keys(pluginModule)[0]];

    if (!PluginClass) {
      throw new Error('No plugin class found in module');
    }

    // Get plugin metadata
    const metadata = Reflect.getMetadata(PLUGIN_METADATA_KEY, PluginClass);
    
    if (!metadata) {
      throw new Error('Plugin metadata not found. Use @Plugin() decorator.');
    }

    return {
      name: metadata.name || packageJson.name,
      version: metadata.version || packageJson.version,
      module: PluginClass,
      metadata: {
        ...metadata,
        name: metadata.name || packageJson.name,
        version: metadata.version || packageJson.version,
        description: metadata.description || packageJson.description,
        author: metadata.author || packageJson.author,
        license: metadata.license || packageJson.license,
      },
      config: {
        enabled: true,
        settings: {},
      },
      status: 'loaded',
    };
  }

  /**
   * Validate plugin dependencies
   */
  private validateDependencies(plugin: LoadedPlugin, loadedPlugins: LoadedPlugin[]): boolean {
    if (!plugin.metadata.dependencies) {
      return true;
    }

    const loadedPluginNames = loadedPlugins.map(p => p.name);

    for (const dependency of plugin.metadata.dependencies) {
      if (!loadedPluginNames.includes(dependency)) {
        this.logger.error(`Plugin ${plugin.name} requires dependency: ${dependency}`);
        return false;
      }
    }

    return true;
  }
}