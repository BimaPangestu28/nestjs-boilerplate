import { ModuleMetadata, Type } from '@nestjs/common';

export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  peerDependencies?: string[];
  tags?: string[];
  category?: string;
  icon?: string;
  homepage?: string;
  repository?: string;
  license?: string;
}

export interface PluginConfig {
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface PluginModule extends ModuleMetadata {
  module: Type<any>;
  metadata: PluginMetadata;
  config?: PluginConfig;
}

export interface PluginHook {
  name: string;
  handler: (...args: any[]) => any;
  priority?: number;
}

export interface PluginEvent {
  name: string;
  data?: any;
  timestamp: Date;
}

export interface PluginLoadOptions {
  pluginsPath: string;
  autoLoad?: boolean;
  enabled?: string[];
  disabled?: string[];
}

export interface LoadedPlugin {
  name: string;
  version: string;
  module: Type<any>;
  metadata: PluginMetadata;
  config: PluginConfig;
  status: 'loaded' | 'error' | 'disabled';
  error?: string;
}

export interface PluginAPI {
  registerHook(hook: PluginHook): void;
  callHook(name: string, ...args: any[]): Promise<any[]>;
  emitEvent(event: PluginEvent): void;
  onEvent(eventName: string, handler: (event: PluginEvent) => void): void;
  getConfig(pluginName: string): PluginConfig | undefined;
  setConfig(pluginName: string, config: PluginConfig): void;
}