import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { TextAlignmentPlugin } from '../text-alignment';

describe('TextAlignmentPlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Default paragraph text.</p>',
      plugins: [new TextAlignmentPlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new TextAlignmentPlugin();
      expect(plugin.name).toBe('text-alignment');
    });
  });

  describe('setTextAlign command', () => {
    it('should set text alignment to center', () => {
      editor.setContent('<p>Center this text</p>');
      const result = editor.executeCommand('setTextAlign', 'center');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('text-align: center');
    });

    it('should set text alignment to right', () => {
      editor.setContent('<p>Right align this</p>');
      editor.executeCommand('setTextAlign', 'right');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: right');
    });

    it('should set text alignment to justify', () => {
      editor.setContent('<p>Justify this text</p>');
      editor.executeCommand('setTextAlign', 'justify');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: justify');
    });

    it('should set text alignment to left', () => {
      editor.setContent('<p style="text-align: center">Center text</p>');
      editor.executeCommand('setTextAlign', 'left');
      
      // Left alignment should not add style attribute
      const html = editor.getHTML();
      expect(html).not.toContain('text-align');
    });
  });

  describe('setAlignLeft command', () => {
    it('should align text to left', () => {
      editor.setContent('<p style="text-align: center">Text</p>');
      const result = editor.executeCommand('setAlignLeft');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).not.toContain('text-align');
    });
  });

  describe('setAlignCenter command', () => {
    it('should align text to center', () => {
      editor.setContent('<p>Text to center</p>');
      const result = editor.executeCommand('setAlignCenter');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('text-align: center');
    });
  });

  describe('setAlignRight command', () => {
    it('should align text to right', () => {
      editor.setContent('<p>Text to right align</p>');
      const result = editor.executeCommand('setAlignRight');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('text-align: right');
    });
  });

  describe('setAlignJustify command', () => {
    it('should justify text', () => {
      editor.setContent('<p>Text to justify</p>');
      const result = editor.executeCommand('setAlignJustify');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('text-align: justify');
    });
  });

  describe('getTextAlign command', () => {
    it('should return left for default alignment', () => {
      editor.setContent('<p>Default text</p>');
      const align = editor.executeCommand('getTextAlign');
      
      expect(align).toBe('left');
    });

    it('should return center for centered text', () => {
      editor.setContent('<p style="text-align: center">Centered</p>');
      const align = editor.executeCommand('getTextAlign');
      
      expect(align).toBe('center');
    });

    it('should return right for right-aligned text', () => {
      editor.setContent('<p style="text-align: right">Right</p>');
      const align = editor.executeCommand('getTextAlign');
      
      expect(align).toBe('right');
    });

    it('should return justify for justified text', () => {
      editor.setContent('<p style="text-align: justify">Justified</p>');
      const align = editor.executeCommand('getTextAlign');
      
      expect(align).toBe('justify');
    });
  });

  describe('isAlignActive command', () => {
    it('should return true for active alignment', () => {
      editor.setContent('<p style="text-align: center">Text</p>');
      const isActive = editor.executeCommand('isAlignActive', 'center');
      
      expect(isActive).toBe(true);
    });

    it('should return false for inactive alignment', () => {
      editor.setContent('<p style="text-align: center">Text</p>');
      const isActive = editor.executeCommand('isAlignActive', 'right');
      
      expect(isActive).toBe(false);
    });

    it('should return true for left on default text', () => {
      editor.setContent('<p>Default</p>');
      const isActive = editor.executeCommand('isAlignActive', 'left');
      
      expect(isActive).toBe(true);
    });
  });

  describe('alignment with headings', () => {
    it('should center align heading', () => {
      editor.setContent('<h1>Title</h1>');
      editor.executeCommand('setAlignCenter');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: center');
      expect(html).toContain('<h1');
    });

    it('should right align heading', () => {
      editor.setContent('<h2>Subtitle</h2>');
      editor.executeCommand('setAlignRight');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: right');
    });

    it('should work with multiple heading levels', () => {
      editor.setContent('<h1>H1</h1><h2>H2</h2><h3>H3</h3>');
      
      const html = editor.getHTML();
      expect(html).toContain('H1');
      expect(html).toContain('H2');
      expect(html).toContain('H3');
    });
  });

  describe('content preservation', () => {
    it('should preserve text content when changing alignment', () => {
      const text = 'Important content here';
      editor.setContent(`<p>${text}</p>`);
      editor.executeCommand('setAlignCenter');
      
      const content = editor.getText();
      expect(content).toContain(text);
    });

    it('should preserve inline formatting', () => {
      editor.setContent('<p><strong>Bold</strong> and <em>italic</em></p>');
      editor.executeCommand('setAlignRight');
      
      const html = editor.getHTML();
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });

    it('should preserve multiple paragraphs independently', () => {
      editor.setContent('<p>Para 1</p><p>Para 2</p>');
      
      const html = editor.getHTML();
      expect(html).toContain('Para 1');
      expect(html).toContain('Para 2');
    });
  });

  describe('edge cases', () => {
    it('should handle empty paragraph', () => {
      editor.setContent('<p></p>');
      const result = editor.executeCommand('setAlignCenter');
      
      expect(result).toBe(true);
    });

    it('should handle switching between alignments', () => {
      editor.setContent('<p>Text</p>');
      
      editor.executeCommand('setAlignCenter');
      let html = editor.getHTML();
      expect(html).toContain('text-align: center');
      
      editor.executeCommand('setAlignRight');
      html = editor.getHTML();
      expect(html).toContain('text-align: right');
      
      editor.executeCommand('setAlignLeft');
      html = editor.getHTML();
      expect(html).not.toContain('text-align');
    });

    it('should handle text with special characters', () => {
      editor.setContent('<p>&lt;div&gt;HTML&lt;/div&gt;</p>');
      editor.executeCommand('setAlignCenter');
      
      const text = editor.getText();
      expect(text).toContain('<div>');
    });
  });

  describe('integration', () => {
    it('should work after heading change', () => {
      editor.setContent('<h1>Title</h1>');
      editor.executeCommand('setAlignCenter');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: center');
    });

    it('should preserve alignment when toggling bold', () => {
      editor.setContent('<p style="text-align: center">Text</p>');
      
      const html = editor.getHTML();
      expect(html).toContain('text-align: center');
    });
  });
});
