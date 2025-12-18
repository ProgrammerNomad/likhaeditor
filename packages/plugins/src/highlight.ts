import { Plugin, type PluginConfig } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';

export class HighlightPlugin extends Plugin {
  name = 'highlight';

  constructor(config: PluginConfig = {}) {
    super(config);
  }

  init(editor: Editor): void {
    this.editor = editor;
  }

  /**
   * Set highlight color for the current selection
   */
  setHighlight(editor: Editor, color: string = 'yellow'): boolean {
    const { view } = editor;
    const { state } = view;
    const { schema, selection } = state;
    const markType = schema.marks.highlight;

    if (!markType) return false;

    const { from, to } = selection;
    if (from === to) return false; // No selection

    const tr = state.tr.addMark(from, to, markType.create({ color }));
    view.dispatch(tr);
    return true;
  }

  /**
   * Remove highlight from the current selection
   */
  removeHighlight(editor: Editor): boolean {
    const { view } = editor;
    const { state } = view;
    const { schema, selection } = state;
    const markType = schema.marks.highlight;

    if (!markType) return false;

    const { from, to } = selection;
    const tr = state.tr.removeMark(from, to, markType);
    view.dispatch(tr);
    return true;
  }

  /**
   * Get the current highlight color at the cursor position
   */
  getHighlight(editor: Editor): string | null {
    const { state } = editor.view;
    const { schema, selection } = state;
    const markType = schema.marks.highlight;

    if (!markType) return null;

    const { $from } = selection;
    const marks = $from.marks();
    const highlightMark = marks.find(mark => mark.type === markType);

    return highlightMark?.attrs.color || null;
  }

  /**
   * Check if highlight is active at the cursor position
   */
  isHighlightActive(editor: Editor, color?: string): boolean {
    const currentColor = this.getHighlight(editor);
    
    if (!currentColor) return false;
    if (!color) return true; // Any highlight is active
    
    return currentColor === color;
  }

  /**
   * Toggle highlight on/off
   */
  toggleHighlight(editor: Editor, color: string = 'yellow'): boolean {
    if (this.isHighlightActive(editor, color)) {
      return this.removeHighlight(editor);
    } else {
      return this.setHighlight(editor, color);
    }
  }

  commands() {
    return {
      setHighlight: this.setHighlight.bind(this),
      removeHighlight: this.removeHighlight.bind(this),
      getHighlight: this.getHighlight.bind(this),
      isHighlightActive: this.isHighlightActive.bind(this),
      toggleHighlight: this.toggleHighlight.bind(this)
    };
  }
}
