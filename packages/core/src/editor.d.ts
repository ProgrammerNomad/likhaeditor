import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { Plugin } from './plugin';
export interface EditorOptions {
    element: HTMLElement;
    content?: string;
    schema?: Schema;
    plugins?: Plugin[];
}
export declare class Editor {
    view: EditorView;
    private element;
    private plugins;
    private customCommands;
    constructor(options: EditorOptions);
    private registerPlugin;
    getPlugin(name: string): Plugin | undefined;
    executeCommand(name: string, ...args: any[]): any;
    private parseContent;
    getHTML(): string;
    getText(): string;
    setContent(content: string): void;
    focus(): void;
    destroy(): void;
    bold(): boolean;
    italic(): boolean;
    code(): boolean;
    undo(): boolean;
    redo(): boolean;
    isActive(markName: string): boolean;
}
//# sourceMappingURL=editor.d.ts.map