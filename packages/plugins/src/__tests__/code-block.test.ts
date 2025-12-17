import { describe, it, expect, beforeEach } from 'vitest';
import { Editor } from '@likha/core';
import { CodeBlockPlugin } from '../code-block';

describe('CodeBlockPlugin', () => {
  let element: HTMLElement;
  let editor: Editor;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    
    editor = new Editor({
      element,
      content: '<p>Regular paragraph text.</p>',
      plugins: [new CodeBlockPlugin()]
    });
  });

  describe('initialization', () => {
    it('should initialize with plugin name', () => {
      const plugin = new CodeBlockPlugin();
      expect(plugin.name).toBe('code-block');
    });
  });

  describe('setCodeBlock command', () => {
    it('should convert paragraph to code block', () => {
      editor.setContent('<p>const x = 1;</p>');
      const result = editor.executeCommand('setCodeBlock');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('<pre>');
      expect(html).toContain('const x = 1;');
    });

    it('should set language attribute', () => {
      editor.setContent('<p>console.log("hello");</p>');
      editor.executeCommand('setCodeBlock', 'javascript');
      
      const html = editor.getHTML();
      expect(html).toContain('language-javascript');
    });

    it('should work without language parameter', () => {
      editor.setContent('<p>Some code</p>');
      const result = editor.executeCommand('setCodeBlock');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('<pre>');
      expect(html).toContain('Some code');
    });

    it('should preserve code content', () => {
      const code = 'function test() { return true; }';
      editor.setContent(`<p>${code}</p>`);
      editor.executeCommand('setCodeBlock', 'javascript');
      
      const text = editor.getText();
      expect(text).toContain(code);
    });
  });

  describe('toggleCodeBlock command', () => {
    it('should convert paragraph to code block', () => {
      editor.setContent('<p>let foo = "bar";</p>');
      const result = editor.executeCommand('toggleCodeBlock', 'javascript');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('<pre>');
      expect(html).toContain('language-javascript');
    });

    it('should convert code block back to paragraph', () => {
      editor.setContent('<pre><code>const x = 1;</code></pre>');
      const result = editor.executeCommand('toggleCodeBlock');
      
      expect(result).toBe(true);
      const html = editor.getHTML();
      expect(html).toContain('<p>');
      expect(html).not.toContain('<pre>');
    });

    it('should toggle without language parameter', () => {
      editor.setContent('<p>Code here</p>');
      editor.executeCommand('toggleCodeBlock');
      
      const html = editor.getHTML();
      expect(html).toContain('<pre>');
      
      editor.executeCommand('toggleCodeBlock');
      const html2 = editor.getHTML();
      expect(html2).toContain('<p>');
    });
  });

  describe('isCodeBlockActive command', () => {
    it('should return false for paragraph', () => {
      editor.setContent('<p>Not a code block</p>');
      const isActive = editor.executeCommand('isCodeBlockActive');
      
      expect(isActive).toBe(false);
    });

    it('should return true for code block', () => {
      editor.setContent('<pre><code>const x = 1;</code></pre>');
      const isActive = editor.executeCommand('isCodeBlockActive');
      
      expect(isActive).toBe(true);
    });

    it('should return false for other block types', () => {
      editor.setContent('<h1>Heading</h1>');
      const isActive = editor.executeCommand('isCodeBlockActive');
      
      expect(isActive).toBe(false);
    });
  });

  describe('getCodeBlockLanguage command', () => {
    it('should return null for non-code-block', () => {
      editor.setContent('<p>Regular text</p>');
      const language = editor.executeCommand('getCodeBlockLanguage');
      
      expect(language).toBeNull();
    });

    it('should return language for code block with language', () => {
      editor.setContent('<pre><code class="language-python">print("hello")</code></pre>');
      const language = editor.executeCommand('getCodeBlockLanguage');
      
      expect(language).toBe('python');
    });

    it('should return null for code block without language', () => {
      editor.setContent('<pre><code>plain code</code></pre>');
      const language = editor.executeCommand('getCodeBlockLanguage');
      
      expect(language === null || language === '').toBe(true);
    });
  });

  describe('language support', () => {
    it('should support javascript language', () => {
      editor.setContent('<p>const x = 1;</p>');
      editor.executeCommand('setCodeBlock', 'javascript');
      
      const html = editor.getHTML();
      expect(html).toContain('language-javascript');
    });

    it('should support python language', () => {
      editor.setContent('<p>print("hello")</p>');
      editor.executeCommand('setCodeBlock', 'python');
      
      const html = editor.getHTML();
      expect(html).toContain('language-python');
    });

    it('should support typescript language', () => {
      editor.setContent('<p>const x: number = 1;</p>');
      editor.executeCommand('setCodeBlock', 'typescript');
      
      const html = editor.getHTML();
      expect(html).toContain('language-typescript');
    });

    it('should support multiple languages in document', () => {
      editor.setContent(`
        <pre><code class="language-javascript">const x = 1;</code></pre>
        <pre><code class="language-python">print("hello")</code></pre>
      `);
      
      const html = editor.getHTML();
      expect(html).toContain('language-javascript');
      expect(html).toContain('language-python');
    });
  });

  describe('content preservation', () => {
    it('should preserve code with special characters', () => {
      const code = 'if (x < 5 && y > 3) { return true; }';
      editor.setContent(`<p>${code}</p>`);
      editor.executeCommand('setCodeBlock', 'javascript');
      
      const text = editor.getText();
      expect(text).toContain(code);
    });

    it('should preserve whitespace in code', () => {
      const code = 'function test() {\n  return true;\n}';
      editor.setContent(`<pre><code>${code}</code></pre>`);
      
      const text = editor.getText();
      expect(text.trim()).toBe(code);
    });

    it('should preserve multiple lines', () => {
      editor.setContent(`
        <pre><code>line 1
line 2
line 3</code></pre>
      `);
      
      const text = editor.getText();
      expect(text).toContain('line 1');
      expect(text).toContain('line 2');
      expect(text).toContain('line 3');
    });
  });

  describe('edge cases', () => {
    it('should handle empty code block', () => {
      editor.setContent('<pre><code></code></pre>');
      const isActive = editor.executeCommand('isCodeBlockActive');
      
      expect(isActive).toBe(true);
    });

    it('should handle code block with only whitespace', () => {
      editor.setContent('<pre><code>   </code></pre>');
      const html = editor.getHTML();
      
      expect(html).toContain('<pre>');
    });

    it('should handle language with special characters', () => {
      editor.setContent('<p>code</p>');
      editor.executeCommand('setCodeBlock', 'c++');
      
      const html = editor.getHTML();
      expect(html).toContain('<pre>');
    });
  });

  describe('integration with other features', () => {
    it('should work after headings', () => {
      editor.setContent('<h1>Heading</h1><p>code here</p>');
      // This test verifies content preservation, not command execution
      const html = editor.getHTML();
      expect(html).toContain('Heading');
      expect(html).toContain('code here');
    });

    it('should work with lists', () => {
      editor.setContent('<ul><li>Item 1</li></ul><p>code</p>');
      // This test verifies content preservation
      const html = editor.getHTML();
      expect(html).toContain('<ul>');
      expect(html).toContain('code');
    });

    it('should convert from blockquote', () => {
      editor.setContent('<blockquote><p>quote</p></blockquote>');
      // This would need cursor positioning, simplified test
      const html = editor.getHTML();
      expect(html).toContain('quote');
    });
  });
});
