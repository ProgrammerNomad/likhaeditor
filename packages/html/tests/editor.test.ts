import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEditor } from '../src/index';
import { TextSelection } from 'prosemirror-state';

const editors: ReturnType<typeof createEditor>[] = [];
function setup(options: Partial<Parameters<typeof createEditor>[0]> = {}) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = createEditor({ element, content: '<p>Hello <strong>world</strong></p>', ...options });
  editors.push(editor);
  return editor;
}
afterEach(() => {
  editors.splice(0).forEach(editor => editor.destroy());
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('plain HTML integration', () => {
  it('creates the default toolbar before the editable area', () => {
    const { toolbar, editor } = setup();
    expect(toolbar?.getElement().nextElementSibling).toBe(editor.view.dom);
  });

  it('honors toolbar configuration and cleans active timers on destroy', () => {
    vi.useFakeTimers();
    const instance = setup({ toolbarButtons: ['bold', 'italic'] });
    expect(instance.toolbar?.getElement().querySelectorAll('button')).toHaveLength(2);
    instance.destroy();
    expect(vi.getTimerCount()).toBe(0);
    expect(document.querySelector('.likha-toolbar')).toBeNull();
  });

  it('notifies document changes, excludes selection changes, and supports undo', () => {
    const onChange = vi.fn();
    const instance = setup({ onChange, toolbar: false });
    const { view } = instance.editor;
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)));
    expect(onChange).not.toHaveBeenCalled();
    instance.setContent('<p>Replacement</p>');
    expect(onChange).toHaveBeenCalledWith('<p>Replacement</p>');
    expect(instance.editor.undo()).toBe(true);
    expect(instance.getContent()).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('preserves inline spacing and code whitespace through source mode', () => {
    const instance = setup({ content: '<p>a<strong>b</strong>c</p><pre><code>  a\n    b</code></pre>' });
    const original = instance.getContent();
    instance.editor.executeCommand('toggleSourceView');
    instance.editor.executeCommand('toggleSourceView');
    expect(instance.getContent()).toBe(original);
    instance.editor.executeCommand('toggleSourceView');
    instance.destroy();
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('supports read-only initialization and switching back to editing', () => {
    const instance = setup({ editable: false });
    expect(instance.editor.view.editable).toBe(false);
    expect(instance.toolbar?.getElement().hasAttribute('inert')).toBe(true);
    instance.setEditable(true);
    expect(instance.editor.view.editable).toBe(true);
    expect(instance.toolbar?.getElement().hasAttribute('inert')).toBe(false);
  });

  it('closes an owned color picker on destroy', () => {
    const instance = setup({ toolbarButtons: ['textColor'] });
    instance.toolbar?.getElement().querySelector('button')?.click();
    expect(document.querySelector('[aria-label="Use color #000000"]')).not.toBeNull();
    instance.destroy();
    expect(document.querySelector('[aria-label="Use color #000000"]')).toBeNull();
  });
});
