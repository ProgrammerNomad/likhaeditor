import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { HeadingPlugin } from '../heading';

describe('HeadingPlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Hello world</p>',
      plugins: [new HeadingPlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new HeadingPlugin();
      expect(plugin.name).toBe('heading');
    });
  });

  describe('setHeading command', () => {
    it('should convert paragraph to H1', () => {
      editor.executeCommand('setHeading', 1);
      const html = editor.getHTML();
      expect(html).toContain('<h1>Hello world</h1>');
    });

    it('should convert paragraph to H2', () => {
      editor.executeCommand('setHeading', 2);
      const html = editor.getHTML();
      expect(html).toContain('<h2>Hello world</h2>');
    });

    it('should convert paragraph to H3', () => {
      editor.executeCommand('setHeading', 3);
      const html = editor.getHTML();
      expect(html).toContain('<h3>Hello world</h3>');
    });

    it('should convert paragraph to H4', () => {
      editor.executeCommand('setHeading', 4);
      const html = editor.getHTML();
      expect(html).toContain('<h4>Hello world</h4>');
    });

    it('should convert paragraph to H5', () => {
      editor.executeCommand('setHeading', 5);
      const html = editor.getHTML();
      expect(html).toContain('<h5>Hello world</h5>');
    });

    it('should convert paragraph to H6', () => {
      editor.executeCommand('setHeading', 6);
      const html = editor.getHTML();
      expect(html).toContain('<h6>Hello world</h6>');
    });

    it('should change heading level from H1 to H3', () => {
      editor.setContent('<h1>Heading</h1>');
      editor.executeCommand('setHeading', 3);
      const html = editor.getHTML();
      expect(html).toContain('<h3>Heading</h3>');
      expect(html).not.toContain('<h1>');
    });
  });

  describe('toggleHeading command', () => {
    it('should toggle paragraph to H1', () => {
      editor.executeCommand('toggleHeading', 1);
      const html = editor.getHTML();
      expect(html).toContain('<h1>Hello world</h1>');
    });

    it('should toggle H1 back to paragraph', () => {
      editor.setContent('<h1>Heading</h1>');
      editor.executeCommand('toggleHeading', 1);
      const html = editor.getHTML();
      expect(html).toContain('<p>Heading</p>');
      expect(html).not.toContain('<h1>');
    });

    it('should toggle H2 to H3', () => {
      editor.setContent('<h2>Heading</h2>');
      editor.executeCommand('toggleHeading', 3);
      const html = editor.getHTML();
      expect(html).toContain('<h3>Heading</h3>');
      expect(html).not.toContain('<h2>');
    });

    it('should toggle H3 back to paragraph', () => {
      editor.setContent('<h3>Heading</h3>');
      editor.executeCommand('toggleHeading', 3);
      const html = editor.getHTML();
      expect(html).toContain('<p>Heading</p>');
      expect(html).not.toContain('<h3>');
    });
  });

  describe('isHeadingActive command', () => {
    it('should return false for paragraph', () => {
      const isActive = editor.executeCommand('isHeadingActive', 1);
      expect(isActive).toBe(false);
    });

    it('should return true for H1 when checking level 1', () => {
      editor.setContent('<h1>Heading</h1>');
      const isActive = editor.executeCommand('isHeadingActive', 1);
      expect(isActive).toBe(true);
    });

    it('should return false for H1 when checking level 2', () => {
      editor.setContent('<h1>Heading</h1>');
      const isActive = editor.executeCommand('isHeadingActive', 2);
      expect(isActive).toBe(false);
    });

    it('should return true for H3 when checking level 3', () => {
      editor.setContent('<h3>Heading</h3>');
      const isActive = editor.executeCommand('isHeadingActive', 3);
      expect(isActive).toBe(true);
    });
  });

  describe('setParagraph command', () => {
    it('should convert H1 to paragraph', () => {
      editor.setContent('<h1>Heading</h1>');
      editor.executeCommand('setParagraph');
      const html = editor.getHTML();
      expect(html).toContain('<p>Heading</p>');
      expect(html).not.toContain('<h1>');
    });

    it('should convert H6 to paragraph', () => {
      editor.setContent('<h6>Small heading</h6>');
      editor.executeCommand('setParagraph');
      const html = editor.getHTML();
      expect(html).toContain('<p>Small heading</p>');
      expect(html).not.toContain('<h6>');
    });

    it('should keep paragraph as paragraph', () => {
      editor.setContent('<p>Already a paragraph</p>');
      editor.executeCommand('setParagraph');
      const html = editor.getHTML();
      expect(html).toContain('<p>Already a paragraph</p>');
    });
  });

  describe('content preservation', () => {
    it('should preserve text content when changing heading level', () => {
      const text = 'Important heading with special chars !@#$%';
      editor.setContent(`<h1>${text}</h1>`);
      editor.executeCommand('setHeading', 4);
      const textContent = editor.getText();
      expect(textContent).toContain(text);
    });

    it('should preserve inline formatting when converting to heading', () => {
      editor.setContent('<p>Text with <strong>bold</strong> and <em>italic</em></p>');
      editor.executeCommand('setHeading', 2);
      const html = editor.getHTML();
      expect(html).toContain('<h2>');
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });
  });
});
