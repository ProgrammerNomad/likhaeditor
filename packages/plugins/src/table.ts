import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
import { keymap } from 'prosemirror-keymap';
import { tableEditing, goToNextCell, addRowBefore, addRowAfter, deleteRow,
  addColumnBefore, addColumnAfter, deleteColumn, deleteTable, mergeCells,
  splitCell, toggleHeaderRow, toggleHeaderColumn } from 'prosemirror-tables';
import type { Command } from 'prosemirror-state';

export class TablePlugin extends Plugin {
  name = 'table';

  insertTable(editor: Editor, rows: number = 3, cols: number = 3): boolean {
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows * cols > 1000) return false;
    const { view } = editor;
    const { state } = view;
    const { schema, tr } = state;
    const tableNode = schema.nodes.table;
    const rowNode = schema.nodes.table_row;
    const cellNode = schema.nodes.table_cell;
    if (!tableNode || !rowNode || !cellNode) return false;
    
    const cells = [];
    for (let i = 0; i < cols; i++) {
      const cell = cellNode.createAndFill();
      if (cell) cells.push(cell);
    }
    
    const tableRows = [];
    for (let i = 0; i < rows; i++) {
      tableRows.push(rowNode.create(null, cells));
    }
    
    const table = tableNode.create(null, tableRows);
    view.dispatch(tr.replaceSelectionWith(table));
    return true;
  }

  isInTable(editor: Editor): boolean {
    const { view } = editor;
    const { $from } = view.state.selection;
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.spec.tableRole === 'table') return true;
    }
    return false;
  }

  commands() {
    const execute = (command: Command) => (editor: Editor) => command(editor.view.state, editor.view.dispatch, editor.view);
    return {
      insertTable: this.insertTable.bind(this),
      isInTable: this.isInTable.bind(this),
      addRowBefore: execute(addRowBefore), addRowAfter: execute(addRowAfter), deleteRow: execute(deleteRow),
      addColumnBefore: execute(addColumnBefore), addColumnAfter: execute(addColumnAfter), deleteColumn: execute(deleteColumn),
      deleteTable: execute(deleteTable), mergeCells: execute(mergeCells), splitCell: execute(splitCell),
      toggleHeaderRow: execute(toggleHeaderRow), toggleHeaderColumn: execute(toggleHeaderColumn),
    };
  }

  prosemirrorPlugins() {
    return [keymap({ Tab: goToNextCell(1), 'Shift-Tab': goToNextCell(-1) }), tableEditing()];
  }
}
