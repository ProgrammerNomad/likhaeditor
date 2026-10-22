import type { Editor } from '@likhaeditor/core';
import type { TrackChangesPlugin } from '@likhaeditor/plugins';

export function createReviewPanel(editor: Editor, plugin: TrackChangesPlugin) {
  let panel: HTMLElement | undefined;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const render = () => {
    if (!panel) return;
    panel.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = 'Review changes';
    const toggle = document.createElement('button'); toggle.type = 'button';
    toggle.textContent = plugin.isTracking(editor) ? 'Pause tracking' : 'Start tracking';
    toggle.disabled = !editor.view.editable;
    toggle.onclick = () => plugin.setTracking(editor, !plugin.isTracking(editor));
    panel.append(heading, toggle, status);
    const changes = plugin.listChanges(editor);
    if (!changes.length) {
      const empty = document.createElement('p'); empty.textContent = 'No pending changes.'; panel.append(empty);
    }
    for (const change of changes) {
      const article = document.createElement('article');
      const label = document.createElement('p');
      label.textContent = `${change.author || 'Anonymous'} · ${change.createdAt}${change.conflicted ? ' · Overlapping edit: manual review required' : ''}`;
      const before = document.createElement('p'); before.textContent = `Before: ${change.before || '(empty or formatting change)'}`;
      const after = document.createElement('p'); after.textContent = `After: ${change.after || '(empty or formatting change)'}`;
      article.append(label, before, after);
      for (const action of ['Accept', 'Reject'] as const) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = action;
        button.setAttribute('aria-label', `${action} change by ${change.author || 'Anonymous'}`);
        button.disabled = !editor.view.editable || (action === 'Reject' && change.conflicted);
        button.onclick = () => {
          try {
            if (action === 'Accept') plugin.acceptChange(editor, change.id);
            else plugin.rejectChange(editor, change.id);
            status.textContent = `${action === 'Accept' ? 'Accepted' : 'Rejected'} change`;
            panel?.querySelector('button')?.focus();
          } catch (error) { status.textContent = error instanceof Error ? error.message : 'Review failed'; }
        };
        article.append(button);
      }
      panel.append(article);
    }
    const close = document.createElement('button'); close.type = 'button'; close.textContent = 'Close review';
    close.onclick = () => { panel?.remove(); panel = undefined; editor.focus(); };
    panel.append(close);
  };
  editor.view.dom.addEventListener('likha:review-change', render);
  return {
    open: () => {
      if (!panel) {
        panel = document.createElement('section'); panel.className = 'likha-comments';
        panel.setAttribute('aria-label', 'Review changes'); editor.view.dom.parentElement?.append(panel);
      }
      render(); panel.querySelector('button')?.focus();
    },
    destroy: () => { editor.view.dom.removeEventListener('likha:review-change', render); panel?.remove(); },
  };
}
