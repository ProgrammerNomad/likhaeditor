import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { OrderedListPlugin } from '../ordered-list';

describe('OrderedListPlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Hello world</p>',
      plugins: [new OrderedListPlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new OrderedListPlugin();
      expect(plugin.name).toBe('orderedList');
    });
  });

  describe('toggleOrderedList command', () => {
    it('should convert paragraph to ordered list', () => {
      editor.executeCommand('toggleOrderedList');
      const html = editor.getHTML();
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>');
      expect(html).toContain('Hello world');
    });

    it('should convert ordered list back to paragraph', () => {
      editor.setContent('<ol><li><p>List item</p></li></ol>');
      editor.executeCommand('toggleOrderedList');
      const html = editor.getHTML();
      expect(html).not.toContain('<ol>');
      expect(html).not.toContain('<li>');
      expect(html).toContain('<p>List item</p>');
    });

    it('should handle multiple list items', () => {
      editor.setContent('<ol><li><p>Item 1</p></li><li><p>Item 2</p></li><li><p>Item 3</p></li></ol>');
      const html = editor.getHTML();
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 2');
      expect(html).toContain('Item 3');
      expect((html.match(/<li>/g) || []).length).toBe(3);
    });

    it('should preserve text content when toggling', () => {
      const text = 'Numbered item with !@#$%';
      editor.setContent(`<p>${text}</p>`);
      editor.executeCommand('toggleOrderedList');
      const textContent = editor.getText();
      expect(textContent).toContain(text);
    });
  });

  describe('isOrderedListActive command', () => {
    it('should return false for paragraph', () => {
      const isActive = editor.executeCommand('isOrderedListActive');
      expect(isActive).toBe(false);
    });

    it('should return true when cursor is in ordered list', () => {
      editor.setContent('<ol><li><p>List item</p></li></ol>');
      const isActive = editor.executeCommand('isOrderedListActive');
      expect(isActive).toBe(true);
    });

    it('should return false for bullet list', () => {
      editor.setContent('<ul><li><p>List item</p></li></ul>');
      const isActive = editor.executeCommand('isOrderedListActive');
      expect(isActive).toBe(false);
    });
  });

  describe('content preservation', () => {
    it('should preserve inline formatting when converting to list', () => {
      editor.setContent('<p>Text with <strong>bold</strong> and <em>italic</em></p>');
      editor.executeCommand('toggleOrderedList');
      const html = editor.getHTML();
      expect(html).toContain('<ol>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    it('should handle empty paragraphs gracefully', () => {
      editor.setContent('<p></p>');
      editor.executeCommand('toggleOrderedList');
      const html = editor.getHTML();
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>');
    });
  });

  describe('nested lists', () => {
    it('should handle nested ordered lists', () => {
      const nestedList = `
        <ol>
          <li><p>Item 1</p>
            <ol>
              <li><p>Nested item 1.1</p></li>
              <li><p>Nested item 1.2</p></li>
            </ol>
          </li>
          <li><p>Item 2</p></li>
        </ol>
      `;
      editor.setContent(nestedList);
      const html = editor.getHTML();
      expect((html.match(/<ol>/g) || []).length).toBe(2);
      expect(html).toContain('Nested item 1.1');
      expect(html).toContain('Nested item 1.2');
    });
  });

  describe('mixed list types', () => {
    it('should handle ordered list inside bullet list', () => {
      const mixedList = `
        <ul>
          <li><p>Bullet item</p>
            <ol>
              <li><p>Numbered sub-item</p></li>
            </ol>
          </li>
        </ul>
      `;
      editor.setContent(mixedList);
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('<ol>');
      expect(html).toContain('Bullet item');
      expect(html).toContain('Numbered sub-item');
    });
  });
});
