import { Plugin, type PluginConfig } from '@likha/core';
import type { Editor } from '@likha/core';

export class TextColorPlugin extends Plugin {
  name = 'text-color';

  constructor(config: PluginConfig = {}) {
    super(config);
  }

  init(editor: Editor): void {
    this.editor = editor;
  }

  /**
   * Set text color for the current selection
   */
  setTextColor(editor: Editor, color: string): boolean {
    const { view } = editor;
    const { state } = view;
    const { schema, selection } = state;
    const markType = schema.marks.textColor;

    if (!markType) return false;

    const { from, to } = selection;
    if (from === to) return false; // No selection

    const tr = state.tr.addMark(from, to, markType.create({ color }));
    view.dispatch(tr);
    return true;
  }

  /**
   * Remove text color from the current selection
   */
  removeTextColor(editor: Editor): boolean {
    const { view } = editor;
    const { state } = view;
    const { schema, selection } = state;
    const markType = schema.marks.textColor;

    if (!markType) return false;

    const { from, to } = selection;
    const tr = state.tr.removeMark(from, to, markType);
    view.dispatch(tr);
    return true;
  }

  /**
   * Get the current text color at the cursor position
   */
  getTextColor(editor: Editor): string | null {
    const { state } = editor.view;
    const { schema, selection } = state;
    const markType = schema.marks.textColor;

    if (!markType) return null;

    const { $from } = selection;
    const marks = $from.marks();
    const colorMark = marks.find(mark => mark.type === markType);

    return colorMark?.attrs.color || null;
  }

  /**
   * Check if text color is active at the cursor position
   */
  isTextColorActive(editor: Editor, color?: string): boolean {
    const currentColor = this.getTextColor(editor);
    
    if (!currentColor) return false;
    if (!color) return true; // Any color is active
    
    return currentColor === color;
  }

  commands() {
    return {
      setTextColor: this.setTextColor.bind(this),
      removeTextColor: this.removeTextColor.bind(this),
      getTextColor: this.getTextColor.bind(this),
      isTextColorActive: this.isTextColorActive.bind(this)
    };
  }
}
