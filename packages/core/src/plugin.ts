import { Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import type { Editor } from './editor';

export interface PluginConfig {
  [key: string]: unknown;
}

export interface CommandFunction {
  (editor: Editor, ...args: any[]): any;
}

export interface Commands {
  [name: string]: CommandFunction;
}

export interface KeyboardShortcuts {
  [key: string]: CommandFunction;
}

export abstract class Plugin {
  /**
   * Unique plugin name
   */
  abstract name: string;

  /**
   * Plugin configuration
   */
  protected config: PluginConfig;

  /**
   * Reference to the editor instance
   */
  protected editor?: Editor;

  constructor(config: PluginConfig = {}) {
    this.config = config;
  }

  /**
   * Initialize the plugin
   * Called when plugin is registered with the editor
   */
  init(editor: Editor): void {
    this.editor = editor;
  }

  /**
   * Register commands provided by this plugin
   */
  commands(): Commands {
    return {};
  }

  /**
   * Register keyboard shortcuts for this plugin
   */
  keymap(): KeyboardShortcuts {
    return {};
  }

  /**
   * Return ProseMirror plugins if needed
   */
  prosemirrorPlugins(): ProseMirrorPlugin[] {
    return [];
  }

  /**
   * Cleanup when plugin is destroyed
   */
  destroy(): void {
    // Override in subclass if needed
  }

  /**
   * Get plugin configuration value
   */
  protected getConfig<T = unknown>(key: string, defaultValue?: T): T {
    return (this.config[key] as T) ?? (defaultValue as T);
  }
}

export interface PluginRegistry {
  [name: string]: Plugin;
}
