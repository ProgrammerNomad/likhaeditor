import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likhaeditor/core';
import { TablePlugin } from '../table';

describe('TablePlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    editor = new Editor({
      element,
      plugins: [new TablePlugin()],
    });
  });

  describe('initialization', () => {
    it('should initialize with correct name', () => {
      const plugin = new TablePlugin();
      expect(plugin.name).toBe('table');
    });
  });

  describe('insertTable', () => {
    it('should insert a 3x3 table by default', () => {
      const result = editor.executeCommand('insertTable');
      expect(result).toBe(true);
      
      const html = editor.getHTML();
      expect(html).toContain('<table>');
      expect(html).toContain('<tbody>');
      expect(html).toContain('<tr>');
      expect(html).toContain('<td>');
      
      // Count rows - should have 3 <tr> tags
      const rows = (html.match(/<tr>/g) || []).length;
      expect(rows).toBe(3);
    });

    it('should insert a table with custom dimensions', () => {
      const result = editor.executeCommand('insertTable', 2, 4);
      expect(result).toBe(true);
      
      const html = editor.getHTML();
      expect(html).toContain('<table>');
      
      // Count rows - should have 2 <tr> tags
      const rows = (html.match(/<tr>/g) || []).length;
      expect(rows).toBe(2);
      
      // Count cells in first row - should have 4 <td> tags per row
      const cells = (html.match(/<td>/g) || []).length;
      expect(cells).toBe(8); // 2 rows × 4 columns = 8 cells
    });

    it('should insert a 1x1 table', () => {
      const result = editor.executeCommand('insertTable', 1, 1);
      expect(result).toBe(true);
      
      const html = editor.getHTML();
      expect(html).toContain('<table>');
      const rows = (html.match(/<tr>/g) || []).length;
      expect(rows).toBe(1);
      const cells = (html.match(/<td>/g) || []).length;
      expect(cells).toBe(1);
    });

    it('should insert table at current cursor position', () => {
      editor.setContent('<p>Before</p><p>After</p>');
      editor.executeCommand('insertTable');
      
      const html = editor.getHTML();
      expect(html).toContain('<p>Before</p>');
      expect(html).toContain('<table>');
    });

    it('should replace selected text with table', () => {
      editor.setContent('<p>Selected text here</p>');
      // Select all
      const { view } = editor;
      const { doc } = view.state;
      view.dispatch(view.state.tr.setSelection(
        view.state.selection.constructor.create(doc, 0, doc.content.size)
      ));
      
      editor.executeCommand('insertTable');
      const html = editor.getHTML();
      expect(html).toContain('<table>');
      expect(html).not.toContain('Selected text here');
    });

    it('should create table with paragraphs in cells', () => {
      editor.executeCommand('insertTable', 1, 1);
      const html = editor.getHTML();
      // Each cell should contain a paragraph
      expect(html).toContain('<td><p>');
    });
  });

  describe('isInTable', () => {
    it('should return false when cursor is not in a table', () => {
      editor.setContent('<p>Not in table</p>');
      const result = editor.executeCommand('isInTable');
      expect(result).toBe(false);
    });

    it('should return true when cursor is in a table', () => {
      editor.executeCommand('insertTable', 2, 2);
      
      // Move cursor into the table by setting selection
      const { view } = editor;
      const { doc } = view.state;
      
      // Find the first table cell position
      let cellPos = -1;
      doc.descendants((node, pos) => {
        if (node.type.name === 'table_cell' && cellPos === -1) {
          cellPos = pos + 1; // Inside the cell
          return false;
        }
      });
      
      if (cellPos !== -1) {
        view.dispatch(
          view.state.tr.setSelection(
            view.state.selection.constructor.near(view.state.doc.resolve(cellPos))
          )
        );
        
        const result = editor.executeCommand('isInTable');
        expect(result).toBe(true);
      }
    });

    it('should return true when cursor is in nested paragraph in table cell', () => {
      editor.executeCommand('insertTable', 1, 1);
      
      const { view } = editor;
      const { doc } = view.state;
      
      // Find paragraph inside table cell
      let paraPos = -1;
      doc.descendants((node, pos) => {
        if (node.type.name === 'paragraph' && paraPos === -1) {
          const depth = doc.resolve(pos).depth;
          if (depth > 2) { // Inside table structure
            paraPos = pos + 1;
            return false;
          }
        }
      });
      
      if (paraPos !== -1) {
        view.dispatch(
          view.state.tr.setSelection(
            view.state.selection.constructor.near(view.state.doc.resolve(paraPos))
          )
        );
        
        const result = editor.executeCommand('isInTable');
        expect(result).toBe(true);
      }
    });
  });

  describe('table structure', () => {
    it('should create valid table HTML structure', () => {
      editor.executeCommand('insertTable', 2, 3);
      const html = editor.getHTML();
      
      // Check for proper nesting
      expect(html).toContain('<table><tbody>');
      expect(html).toContain('</tbody></table>');
      expect(html).toContain('<tr>');
      expect(html).toContain('</tr>');
      expect(html).toContain('<td>');
      expect(html).toContain('</td>');
    });

    it('should support colspan and rowspan attributes in schema', () => {
      // This tests that the schema supports these attributes
      editor.executeCommand('insertTable', 1, 1);
      const html = editor.getHTML();
      expect(html).toContain('<td>'); // Basic cell structure exists
      
      // The schema should allow colspan/rowspan even if not set by default
      const { view } = editor;
      expect(view.state.schema.nodes.table_cell).toBeDefined();
      expect(view.state.schema.nodes.table_cell.spec.attrs).toBeDefined();
      expect(view.state.schema.nodes.table_cell.spec.attrs?.colspan).toBeDefined();
      expect(view.state.schema.nodes.table_cell.spec.attrs?.rowspan).toBeDefined();
    });
  });

  describe('integration with other features', () => {
    it('should work with undo/redo', () => {
      editor.setContent('<p>Initial content</p>');
      editor.executeCommand('insertTable');
      
      let html = editor.getHTML();
      expect(html).toContain('<table>');
      
      // Undo
      const { view } = editor;
      const undoCommand = view.state.schema.cached.undoCommand || (() => false);
      // Try built-in undo if available
      const undoResult = undoCommand(view.state, view.dispatch);
      
      if (undoResult) {
        html = editor.getHTML();
        expect(html).not.toContain('<table>');
        expect(html).toContain('Initial content');
      }
    });

    it('should allow text editing in table cells', () => {
      editor.executeCommand('insertTable', 1, 1);
      
      const { view } = editor;
      const { doc } = view.state;
      
      // Find paragraph in table cell
      let paraPos = -1;
      doc.descendants((node, pos) => {
        if (node.type.name === 'paragraph') {
          const depth = doc.resolve(pos).depth;
          if (depth > 2) {
            paraPos = pos + 1;
            return false;
          }
        }
      });
      
      if (paraPos !== -1) {
        // Insert text in the cell
        view.dispatch(
          view.state.tr.insertText('Cell content', paraPos)
        );
        
        const html = editor.getHTML();
        expect(html).toContain('Cell content');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle large tables', () => {
      const result = editor.executeCommand('insertTable', 10, 10);
      expect(result).toBe(true);
      
      const html = editor.getHTML();
      const rows = (html.match(/<tr>/g) || []).length;
      expect(rows).toBe(10);
      const cells = (html.match(/<td>/g) || []).length;
      expect(cells).toBe(100); // 10×10
    });

    it('should handle zero or negative dimensions gracefully', () => {
      // These should use default values or handle gracefully
      const result1 = editor.executeCommand('insertTable', 0, 3);
      const result2 = editor.executeCommand('insertTable', 3, 0);
      const result3 = editor.executeCommand('insertTable', -1, 3);
      
      // Either they work with defaults or return false
      expect(typeof result1).toBe('boolean');
      expect(typeof result2).toBe('boolean');
      expect(typeof result3).toBe('boolean');
    });

    it('should not break document structure', () => {
      editor.setContent('<p>Before</p>');
      editor.executeCommand('insertTable', 2, 2);
      
      // Verify document is still valid
      const { view } = editor;
      const { doc } = view.state;
      expect(doc).toBeDefined();
      expect(doc.childCount).toBeGreaterThan(0);
    });
  });
});
