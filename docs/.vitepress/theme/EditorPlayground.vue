<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import type { createEditor } from '../../../packages/html/src/index';
import '../../../packages/html/src/likha-editor.css';

const host = ref<HTMLElement>();
const output = ref('');
const status = ref('Loading the editor…');
const readonly = ref(false);
let instance: ReturnType<typeof createEditor> | undefined;
let disposed = false;
const sample = '<h2>Your words. Your infrastructure.</h2><p>Welcome to <strong>LikhaEditor</strong>. Select some text to format it or leave a comment. Everything here runs in your browser.</p><ul><li><p>Edit a table with the Table actions menu.</p></li><li><p>Try find and replace, then undo your changes.</p></li><li><p>Export HTML, JSON, or supported Markdown.</p></li></ul><p>No account. No license key. No cloud required.</p>';

onMounted(async () => {
  try {
    const { createEditor } = await import('../../../packages/html/dist/index.js');
    if (disposed || !host.value) return;
    instance = createEditor({ element: host.value, content: sample, comments: { author: 'Demo reviewer' },
      onChange: html => { output.value = html; status.value = 'Changes stay in this page. Nothing is uploaded.'; },
    });
    output.value = instance.getContent(); status.value = 'Ready · built from this website’s editor build';
  } catch (error) { status.value = error instanceof Error ? error.message : 'Unable to load editor'; }
});
onBeforeUnmount(() => { disposed = true; instance?.destroy(); });
function toggleReadonly() { readonly.value = !readonly.value; instance?.setEditable(!readonly.value); }
function exportContent(format: string) {
  if (!instance) return;
  try {
    output.value = format === 'json' ? JSON.stringify(instance.getJSON(), null, 2) : format === 'markdown' ? instance.exportMarkdown() : instance.getContent();
    status.value = `${format.toUpperCase()} export ready below`;
  } catch (error) { status.value = error instanceof Error ? error.message : 'Export failed'; }
}
</script>

<template>
  <section class="playground" aria-label="Interactive editor playground">
    <div class="playground-header">
      <div><div class="playground-title">Make it your own.</div><div class="playground-subtitle">A real editor. No signup required.</div></div>
      <div class="playground-controls">
        <button type="button" :aria-pressed="readonly" @click="toggleReadonly">{{ readonly ? 'Enable editing' : 'Read-only' }}</button>
        <button type="button" @click="instance?.setContent(sample)">Reset demo</button>
      </div>
    </div>
    <div ref="host" class="playground-editor"></div>
    <div class="playground-output">
      <p role="status" class="playground-status">{{ status }}</p>
      <div class="playground-controls" style="margin-bottom:12px">
        <button type="button" @click="exportContent('html')">Export HTML</button>
        <button type="button" @click="exportContent('json')">Export JSON</button>
        <button type="button" @click="exportContent('markdown')">Export Markdown</button>
      </div>
      <textarea aria-label="Exported content" :value="output" readonly spellcheck="false"></textarea>
    </div>
  </section>
</template>
