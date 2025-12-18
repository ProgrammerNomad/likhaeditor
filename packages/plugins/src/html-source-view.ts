import { Plugin, type PluginConfig } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';

/**
 * HTML Source View Plugin
 * Toggle between WYSIWYG and HTML source code view
 */
export class HTMLSourceViewPlugin extends Plugin {
  name = 'html-source-view';
  private sourceMode = false;
  private sourceTextarea: HTMLTextAreaElement | null = null;
  private editorElement: HTMLElement | null = null;

  constructor(config: PluginConfig = {}) {
    super(config);
  }

  init(editor: Editor): void {
    this.editor = editor;
    this.editorElement = editor.view.dom;
  }

  /**
   * Toggle between WYSIWYG and HTML source view
   */
  toggleSourceView(editor: Editor): boolean {
    if (!this.sourceMode) {
      // Switch to source mode
      const html = editor.getHTML();
      
      // Create textarea
      this.sourceTextarea = document.createElement('textarea');
      this.sourceTextarea.value = this.formatHTML(html);
      this.sourceTextarea.style.cssText = `
        width: 100%;
        min-height: 400px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        resize: vertical;
        background: #1e293b;
        color: #e2e8f0;
        line-height: 1.5;
      `;

      // Hide editor, show textarea
      if (this.editorElement) {
        this.editorElement.style.display = 'none';
        this.editorElement.parentElement?.appendChild(this.sourceTextarea);
      }

      this.sourceMode = true;
    } else {
      // Switch back to WYSIWYG
      if (this.sourceTextarea) {
        const html = this.sourceTextarea.value;
        editor.setContent(html);
        
        this.sourceTextarea.remove();
        this.sourceTextarea = null;
      }

      if (this.editorElement) {
        this.editorElement.style.display = '';
      }

      this.sourceMode = false;
    }

    return true;
  }

  /**
   * Check if currently in source view mode
   */
  isSourceViewActive(): boolean {
    return this.sourceMode;
  }

  /**
   * Format HTML for better readability
   */
  private formatHTML(html: string): string {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    html.split(/(<[^>]+>)/g).forEach((part) => {
      if (part.match(/^<\//)) {
        // Closing tag
        indent--;
        formatted += tab.repeat(Math.max(0, indent)) + part + '\n';
      } else if (part.match(/^<[^/][^>]*>$/)) {
        // Opening tag
        formatted += tab.repeat(indent) + part + '\n';
        if (!part.match(/\/>$/)) {
          indent++;
        }
      } else if (part.trim()) {
        // Text content
        formatted += tab.repeat(indent) + part.trim() + '\n';
      }
    });

    return formatted.trim();
  }

  commands() {
    return {
      toggleSourceView: this.toggleSourceView.bind(this),
      isSourceViewActive: this.isSourceViewActive.bind(this)
    };
  }
}
