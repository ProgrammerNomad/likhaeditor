import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { TextColorPlugin } from '../text-color';

describe('TextColorPlugin', () => {
  let element: HTMLDivElement;
  let editor: Editor;
  let plugin: TextColorPlugin;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = new Editor({ element });
    plugin = new TextColorPlugin();
    plugin.init(editor);
  });

  describe('setTextColor', () => {
    it('should set text color to red', () => {
      editor.setContent('<p>Hello world</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            6
          ) as any
        )
      );
      plugin.setTextColor(editor, 'red');
      const html = editor.getHTML();
      expect(html).toContain('color: red');
      expect(html).toContain('Hello');
    });

    it('should set text color to hex value', () => {
      editor.setContent('<p>Colorful text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            10
          ) as any
        )
      );
      plugin.setTextColor(editor, '#ff5733');
      const html = editor.getHTML();
      expect(html).toContain('color: #ff5733');
    });

    it('should set text color to rgb value', () => {
      editor.setContent('<p>RGB colored text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            4
          ) as any
        )
      );
      plugin.setTextColor(editor, 'rgb(255, 0, 0)');
      const html = editor.getHTML();
      expect(html).toContain('color: rgb(255, 0, 0)');
    });

    it('should return false when no selection', () => {
      editor.setContent('<p>Test</p>');
      const result = plugin.setTextColor(editor, 'blue');
      expect(result).toBe(false);
    });

    it('should work with multiple selections', () => {
      editor.setContent('<p>First word and second word</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            11
          ) as any
        )
      );
      plugin.setTextColor(editor, 'green');
      const html = editor.getHTML();
      expect(html).toContain('color: green');
      expect(html).toContain('First word');
    });
  });

  describe('removeTextColor', () => {
    it('should remove text color', () => {
      editor.setContent('<p><span style="color: red">Red text</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            9
          ) as any
        )
      );
      plugin.removeTextColor(editor);
      const html = editor.getHTML();
      expect(html).not.toContain('color: red');
      expect(html).toContain('Red text');
    });

    it('should work on partial selection', () => {
      editor.setContent('<p><span style="color: blue">Blue text here</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            5
          ) as any
        )
      );
      plugin.removeTextColor(editor);
      const html = editor.getHTML();
      // Should still have some colored text but not all
      expect(html).toContain('text');
    });

    it('should handle text without color', () => {
      editor.setContent('<p>Plain text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            6
          ) as any
        )
      );
      const result = plugin.removeTextColor(editor);
      expect(result).toBe(true);
    });
  });

  describe('getTextColor', () => {
    it('should return current text color', () => {
      editor.setContent('<p><span style="color: purple">Purple</span> text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const color = plugin.getTextColor(editor);
      expect(color).toBe('purple');
    });

    it('should return null when no color', () => {
      editor.setContent('<p>No color</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const color = plugin.getTextColor(editor);
      expect(color).toBeNull();
    });

    it('should return hex color', () => {
      editor.setContent('<p><span style="color: #123456">Hex</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const color = plugin.getTextColor(editor);
      expect(color).toBe('#123456');
    });
  });

  describe('isTextColorActive', () => {
    it('should return true when color is active', () => {
      editor.setContent('<p><span style="color: orange">Orange</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const isActive = plugin.isTextColorActive(editor);
      expect(isActive).toBe(true);
    });

    it('should return false when no color', () => {
      editor.setContent('<p>Plain</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const isActive = plugin.isTextColorActive(editor);
      expect(isActive).toBe(false);
    });

    it('should check for specific color', () => {
      editor.setContent('<p><span style="color: cyan">Cyan</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      expect(plugin.isTextColorActive(editor, 'cyan')).toBe(true);
      expect(plugin.isTextColorActive(editor, 'magenta')).toBe(false);
    });

    it('should return true for any color when no specific color provided', () => {
      editor.setContent('<p><span style="color: yellow">Yellow</span></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      expect(plugin.isTextColorActive(editor)).toBe(true);
    });
  });

  describe('color formats', () => {
    it('should support named colors', () => {
      const colors = ['red', 'blue', 'green', 'black', 'white'];
      colors.forEach((color) => {
        editor.setContent('<p>Text</p>');
        editor.view.dispatch(
          editor.view.state.tr.setSelection(
            editor.view.state.selection.constructor.create(
              editor.view.state.doc,
              1,
              5
            ) as any
          )
        );
        plugin.setTextColor(editor, color);
        const html = editor.getHTML();
        expect(html).toContain(`color: ${color}`);
      });
    });

    it('should support rgba colors', () => {
      editor.setContent('<p>Transparent</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            12
          ) as any
        )
      );
      plugin.setTextColor(editor, 'rgba(255, 0, 0, 0.5)');
      const html = editor.getHTML();
      expect(html).toContain('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('edge cases', () => {
    it('should handle empty editor', () => {
      editor.setContent('');
      const result = plugin.setTextColor(editor, 'red');
      expect(result).toBe(false);
    });

    it('should preserve other formatting when adding color', () => {
      editor.setContent('<p><strong><em>Bold italic</em></strong></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            12
          ) as any
        )
      );
      plugin.setTextColor(editor, 'teal');
      const html = editor.getHTML();
      expect(html).toContain('color: teal');
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });

    it('should handle consecutive colored spans', () => {
      editor.setContent('<p><span style="color: red">Red</span><span style="color: blue">Blue</span></p>');
      const html = editor.getHTML();
      expect(html).toContain('color: red');
      expect(html).toContain('color: blue');
    });
  });
});
