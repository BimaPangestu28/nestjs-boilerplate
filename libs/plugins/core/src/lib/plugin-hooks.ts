import { Injectable } from '@nestjs/common';
import { PluginHook, PluginEvent } from './interfaces';

@Injectable()
export class PluginHooksService {
  private hooks = new Map<string, PluginHook[]>();
  private eventHandlers = new Map<string, ((event: PluginEvent) => void)[]>();

  /**
   * Register a hook
   */
  registerHook(hook: PluginHook): void {
    if (!this.hooks.has(hook.name)) {
      this.hooks.set(hook.name, []);
    }

    const hooks = this.hooks.get(hook.name)!;
    hooks.push(hook);

    // Sort by priority (higher priority first)
    hooks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Call all hooks for a given name
   */
  async callHook(name: string, ...args: any[]): Promise<any[]> {
    const hooks = this.hooks.get(name) || [];
    const results: any[] = [];

    for (const hook of hooks) {
      try {
        const result = await hook.handler(...args);
        results.push(result);
      } catch (error) {
        console.error(`Error in hook ${name}:`, error);
        results.push(null);
      }
    }

    return results;
  }

  /**
   * Register an event handler
   */
  onEvent(eventName: string, handler: (event: PluginEvent) => void): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }

    this.eventHandlers.get(eventName)!.push(handler);
  }

  /**
   * Emit an event
   */
  emitEvent(event: PluginEvent): void {
    const handlers = this.eventHandlers.get(event.name) || [];

    for (const handler of handlers) {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.name}:`, error);
      }
    }
  }

  /**
   * Get all registered hooks
   */
  getHooks(): Map<string, PluginHook[]> {
    return this.hooks;
  }

  /**
   * Get all event handlers
   */
  getEventHandlers(): Map<string, ((event: PluginEvent) => void)[]> {
    return this.eventHandlers;
  }

  /**
   * Clear all hooks and event handlers
   */
  clear(): void {
    this.hooks.clear();
    this.eventHandlers.clear();
  }
}