import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Window } from 'happy-dom';

const require = createRequire(import.meta.url);
const cjs = require('../packages/html/dist/index.cjs');
const esm = await import('../packages/html/dist/index.js');
assert.equal(typeof cjs.createEditor, 'function');
assert.equal(typeof esm.createEditor, 'function');

// Load the standalone CDN bundle with no module loader or external dependencies.
const window = new Window({ settings: { enableJavaScriptEvaluation: true } });
try {
  window.eval(readFileSync(new URL('../packages/html/dist/likha-editor.umd.js', import.meta.url), 'utf8'));
  const container = window.document.createElement('div');
  window.document.body.appendChild(container);
  const instance = window.LikhaEditor.createEditor({ element: container, content: '<p>Offline CDN bundle</p>' });
  assert.equal(instance.getContent(), '<p>Offline CDN bundle</p>');
  assert.ok(container.querySelector('[role="toolbar"]'));
  instance.setContent('<p>Updated</p>');
  assert.equal(instance.getContent(), '<p>Updated</p>');
  instance.destroy();
  assert.equal(container.children.length, 0);
  console.log('ESM, CommonJS, and standalone UMD smoke checks passed.');
} finally {
  await window.happyDOM.close();
}
