import { Plugin, createId, type Editor } from '@likhaeditor/core';
import { Plugin as StatePlugin, PluginKey } from 'prosemirror-state';
import { Mapping, type Step, type StepMap } from 'prosemirror-transform';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface TrackedChange {
  id: string;
  author: string;
  createdAt: string;
  before: string;
  after: string;
  from: number;
  to: number;
  conflicted: boolean;
}
export interface TrackChangesOptions {
  author?: string;
  enabled?: boolean;
  onChange?: (changes: TrackedChange[]) => void;
}
interface PendingChange extends TrackedChange { inverses: Step[]; mapStart: number; }
interface ReviewState { enabled: boolean; changes: PendingChange[]; maps: StepMap[]; }
type Action = { enabled: boolean } | { accept: string } | { reject: string };

/** Transaction-level review; inverse steps rebase through subsequent disjoint edits. */
export class TrackChangesPlugin extends Plugin {
  name = 'trackChanges';
  private key = new PluginKey<ReviewState>('trackChanges');
  constructor(private options: TrackChangesOptions = {}) { super(); }

  listChanges(editor: Editor): TrackedChange[] {
    return (this.key.getState(editor.view.state)?.changes ?? []).map(change => ({
      id: change.id, author: change.author, createdAt: change.createdAt,
      before: change.before, after: change.after, from: change.from, to: change.to,
      conflicted: change.conflicted,
    }));
  }
  setTracking(editor: Editor, enabled: boolean): void {
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { enabled } satisfies Action));
  }
  isTracking(editor: Editor): boolean { return this.key.getState(editor.view.state)?.enabled ?? false; }
  acceptChange(editor: Editor, id: string): boolean {
    if (!this.key.getState(editor.view.state)?.changes.some(change => change.id === id)) return false;
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { accept: id } satisfies Action));
    return true;
  }
  rejectChange(editor: Editor, id: string): boolean {
    const state = this.key.getState(editor.view.state);
    const change = state?.changes.find(change => change.id === id);
    if (!state || !change) return false;
    // Never discard newer overlapping edits without an explicit user decision.
    if (change.conflicted) throw new Error('This change overlaps a later edit. Accept it or resolve the document manually; automatic rejection is unsafe.');
    const mapping = new Mapping(state.maps.slice(change.mapStart));
    const tr = editor.view.state.tr;
    for (let i = change.inverses.length - 1; i >= 0; i--) {
      const step = change.inverses[i].map(mapping.slice(i + 1));
      if (!step) throw new Error('This change can no longer be safely rejected.');
      const result = tr.maybeStep(step);
      if (result.failed) throw new Error(`Unable to reject change: ${result.failed}`);
      mapping.appendMap(step.getMap(), i);
    }
    editor.view.dispatch(tr.setMeta(this.key, { reject: id } satisfies Action).setMeta('addToHistory', false));
    return true;
  }
  commands() {
    return { listChanges: this.listChanges.bind(this), setTracking: this.setTracking.bind(this),
      isTracking: this.isTracking.bind(this), acceptChange: this.acceptChange.bind(this), rejectChange: this.rejectChange.bind(this) };
  }
  prosemirrorPlugins() {
    return [new StatePlugin<ReviewState>({
      key: this.key,
      state: {
        init: () => ({ enabled: this.options.enabled ?? true, changes: [], maps: [] }),
        apply: (tr, previous) => {
          const action = tr.getMeta(this.key) as Action | undefined;
          if (!tr.docChanged && !action) return previous;
          const removed = action && ('accept' in action ? action.accept : 'reject' in action ? action.reject : undefined);
          let changes = previous.changes.filter(change => change.id !== removed);
          const enabled = action && 'enabled' in action ? action.enabled : previous.enabled;
          let maps = previous.maps;
          if (tr.docChanged) {
            const start = tr.before.content.findDiffStart(tr.doc.content) ?? 0;
            const end = tr.before.content.findDiffEnd(tr.doc.content) ?? { a: start, b: start };
            const oldEnd = Math.max(start, end.a);
            const newEnd = Math.max(start, end.b);
            changes = changes.map(change => ({ ...change,
              conflicted: change.conflicted || (start <= change.to && oldEnd >= change.from),
              from: tr.mapping.map(change.from, 1), to: tr.mapping.map(change.to, -1),
            })).map(change => ({ ...change, from: Math.min(change.from, change.to), to: Math.max(change.from, change.to) }));
            if (enabled && !(action && 'reject' in action)) {
              changes.push({ id: createId(), author: this.options.author ?? '', createdAt: new Date().toISOString(),
                before: tr.before.textBetween(start, oldEnd, '\n', '\uFFFC'),
                after: tr.doc.textBetween(start, newEnd, '\n', '\uFFFC'),
                from: start, to: newEnd, conflicted: false,
                inverses: tr.steps.map((step, index) => step.invert(tr.docs[index])), mapStart: maps.length,
              });
            }
            maps = [...maps, ...tr.mapping.maps];
          }
          // Release accumulated document maps once no review depends on them.
          if (!changes.length) maps = [];
          return { enabled, changes, maps };
        },
      },
      props: {
        decorations: state => DecorationSet.create(state.doc, (this.key.getState(state)?.changes ?? [])
          .filter(change => change.from < change.to)
          .map(change => Decoration.inline(change.from, change.to, {
            class: 'likha-tracked-change', 'data-change-id': change.id,
          }))),
      },
      view: () => ({ update: (view, previous) => {
        if (this.key.getState(view.state) === this.key.getState(previous)) return;
        if (this.editor) this.options.onChange?.(this.listChanges(this.editor));
        view.dom.dispatchEvent(new CustomEvent('likha:review-change'));
      } }),
    })];
  }
}
