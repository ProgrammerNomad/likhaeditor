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
export declare abstract class Plugin {
    abstract name: string;
    protected config: PluginConfig;
    protected editor?: Editor;
    constructor(config?: PluginConfig);
    init(editor: Editor): void;
    commands(): Commands;
    keymap(): KeyboardShortcuts;
    prosemirrorPlugins(): ProseMirrorPlugin[];
    destroy(): void;
    protected getConfig<T = unknown>(key: string, defaultValue?: T): T;
}
export interface PluginRegistry {
    [name: string]: Plugin;
}
//# sourceMappingURL=plugin.d.ts.map