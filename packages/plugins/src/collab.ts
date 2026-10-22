import type { Editor } from '@likhaeditor/core';
import { Plugin } from '@likhaeditor/core';
import { collab, getVersion, receiveTransaction, sendableSteps } from 'prosemirror-collab';
import type { Transaction } from 'prosemirror-state';

export interface CollabOptions {
  clientID?: number;
  version?: number;
  onSend?: (payload: { steps: unknown[]; version: number; clientID: number }) => void;
}

/** ProseMirror collab foundation; the host application owns transport and authentication. */
export class CollabPlugin extends Plugin {
  name = 'collab';
  private clientID: number;
  private version: number;

  constructor(private options: CollabOptions = {}) {
    super();
    this.clientID = options.clientID ?? Math.floor(Math.random() * 1_000_000);
    this.version = options.version ?? 0;
  }

  prosemirrorPlugins() {
    return [collab({ version: this.version, clientID: this.clientID })];
  }

  commands() {
    return {
      flushCollabSteps: (editor: Editor): boolean => {
        const payload = sendableSteps(editor.view.state);
        if (!payload) return false;
        this.options.onSend?.({
          steps: [...payload.steps],
          version: getVersion(editor.view.state),
          clientID: this.clientID,
        });
        return true;
      },
      receiveCollabSteps: (editor: Editor, steps: unknown[], clientIDs: number[]): boolean => {
        const transaction = receiveTransaction(editor.view.state, steps as never[], clientIDs) as Transaction | null;
        if (!transaction) return false;
        editor.view.dispatch(transaction);
        return true;
      },
    };
  }
}
