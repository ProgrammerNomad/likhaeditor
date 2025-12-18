import { Plugin } from '@likhaeditor/core';

/**
 * Placeholder plugin
 * Shows placeholder text when editor is empty
 */
export class PlaceholderPlugin extends Plugin {
  name = 'placeholder';
  private text: string;

  constructor(config: { text?: string } = {}) {
    super(config);
    this.text = config.text || 'Start typing...';
  }

  init(editor: any): void {
    super.init(editor);
    
    // Add placeholder CSS
    const style = document.createElement('style');
    style.textContent = `
      .ProseMirror p.is-empty:first-child::before {
        content: "${this.text}";
        color: #aaa;
        pointer-events: none;
        position: absolute;
      }
    `;
    document.head.appendChild(style);
  }
}
