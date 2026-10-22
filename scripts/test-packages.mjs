import assert from 'node:assert/strict';
import { execSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// A real consumer outside the workspace catches hidden monorepo dependencies.
// Nothing is published, and install scripts from dependencies are disabled.
const root = fileURLToPath(new URL('../', import.meta.url));
const consumer = mkdtempSync(join(tmpdir(), 'likha-consumer-'));
const archives = join(consumer, 'archives');
mkdirSync(archives);
const dependencies = {};
const packages = ['core', 'ui', 'plugins', 'html'];
for (const directory of packages) {
  const cwd = join(root, 'packages', directory);
  const manifest = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  execSync(`pnpm pack --pack-destination "${archives}"`, { cwd, stdio: 'pipe' });
  const filename = `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`;
  assert.ok(existsSync(join(archives, filename)), `Missing archive ${filename}`);
  dependencies[manifest.name] = `file:${join(archives, filename).replaceAll('\\', '/')}`;
}
writeFileSync(join(consumer, 'package.json'), JSON.stringify({
  private: true, type: 'module', dependencies,
}, null, 2));
execSync('npm install --ignore-scripts --no-audit --no-fund', { cwd: consumer, stdio: 'inherit' });
for (const name of Object.keys(dependencies)) {
  const installed = join(consumer, 'node_modules', name);
  const manifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
  assert.ok(!JSON.stringify(manifest.dependencies).includes('workspace:'), `${name}: unresolved workspace dependency`);
  assert.ok(readdirSync(installed).some(file => /^licen[sc]e/i.test(file)), `${name}: missing license`);
  const notices = readFileSync(join(installed, 'dist/THIRD-PARTY-NOTICES.txt'), 'utf8');
  if (name === '@likhaeditor/likhaeditor') {
    for (const dependency of ['prosemirror-view@', 'prosemirror-model@', 'markdown-it@']) {
      assert.ok(notices.includes(dependency), `Missing bundled notice: ${dependency}`);
    }
  }
}
writeFileSync(join(consumer, 'smoke.mjs'), `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
for (const name of ${JSON.stringify(Object.keys(dependencies))}) {
  assert.ok(Object.keys(await import(name)).length, name + ' ESM');
  assert.ok(Object.keys(require(name)).length, name + ' CommonJS');
}
require.resolve('@likhaeditor/likhaeditor/style.css');
console.log('Packed ESM, CommonJS, and CSS exports resolve.');
`);
execFileSync(process.execPath, ['smoke.mjs'], { cwd: consumer, stdio: 'inherit' });
writeFileSync(join(consumer, 'consumer.ts'), `
import { createEditor, localVersionStore } from '@likhaeditor/likhaeditor';
import { Editor } from '@likhaeditor/core';
import { CommentsPlugin, TablePlugin, MarkdownPlugin } from '@likhaeditor/plugins';
import { Toolbar } from '@likhaeditor/ui';
const instance = createEditor({ element: document.createElement('div'),
  comments: { author: 'Consumer' }, versions: localVersionStore('consumer'),
  autosave: { save: async (html, signal) => { console.log(html, signal.aborted); } },
});
instance.setJSON(instance.getJSON());
instance.exportMarkdown();
instance.destroy();
const editor = new Editor({ element: document.createElement('div'),
  plugins: [new CommentsPlugin(), new TablePlugin(), new MarkdownPlugin()] });
editor.destroy();
void Toolbar;
`);
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'),
  '--noEmit', '--strict', '--target', 'ES2022', '--module', 'NodeNext',
  '--moduleResolution', 'NodeNext', 'consumer.ts'], { cwd: consumer, stdio: 'inherit' });
console.log(`Packed consumer declarations pass. Inspection files: ${consumer}`);
