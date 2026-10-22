import { Plugin, type Editor } from '@likhaeditor/core';
import { Plugin as StatePlugin } from 'prosemirror-state';

export class CharacterCountPlugin extends Plugin {
  name = 'characterCount';
  private countElement?: HTMLElement;
  init(editor: Editor): void {
    super.init(editor);
    const target = this.getConfig<string>('target');
    this.countElement = target ? document.querySelector<HTMLElement>(target) ?? undefined : undefined;
    this.updateCount();
  }
  private updateCount(): void {
    if (!this.editor || !this.countElement) return;
    const commands = this.commands();
    this.countElement.textContent = commands.getCharacterCount(this.editor) + ' characters, ' + commands.getWordCount(this.editor) + ' words';
  }
  prosemirrorPlugins(): StatePlugin[] {
    return [new StatePlugin({ view: () => ({ update: () => this.updateCount() }) })];
  }
  destroy(): void { this.countElement = undefined; this.editor = undefined; }
  commands() {
    return {
      getCharacterCount: (editor: Editor) => Array.from(editor.getText()).length,
      getWordCount: (editor: Editor) => {
        const text = editor.getText().trim();
        return text ? text.split(/\s+/u).length : 0;
      },
    };
  }
}
