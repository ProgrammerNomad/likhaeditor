import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { HighlightPlugin } from '../highlight';

describe('HighlightPlugin', () => {
  let element: HTMLDivElement;
  let editor: Editor;
  let plugin: HighlightPlugin;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = new Editor({ element });
    plugin = new HighlightPlugin();
    plugin.init(editor);
  });

  describe('setHighlight', () => {
    it('should set highlight to yellow by default', () => {
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
      plugin.setHighlight(editor);
      const html = editor.getHTML();
      expect(html).toContain('background-color: yellow');
      expect(html).toContain('Hello');
    });

    it('should set highlight to custom color', () => {
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
      plugin.setHighlight(editor, 'lightgreen');
      const html = editor.getHTML();
      expect(html).toContain('background-color: lightgreen');
    });

    it('should set highlight to hex color', () => {
      editor.setContent('<p>Hex highlighted text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            4
          ) as any
        )
      );
      plugin.setHighlight(editor, '#ffcc00');
      const html = editor.getHTML();
      expect(html).toContain('background-color: #ffcc00');
    });

    it('should set highlight to rgb color', () => {
      editor.setContent('<p>RGB highlighted text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            4
          ) as any
        )
      );
      plugin.setHighlight(editor, 'rgb(255, 255, 0)');
      const html = editor.getHTML();
      expect(html).toContain('background-color: rgb(255, 255, 0)');
    });

    it('should return false when no selection', () => {
      editor.setContent('<p>Test</p>');
      const result = plugin.setHighlight(editor);
      expect(result).toBe(false);
    });

    it('should work with multiple words', () => {
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
      plugin.setHighlight(editor, 'cyan');
      const html = editor.getHTML();
      expect(html).toContain('background-color: cyan');
      expect(html).toContain('First word');
    });
  });

  describe('removeHighlight', () => {
    it('should remove highlight', () => {
      editor.setContent('<p><mark style="background-color: yellow">Highlighted text</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            17
          ) as any
        )
      );
      plugin.removeHighlight(editor);
      const html = editor.getHTML();
      expect(html).not.toContain('background-color');
      expect(html).toContain('Highlighted text');
    });

    it('should work on partial selection', () => {
      editor.setContent('<p><mark style="background-color: lightblue">Highlighted text here</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            12
          ) as any
        )
      );
      plugin.removeHighlight(editor);
      const html = editor.getHTML();
      expect(html).toContain('text');
    });

    it('should handle text without highlight', () => {
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
      const result = plugin.removeHighlight(editor);
      expect(result).toBe(true);
    });
  });

  describe('getHighlight', () => {
    it('should return current highlight color', () => {
      editor.setContent('<p><mark style="background-color: pink">Pink</mark> text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const color = plugin.getHighlight(editor);
      expect(color).toBe('pink');
    });

    it('should return null when no highlight', () => {
      editor.setContent('<p>No highlight</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const color = plugin.getHighlight(editor);
      expect(color).toBeNull();
    });

    it('should return hex color', () => {
      editor.setContent('<p><mark style="background-color: #abcdef">Hex</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const color = plugin.getHighlight(editor);
      expect(color).toBe('#abcdef');
    });
  });

  describe('isHighlightActive', () => {
    it('should return true when highlight is active', () => {
      editor.setContent('<p><mark style="background-color: orange">Orange</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            3
          ) as any
        )
      );
      const isActive = plugin.isHighlightActive(editor);
      expect(isActive).toBe(true);
    });

    it('should return false when no highlight', () => {
      editor.setContent('<p>Plain</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const isActive = plugin.isHighlightActive(editor);
      expect(isActive).toBe(false);
    });

    it('should check for specific color', () => {
      editor.setContent('<p><mark style="background-color: lime">Lime</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      expect(plugin.isHighlightActive(editor, 'lime')).toBe(true);
      expect(plugin.isHighlightActive(editor, 'red')).toBe(false);
    });

    it('should return true for any highlight when no specific color provided', () => {
      editor.setContent('<p><mark style="background-color: aqua">Aqua</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      expect(plugin.isHighlightActive(editor)).toBe(true);
    });
  });

  describe('toggleHighlight', () => {
    it('should add highlight when not active', () => {
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
      plugin.toggleHighlight(editor);
      const html = editor.getHTML();
      expect(html).toContain('background-color: yellow');
    });

    it('should remove highlight when active', () => {
      editor.setContent('<p><mark style="background-color: yellow">Highlighted</mark></p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            1,
            12
          ) as any
        )
      );
      plugin.toggleHighlight(editor, 'yellow');
      const html = editor.getHTML();
      expect(html).not.toContain('background-color: yellow');
    });

    it('should use custom color when toggling on', () => {
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
      plugin.toggleHighlight(editor, 'lightcoral');
      const html = editor.getHTML();
      expect(html).toContain('background-color: lightcoral');
    });
  });

  describe('color formats', () => {
    it('should support named colors', () => {
      const colors = ['yellow', 'lightgreen', 'lightblue', 'pink', 'lavender'];
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
        plugin.setHighlight(editor, color);
        const html = editor.getHTML();
        expect(html).toContain(`background-color: ${color}`);
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
      plugin.setHighlight(editor, 'rgba(255, 255, 0, 0.3)');
      const html = editor.getHTML();
      expect(html).toContain('rgba(255, 255, 0, 0.3)');
    });
  });

  describe('edge cases', () => {
    it('should handle empty editor', () => {
      editor.setContent('');
      const result = plugin.setHighlight(editor);
      expect(result).toBe(false);
    });

    it('should preserve other formatting when adding highlight', () => {
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
      plugin.setHighlight(editor, 'yellow');
      const html = editor.getHTML();
      expect(html).toContain('background-color: yellow');
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
    });

    it('should handle consecutive highlighted spans', () => {
      editor.setContent('<p><mark style="background-color: yellow">Yellow</mark><mark style="background-color: green">Green</mark></p>');
      const html = editor.getHTML();
      expect(html).toContain('background-color: yellow');
      expect(html).toContain('background-color: green');
    });

    it('should work with text color and highlight together', () => {
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
      plugin.setHighlight(editor, 'yellow');
      const html = editor.getHTML();
      expect(html).toContain('background-color: yellow');
    });
  });
});
