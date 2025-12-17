import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { BulletListPlugin } from '../bullet-list';

describe('BulletListPlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Hello world</p>',
      plugins: [new BulletListPlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new BulletListPlugin();
      expect(plugin.name).toBe('bulletList');
    });
  });

  describe('toggleBulletList command', () => {
    it('should convert paragraph to bullet list', () => {
      editor.executeCommand('toggleBulletList');
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('Hello world');
    });

    it('should convert bullet list back to paragraph', () => {
      editor.setContent('<ul><li><p>List item</p></li></ul>');
      editor.executeCommand('toggleBulletList');
      const html = editor.getHTML();
      expect(html).not.toContain('<ul>');
      expect(html).not.toContain('<li>');
      expect(html).toContain('<p>List item</p>');
    });

    it('should handle multiple list items', () => {
      editor.setContent('<ul><li><p>Item 1</p></li><li><p>Item 2</p></li></ul>');
      const html = editor.getHTML();
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect((html.match(/<li>/g) || []).length).toBe(2);
    });

    it('should preserve text content when toggling', () => {
      const text = 'Important content with !@#$%';
      editor.setContent(`<p>${text}</p>`);
      editor.executeCommand('toggleBulletList');
      const textContent = editor.getText();
      expect(textContent).toContain(text);
    });
  });

  describe('isBulletListActive command', () => {
    it('should return false for paragraph', () => {
      const isActive = editor.executeCommand('isBulletListActive');
      expect(isActive).toBe(false);
    });

    it('should return true when cursor is in bullet list', () => {
      editor.setContent('<ul><li><p>List item</p></li></ul>');
      const isActive = editor.executeCommand('isBulletListActive');
      expect(isActive).toBe(true);
    });

    it('should return false for ordered list', () => {
      editor.setContent('<ol><li><p>List item</p></li></ol>');
      const isActive = editor.executeCommand('isBulletListActive');
      expect(isActive).toBe(false);
    });
  });

  describe('content preservation', () => {
    it('should preserve inline formatting when converting to list', () => {
      editor.setContent('<p>Text with <strong>bold</strong> and <em>italic</em></p>');
      editor.executeCommand('toggleBulletList');
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    it('should handle empty paragraphs gracefully', () => {
      editor.setContent('<p></p>');
      editor.executeCommand('toggleBulletList');
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
    });
  });

  describe('nested lists', () => {
    it('should handle nested bullet lists', () => {
      const nestedList = `
        <ul>
          <li><p>Item 1</p>
            <ul>
              <li><p>Nested item</p></li>
            </ul>
          </li>
        </ul>
      `;
      editor.setContent(nestedList);
      const html = editor.getHTML();
      expect((html.match(/<ul>/g) || []).length).toBe(2);
      expect(html).toContain('Nested item');
    });
  });
});
