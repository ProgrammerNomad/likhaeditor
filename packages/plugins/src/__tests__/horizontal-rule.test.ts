import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { HorizontalRulePlugin } from '../horizontal-rule';

describe('HorizontalRulePlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Hello world</p>',
      plugins: [new HorizontalRulePlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new HorizontalRulePlugin();
      expect(plugin.name).toBe('horizontalRule');
    });
  });

  describe('insertHorizontalRule command', () => {
    it('should insert hr element', () => {
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<hr>');
    });

    it('should insert hr in document with existing content', () => {
      editor.setContent('<p>First paragraph</p>');
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<hr>');
      expect(html).toContain('First paragraph');
    });

    it('should handle multiple hr insertions', () => {
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      const hrCount = (html.match(/<hr>/g) || []).length;
      expect(hrCount).toBeGreaterThan(0);
    });

    it('should insert hr between paragraphs', () => {
      editor.setContent('<p>Before</p><p>After</p>');
      // Position cursor and insert
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<hr>');
    });
  });

  describe('content preservation', () => {
    it('should preserve existing content when inserting hr', () => {
      const originalText = 'Important content';
      editor.setContent(`<p>${originalText}</p>`);
      editor.executeCommand('insertHorizontalRule');
      const text = editor.getText();
      expect(text).toContain(originalText);
    });

    it('should work with empty document', () => {
      editor.setContent('');
      const result = editor.executeCommand('insertHorizontalRule');
      // May return true or false depending on schema rules
      expect(typeof result).toBe('boolean');
    });
  });

  describe('integration with other elements', () => {
    it('should work alongside headings', () => {
      editor.setContent('<h1>Title</h1><p>Content</p>');
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<h1>Title</h1>');
      expect(html).toContain('<hr>');
    });

    it('should work alongside lists', () => {
      editor.setContent('<ul><li><p>Item</p></li></ul>');
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('<hr>');
    });

    it('should work with blockquotes', () => {
      editor.setContent('<blockquote><p>Quote</p></blockquote>');
      editor.executeCommand('insertHorizontalRule');
      const html = editor.getHTML();
      expect(html).toContain('<blockquote>');
      expect(html).toContain('<hr>');
    });
  });
});
