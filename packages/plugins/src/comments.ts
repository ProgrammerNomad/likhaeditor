import { Plugin, createId, type Editor } from '@likhaeditor/core';
import { Plugin as StatePlugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface EditorComment {
  id: string;
  from: number;
  to: number;
  text: string;
  author: string;
  createdAt: string;
  resolved: boolean;
  orphaned: boolean;
}
export interface CommentsOptions {
  author?: string;
  comments?: EditorComment[];
  onChange?: (comments: EditorComment[]) => void;
}
type Action = { add: EditorComment } | { resolve: string; resolved: boolean } | { remove: string };

/** Range annotations stored separately from document HTML. Deleted anchors remain visible as orphaned threads. */
export class CommentsPlugin extends Plugin {
  name = 'comments';
  private key = new PluginKey<EditorComment[]>('comments');
  constructor(private options: CommentsOptions = {}) { super(); }

  private validate(comments: EditorComment[], size: number): EditorComment[] {
    const ids = new Set<string>();
    return comments.map(comment => {
      if (!comment || typeof comment.id !== 'string' || ids.has(comment.id) ||
          typeof comment.text !== 'string' || !comment.text.trim() || typeof comment.author !== 'string' ||
          typeof comment.createdAt !== 'string' || typeof comment.resolved !== 'boolean' || typeof comment.orphaned !== 'boolean' ||
          !Number.isInteger(comment.from) || !Number.isInteger(comment.to) || comment.from < 0 || comment.to > size || comment.from > comment.to) {
        throw new Error('Invalid comment data');
      }
      ids.add(comment.id);
      return { ...comment };
    });
  }

  listComments(editor: Editor): EditorComment[] {
    return (this.key.getState(editor.view.state) ?? []).map(comment => ({ ...comment }));
  }

  addComment(editor: Editor, text: string, author = this.options.author ?? ''): string | false {
    const { from, to, empty } = editor.view.state.selection;
    if (empty || !text.trim()) return false;
    const comment: EditorComment = { id: createId(), from, to, text, author,
      createdAt: new Date().toISOString(), resolved: false, orphaned: false };
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { add: comment } satisfies Action));
    return comment.id;
  }

  resolveComment(editor: Editor, id: string, resolved = true): boolean {
    if (!this.key.getState(editor.view.state)?.some(comment => comment.id === id)) return false;
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { resolve: id, resolved } satisfies Action));
    return true;
  }

  removeComment(editor: Editor, id: string): boolean {
    if (!this.key.getState(editor.view.state)?.some(comment => comment.id === id)) return false;
    editor.view.dispatch(editor.view.state.tr.setMeta(this.key, { remove: id } satisfies Action));
    return true;
  }

  commands() {
    return { addComment: this.addComment.bind(this), listComments: this.listComments.bind(this),
      resolveComment: this.resolveComment.bind(this), removeComment: this.removeComment.bind(this) };
  }

  prosemirrorPlugins() {
    return [new StatePlugin<EditorComment[]>({
      key: this.key,
      state: {
        init: (_config, state) => this.validate(this.options.comments ?? [], state.doc.content.size),
        apply: (tr, previous) => {
          let comments = tr.docChanged ? previous.map(comment => {
            const from = tr.mapping.map(comment.from, 1);
            const to = tr.mapping.map(comment.to, -1);
            return { ...comment, from: Math.min(from, to), to: Math.max(from, to), orphaned: comment.orphaned || from >= to };
          }) : previous;
          const action = tr.getMeta(this.key) as Action | undefined;
          if (action && 'add' in action) comments = [...comments, action.add];
          if (action && 'resolve' in action) comments = comments.map(comment => comment.id === action.resolve ? { ...comment, resolved: action.resolved } : comment);
          if (action && 'remove' in action) comments = comments.filter(comment => comment.id !== action.remove);
          return comments;
        },
      },
      props: {
        decorations: state => DecorationSet.create(state.doc, (this.key.getState(state) ?? [])
          .filter(comment => !comment.resolved && !comment.orphaned && comment.from < comment.to)
          .map(comment => Decoration.inline(comment.from, comment.to, { class: 'likha-comment-anchor', 'data-comment-id': comment.id }))),
      },
      view: () => ({ update: (view, previous) => {
        if (this.key.getState(view.state) === this.key.getState(previous)) return;
        const comments = (this.key.getState(view.state) ?? []).map(comment => ({ ...comment }));
        this.options.onChange?.(comments);
        view.dom.dispatchEvent(new CustomEvent('likha:comments-change'));
      } }),
    })];
  }
}
