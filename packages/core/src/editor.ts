import { EditorState, Plugin as ProseMirrorPlugin, TextSelection, type Command } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { likhaSchema } from './schema';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { Plugin, type PluginRegistry, type Commands } from './plugin';
import { isSafeURL } from './url';

export interface EditorOptions {
  element: HTMLElement;
  content?: string;
  schema?: Schema;
  plugins?: Plugin[];
  editable?: boolean;
  onChange?: (html: string) => void;
}

export class Editor {
  public view: EditorView;
  private element: HTMLElement;
  private plugins: PluginRegistry = Object.create(null);
  private customCommands: Commands = Object.create(null);
  private destroyed = false;

  constructor(options: EditorOptions) {
    this.element = options.element;
    
    const editorSchema = options.schema || likhaSchema;
    
    // Register plugins first
    if (options.plugins) {
      options.plugins.forEach((plugin) => this.registerPlugin(plugin));
    }

    // Collect ProseMirror plugins and keymaps from custom plugins
    const proseMirrorPlugins: ProseMirrorPlugin[] = [];
    const customKeymaps: Record<string, Command> = {};
    
    Object.values(this.plugins).forEach((plugin) => {
      proseMirrorPlugins.push(...plugin.prosemirrorPlugins());
      
      // Collect keymaps from plugins and convert to ProseMirror format
      const bindings = plugin.keymap();
      if (bindings && Object.keys(bindings).length > 0) {
        Object.entries(bindings).forEach(([key, fn]) => {
          customKeymaps[key] = (state, dispatch, view) => {
            return fn(this, state, dispatch, view);
          };
        });
      }
    });
    
    // Create initial state
    const state = EditorState.create({
      doc: this.parseContent(options.content || '', editorSchema),
      plugins: [
        history(),
        // List-specific keybindings MUST come before baseKeymap
        keymap(editorSchema.nodes.list_item ? {
          'Enter': splitListItem(editorSchema.nodes.list_item),
          'Mod-[': liftListItem(editorSchema.nodes.list_item),
          'Mod-]': sinkListItem(editorSchema.nodes.list_item),
        } : {}),
        // Place custom plugin keymaps before baseKeymap
        keymap(customKeymaps),
        ...proseMirrorPlugins,
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
          ...(editorSchema.marks.strong ? { 'Mod-b': toggleMark(editorSchema.marks.strong) } : {}),
          ...(editorSchema.marks.em ? { 'Mod-i': toggleMark(editorSchema.marks.em) } : {}),
          ...(editorSchema.marks.underline ? { 'Mod-u': toggleMark(editorSchema.marks.underline) } : {}),
        }),
        keymap(baseKeymap),
      ],
    });

    // Create editor view
    this.view = new EditorView(this.element, {
      state,
      editable: () => options.editable !== false,
      attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Rich text editor' },
      dispatchTransaction: (transaction) => {
        const previous = this.view.state.doc;
        const result = this.view.state.applyTransaction(transaction);
        this.view.updateState(result.state);
        if (!previous.eq(result.state.doc)) options.onChange?.(this.getHTML());
      },
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

  public executeCommand(name: string, ...args: unknown[]): unknown {
    const command = this.customCommands[name];
    if (!command) {
      console.warn(`Command "${name}" not found`);
      return false;
    }
    // The string-based API is a dynamic boundary; concrete plugin methods keep
    // their typed argument lists for consumers that need compile-time checking.
    return (command as (editor: Editor, ...args: unknown[]) => unknown)(this, ...args);
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
    return this.view.state.doc.textBetween(0, this.view.state.doc.content.size, '\n');
  }

  public getJSON(): Record<string, unknown> {
    return this.view.state.doc.toJSON();
  }

  /** Validate structured content before applying it as a single undoable change. */
  public setJSON(content: unknown): void {
    const doc = this.view.state.schema.nodeFromJSON(content);
    doc.check();
    if (doc.type !== this.view.state.schema.topNodeType) throw new Error('Expected a document node');
    doc.descendants(node => {
      if (node.type.name === 'image' && !isSafeURL(node.attrs.src, true)) throw new Error('Unsupported image URL');
      if (node.marks.some(mark => mark.type.name === 'link' && !isSafeURL(mark.attrs.href))) throw new Error('Unsupported link URL');
    });
    const tr = this.view.state.tr.replaceWith(0, this.view.state.doc.content.size, doc.content);
    this.view.dispatch(tr.setSelection(TextSelection.atStart(tr.doc)));
  }

  public setContent(content: string): void {
    const doc = this.parseContent(content, this.view.state.schema);
    const tr = this.view.state.tr.replaceWith(0, this.view.state.doc.content.size, doc.content);
    tr.setSelection(TextSelection.atStart(tr.doc));
    this.view.dispatch(tr);
  }

  public setEditable(editable: boolean): void {
    this.view.setProps({ editable: () => editable });
  }

  public focus(): void {
    this.view.focus();
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    try {
      Object.values(this.plugins).forEach((plugin) => plugin.destroy());
    } finally {
      this.view.destroy();
    }
  }

  // Formatting commands - Simple API that hides ProseMirror complexity
  
  public bold(): boolean {
    const { state, dispatch } = this.view;
    if (!state.schema.marks.strong) return false;
    return toggleMark(state.schema.marks.strong)(state, dispatch);
  }

  public italic(): boolean {
    const { state, dispatch } = this.view;
    if (!state.schema.marks.em) return false;
    return toggleMark(state.schema.marks.em)(state, dispatch);
  }

  public code(): boolean {
    const { state, dispatch } = this.view;
    if (!state.schema.marks.code) return false;
    return toggleMark(state.schema.marks.code)(state, dispatch);
  }

  public underline(): boolean {
    const { state, dispatch } = this.view;
    const underlineMark = state.schema.marks.underline;
    if (!underlineMark) return false;
    return toggleMark(underlineMark)(state, dispatch);
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
    const mark = state.schema.marks[markName === 'bold' ? 'strong' : markName === 'italic' ? 'em' : markName];
    if (!mark) return false;

    const { from, to } = state.selection;
    if (state.selection.empty) {
      return !!mark.isInSet(state.storedMarks || state.selection.$from.marks());
    }
    let active = false;

    state.doc.nodesBetween(from, to, (node) => {
      if (node.marks.some((m) => m.type === mark)) {
        active = true;
      }
    });

    return active;
  }
}
