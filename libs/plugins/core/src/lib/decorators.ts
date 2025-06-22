import { SetMetadata } from '@nestjs/common';
import { PluginMetadata } from './interfaces';

export const PLUGIN_METADATA_KEY = 'plugin:metadata';
export const PLUGIN_HOOK_KEY = 'plugin:hook';
export const PLUGIN_EVENT_HANDLER_KEY = 'plugin:event_handler';

/**
 * Decorator to mark a module as a plugin
 */
export function Plugin(metadata: PluginMetadata) {
  return SetMetadata(PLUGIN_METADATA_KEY, metadata);
}

/**
 * Decorator to register a method as a plugin hook
 */
export function Hook(name: string, priority: number = 0) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingHooks = Reflect.getMetadata(PLUGIN_HOOK_KEY, target) || [];
    existingHooks.push({
      name,
      method: propertyKey,
      priority,
    });
    Reflect.defineMetadata(PLUGIN_HOOK_KEY, existingHooks, target);
  };
}

/**
 * Decorator to register a method as an event handler
 */
export function OnEvent(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const existingHandlers = Reflect.getMetadata(PLUGIN_EVENT_HANDLER_KEY, target) || [];
    existingHandlers.push({
      eventName,
      method: propertyKey,
    });
    Reflect.defineMetadata(PLUGIN_EVENT_HANDLER_KEY, existingHandlers, target);
  };
}