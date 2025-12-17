import { EditorState, Plugin as ProseMirrorPlugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { likhaSchema } from './schema';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { Plugin, type PluginRegistry, type Commands } from './plugin';

export interface EditorOptions {
  element: HTMLElement;
  content?: string;
  schema?: Schema;
  plugins?: Plugin[];
}

export class Editor {
  public view: EditorView;
  private element: HTMLElement;
  private plugins: PluginRegistry = {};
  private customCommands: Commands = {};

  constructor(options: EditorOptions) {
    this.element = options.element;
    
    const editorSchema = options.schema || likhaSchema;
    
    // Register plugins first
    if (options.plugins) {
      options.plugins.forEach((plugin) => this.registerPlugin(plugin));
    }

    // Collect ProseMirror plugins from custom plugins
    const proseMirrorPlugins: ProseMirrorPlugin[] = [];
    Object.values(this.plugins).forEach((plugin) => {
      proseMirrorPlugins.push(...plugin.prosemirrorPlugins());
    });
    
    // Create initial state
    const state = EditorState.create({
      doc: this.parseContent(options.content || '', editorSchema),
      plugins: [
        history(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-b': toggleMark(editorSchema.marks.strong),
          'Mod-i': toggleMark(editorSchema.marks.em),
          'Mod-u': toggleMark(editorSchema.marks.code),
        }),
        keymap(baseKeymap),
        ...proseMirrorPlugins,
      ],
    });

    // Create editor view
    this.view = new EditorView(this.element, {
      state,
    });

    // Initialize plugins after view is created
    Object.values(this.plugins).forEach((plugin) => {
      plugin.init(this);
    });
  }

  private registerPlugin(plugin: Plugin): void {
    if (this.plugins[plugin.name]) {
      console.warn(`Plugin "${plugin.name}" is already registered`);
      return;
    }

    this.plugins[plugin.name] = plugin;

    // Register commands from plugin
    const commands = plugin.commands();
    Object.entries(commands).forEach(([name, fn]) => {
      this.customCommands[name] = fn;
    });
  }

  public getPlugin(name: string): Plugin | undefined {
    return this.plugins[name];
  }

  public executeCommand(name: string, ...args: any[]): any {
    const command = this.customCommands[name];
    if (!command) {
      console.warn(`Command "${name}" not found`);
      return false;
    }
    return command(this, ...args);
  }

  private parseContent(content: string, schema: Schema) {
    const div = document.createElement('div');
    div.innerHTML = content;
    return DOMParser.fromSchema(schema).parse(div);
  }

  public getHTML(): string {
    const fragment = DOMSerializer.fromSchema(this.view.state.schema).serializeFragment(
      this.view.state.doc.content
    );
    const div = document.createElement('div');
    div.appendChild(fragment);
    return div.innerHTML;
  }

  public getText(): string {
    return this.view.state.doc.textContent;
  }

  public setContent(content: string): void {
    const doc = this.parseContent(content, this.view.state.schema);
    const state = EditorState.create({
      doc,
      plugins: this.view.state.plugins,
    });
    this.view.updateState(state);
    // Set selection to start of document
    const tr = this.view.state.tr.setSelection(
      TextSelection.atStart(this.view.state.doc)
    );
    this.view.dispatch(tr);
  }

  public focus(): void {
    this.view.focus();
  }

  public destroy(): void {
    this.view.destroy();
  }

  // Formatting commands - Simple API that hides ProseMirror complexity
  
  public bold(): boolean {
    const { state, dispatch } = this.view;
    return toggleMark(state.schema.marks.strong)(state, dispatch);
  }

  public italic(): boolean {
    const { state, dispatch } = this.view;
    return toggleMark(state.schema.marks.em)(state, dispatch);
  }

  public code(): boolean {
    const { state, dispatch } = this.view;
    return toggleMark(state.schema.marks.code)(state, dispatch);
  }

  public undo(): boolean {
    const { state, dispatch } = this.view;
    return undo(state, dispatch);
  }

  public redo(): boolean {
    const { state, dispatch } = this.view;
    return redo(state, dispatch);
  }

  // Check if a mark is active
  public isActive(markName: string): boolean {
    const { state } = this.view;
    const mark = state.schema.marks[markName];
    if (!mark) return false;

    const { from, to } = state.selection;
    let active = false;

    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks.some((m) => m.type === mark)) {
        active = true;
      }
    });

    return active;
  }
}
