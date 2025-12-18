import { Plugin } from '@likhaeditor/core';

/**
 * Character counter plugin
 * Displays character and word count
 */
export class CharacterCountPlugin extends Plugin {
  name = 'characterCount';

  private countElement?: HTMLElement;

  init(editor: any): void {
    super.init(editor);

    const targetSelector = this.getConfig<string>('target');
    if (targetSelector) {
      this.countElement = document.querySelector(targetSelector) || undefined;
    }

    if (this.countElement) {
      this.updateCount();
      // Update on every transaction
      setInterval(() => this.updateCount(), 500);
    }
  }

  private updateCount(): void {
    if (!this.editor || !this.countElement) return;

    const text = this.editor.getHTML().replace(/<[^>]*>/g, '');
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    this.countElement.textContent = `${chars} characters, ${words} words`;
  }

  commands() {
    return {
      getCharacterCount: (editor: any) => {
        const text = editor.getHTML().replace(/<[^>]*>/g, '');
        return text.length;
      },
      getWordCount: (editor: any) => {
        const text = editor.getHTML().replace(/<[^>]*>/g, '');
        return text.trim() ? text.trim().split(/\s+/).length : 0;
      },
    };
  }
}
