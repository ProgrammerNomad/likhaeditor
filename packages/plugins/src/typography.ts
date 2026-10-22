import { Plugin, fontFamily, fontSize, type Editor } from '@likhaeditor/core';
export class TypographyPlugin extends Plugin {
  name = 'typography';
  private apply(editor: Editor, markName: string, attrs: Record<string, unknown> | null): boolean {
    const { state, dispatch } = editor.view;
    const mark = state.schema.marks[markName];
    if (!mark) return false;
    const { from, to, empty } = state.selection;
    const tr = state.tr;
    if (empty) {
      if (attrs) tr.addStoredMark(mark.create(attrs)); else tr.removeStoredMark(mark);
    } else {
      tr.removeMark(from, to, mark);
      if (attrs) tr.addMark(from, to, mark.create(attrs));
    }
    dispatch(tr); return true;
  }
  commands() {
    return {
      setFontFamily: (editor: Editor, value: string | null) => {
        if (value !== null && !fontFamily(value)) return false;
        return this.apply(editor, 'fontFamily', value === null ? null : { family: fontFamily(value) });
      },
      setFontSize: (editor: Editor, value: number | null) => {
        if (value !== null && !fontSize(value)) return false;
        return this.apply(editor, 'fontSize', value === null ? null : { size: value });
      },
    };
  }
}
