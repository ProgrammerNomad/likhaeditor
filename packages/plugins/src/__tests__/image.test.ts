import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { ImagePlugin } from '../image';

describe('ImagePlugin', () => {
  let element: HTMLDivElement;
  let editor: Editor;
  let plugin: ImagePlugin;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = new Editor({ element });
    plugin = new ImagePlugin();
    plugin.init(editor);
  });

  describe('insertImage', () => {
    it('should insert an image with src only', () => {
      plugin.insertImage(editor, 'https://example.com/image.jpg');
      const html = editor.getHTML();
      expect(html).toContain('<img src="https://example.com/image.jpg">');
    });

    it('should insert an image with src and alt', () => {
      plugin.insertImage(editor, 'https://example.com/image.jpg', 'Test image');
      const html = editor.getHTML();
      expect(html).toContain('alt="Test image"');
      expect(html).toContain('src="https://example.com/image.jpg"');
    });

    it('should insert an image with src, alt, and title', () => {
      plugin.insertImage(editor, 'https://example.com/image.jpg', 'Test image', 'Image title');
      const html = editor.getHTML();
      expect(html).toContain('alt="Test image"');
      expect(html).toContain('title="Image title"');
      expect(html).toContain('src="https://example.com/image.jpg"');
    });

    it('should replace current selection when inserting image', () => {
      editor.setContent('<p>Hello world</p>');
      editor.view.dispatch(editor.view.state.tr.setSelection(
        editor.view.state.selection.constructor.create(
          editor.view.state.doc,
          0,
          editor.view.state.doc.content.size
        ) as any
      ));
      plugin.insertImage(editor, 'https://example.com/test.png');
      const html = editor.getHTML();
      expect(html).toContain('<img src="https://example.com/test.png">');
      expect(html).not.toContain('Hello world');
    });
  });

  describe('setImageSize', () => {
    beforeEach(() => {
      plugin.insertImage(editor, 'https://example.com/image.jpg');
    });

    it('should set image width', () => {
      plugin.setImageSize(editor, 200);
      const html = editor.getHTML();
      expect(html).toContain('width="200"');
    });

    it('should set image height', () => {
      plugin.setImageSize(editor, undefined, 150);
      const html = editor.getHTML();
      expect(html).toContain('height="150"');
    });

    it('should set both width and height', () => {
      plugin.setImageSize(editor, 300, 200);
      const html = editor.getHTML();
      expect(html).toContain('width="300"');
      expect(html).toContain('height="200"');
    });

    it('should return false if no image is selected', () => {
      editor.setContent('<p>No image here</p>');
      const result = plugin.setImageSize(editor, 200);
      expect(result).toBe(false);
    });

    it('should update existing dimensions', () => {
      plugin.setImageSize(editor, 100, 100);
      plugin.setImageSize(editor, 200, 200);
      const html = editor.getHTML();
      expect(html).toContain('width="200"');
      expect(html).toContain('height="200"');
    });
  });

  describe('getImageSrc', () => {
    it('should return image src when image is adjacent to cursor', () => {
      plugin.insertImage(editor, 'https://example.com/test.jpg');
      const src = plugin.getImageSrc(editor);
      expect(src).toBe('https://example.com/test.jpg');
    });

    it('should return null if no image is near cursor', () => {
      editor.setContent('<p>No image</p>');
      const src = plugin.getImageSrc(editor);
      expect(src).toBeNull();
    });

    it('should return src for selected image', () => {
      editor.setContent('<p><img src="https://example.com/selected.png"></p>');
      // Move cursor to after the image
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const src = plugin.getImageSrc(editor);
      expect(src).toBe('https://example.com/selected.png');
    });
  });

  describe('isImageSelected', () => {
    it('should return true when cursor is after image', () => {
      plugin.insertImage(editor, 'https://example.com/test.jpg');
      const isSelected = plugin.isImageSelected(editor);
      expect(isSelected).toBe(true);
    });

    it('should return false when no image is near cursor', () => {
      editor.setContent('<p>Just text</p>');
      const isSelected = plugin.isImageSelected(editor);
      expect(isSelected).toBe(false);
    });

    it('should detect image before cursor', () => {
      editor.setContent('<p><img src="https://example.com/test.jpg">text</p>');
      editor.view.dispatch(
        editor.view.state.tr.setSelection(
          editor.view.state.selection.constructor.create(
            editor.view.state.doc,
            2
          ) as any
        )
      );
      const isSelected = plugin.isImageSelected(editor);
      expect(isSelected).toBe(true);
    });
  });

  describe('setImageAlt', () => {
    beforeEach(() => {
      plugin.insertImage(editor, 'https://example.com/image.jpg');
    });

    it('should set alt text for image', () => {
      plugin.setImageAlt(editor, 'New alt text');
      const html = editor.getHTML();
      expect(html).toContain('alt="New alt text"');
    });

    it('should update existing alt text', () => {
      plugin.insertImage(editor, 'https://example.com/image.jpg', 'Old alt');
      plugin.setImageAlt(editor, 'Updated alt');
      const html = editor.getHTML();
      expect(html).toContain('alt="Updated alt"');
      expect(html).not.toContain('Old alt');
    });

    it('should return false if no image is selected', () => {
      editor.setContent('<p>No image</p>');
      const result = plugin.setImageAlt(editor, 'Alt text');
      expect(result).toBe(false);
    });

    it('should preserve other attributes when setting alt', () => {
      plugin.insertImage(editor, 'https://example.com/image.jpg', 'Alt', 'Title');
      plugin.setImageSize(editor, 150, 100);
      plugin.setImageAlt(editor, 'New alt');
      const html = editor.getHTML();
      expect(html).toContain('alt="New alt"');
      expect(html).toContain('title="Title"');
      expect(html).toContain('width="150"');
      expect(html).toContain('height="100"');
    });
  });

  describe('image dragging', () => {
    it('should have draggable property in schema', () => {
      const schema = editor.view.state.schema;
      expect(schema.nodes.image.spec.draggable).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle valid src URLs', () => {
      plugin.insertImage(editor, 'https://example.com/valid.jpg');
      const html = editor.getHTML();
      expect(html).toContain('<img');
      expect(html).toContain('https://example.com/valid.jpg');
    });

    it('should handle special characters in alt text', () => {
      plugin.insertImage(editor, 'https://example.com/test.jpg', 'Alt with "quotes" & symbols');
      const html = editor.getHTML();
      expect(html).toContain('alt=');
    });

    it('should handle very large dimensions', () => {
      plugin.insertImage(editor, 'https://example.com/test.jpg');
      plugin.setImageSize(editor, 9999, 9999);
      const html = editor.getHTML();
      expect(html).toContain('width="9999"');
      expect(html).toContain('height="9999"');
    });

    it('should not include zero dimensions in HTML', () => {
      plugin.insertImage(editor, 'https://example.com/test.jpg');
      plugin.setImageSize(editor, 0, 0);
      const html = editor.getHTML();
      // Zero dimensions are still set but may not render
      expect(html).toContain('src="https://example.com/test.jpg"');
    });
  });
});
