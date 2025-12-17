import { Plugin } from '@likha/core';
import type { Editor } from '@likha/core';

export class TablePlugin extends Plugin {
  name = 'table';

  insertTable(editor: Editor, rows: number = 3, cols: number = 3): boolean {
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
    return {
      insertTable: this.insertTable.bind(this),
      isInTable: this.isInTable.bind(this),
    };
  }
}
