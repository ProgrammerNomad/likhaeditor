import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { BlockquotePlugin } from '../blockquote';

describe('BlockquotePlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Hello world</p>',
      plugins: [new BlockquotePlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new BlockquotePlugin();
      expect(plugin.name).toBe('blockquote');
    });
  });

  describe('toggleBlockquote command', () => {
    it('should wrap paragraph in blockquote', () => {
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).toContain('<blockquote>');
      expect(html).toContain('<p>Hello world</p>');
      expect(html).toContain('</blockquote>');
    });

    it('should unwrap blockquote back to paragraph', () => {
      editor.setContent('<blockquote><p>Quote</p></blockquote>');
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).not.toContain('<blockquote>');
      expect(html).toContain('<p>Quote</p>');
    });

    it('should handle multiple paragraphs in blockquote', () => {
      editor.setContent('<blockquote><p>First</p><p>Second</p></blockquote>');
      const html = editor.getHTML();
      expect(html).toContain('First');
      expect(html).toContain('Second');
      expect((html.match(/<p>/g) || []).length).toBe(2);
    });

    it('should preserve text content when toggling', () => {
      const text = 'Important quote with !@#$%';
      editor.setContent(`<p>${text}</p>`);
      editor.executeCommand('toggleBlockquote');
      const textContent = editor.getText();
      expect(textContent).toContain(text);
    });

    it('should handle empty paragraphs', () => {
      editor.setContent('<p></p>');
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).toContain('<blockquote>');
    });
  });

  describe('isBlockquoteActive command', () => {
    it('should return false for regular paragraph', () => {
      const isActive = editor.executeCommand('isBlockquoteActive');
      expect(isActive).toBe(false);
    });

    it('should return true when cursor is in blockquote', () => {
      editor.setContent('<blockquote><p>Quote</p></blockquote>');
      const isActive = editor.executeCommand('isBlockquoteActive');
      expect(isActive).toBe(true);
    });

    it('should return false for heading', () => {
      editor.setContent('<h1>Heading</h1>');
      const isActive = editor.executeCommand('isBlockquoteActive');
      expect(isActive).toBe(false);
    });

    it('should return false for list item', () => {
      editor.setContent('<ul><li><p>Item</p></li></ul>');
      const isActive = editor.executeCommand('isBlockquoteActive');
      expect(isActive).toBe(false);
    });
  });

  describe('content preservation', () => {
    it('should preserve inline formatting in blockquote', () => {
      editor.setContent('<p>Text with <strong>bold</strong> and <em>italic</em></p>');
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).toContain('<blockquote>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    it('should maintain paragraph structure when wrapping', () => {
      editor.setContent('<p>First paragraph</p>');
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).toMatch(/<blockquote><p>First paragraph<\/p><\/blockquote>/);
    });
  });

  describe('nested structures', () => {
    it('should handle wrapping heading in blockquote', () => {
      editor.setContent('<h2>Heading</h2>');
      editor.executeCommand('toggleBlockquote');
      const html = editor.getHTML();
      expect(html).toContain('<blockquote>');
      expect(html).toContain('<h2>Heading</h2>');
    });
  });
});
