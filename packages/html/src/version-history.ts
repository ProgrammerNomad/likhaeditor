import { createId, type Editor } from '@likhaeditor/core';

export interface DocumentVersion {
  id: string;
  createdAt: string;
  label: string;
  document: Record<string, unknown>;
}
export interface VersionStore {
  list: () => Promise<DocumentVersion[]>;
  save: (version: DocumentVersion) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/** Explicit checkpoints, stored by the application rather than a vendor service. */
export function createVersionHistory(editor: Editor, store: VersionStore) {
  return {
    list: () => store.list(),
    async save(label = '') {
      const version: DocumentVersion = {
        id: createId(), createdAt: new Date().toISOString(), label, document: editor.getJSON(),
      };
      await store.save(version);
      return version;
    },
    async restore(id: string) {
      const version = (await store.list()).find(version => version.id === id);
      if (!version) throw new Error('Version not found');
      if (editor.view.isDestroyed) throw new Error('Editor is destroyed');
      editor.setJSON(version.document);
    },
    remove: (id: string) => store.remove(id),
  };
}

/** Local-only example adapter; use a unique key per document. Quota errors propagate. */
export function localVersionStore(key: string, storage: Storage = localStorage): VersionStore {
  const read = (): DocumentVersion[] => {
    const value: unknown = JSON.parse(storage.getItem(key) || '[]');
    if (!Array.isArray(value) || value.some(item => !item || typeof item.id !== 'string' || typeof item.createdAt !== 'string' || typeof item.label !== 'string' || !item.document || typeof item.document !== 'object')) throw new Error('Invalid version history');
    return value as DocumentVersion[];
  };
  return {
    list: async () => read(),
    save: async version => { storage.setItem(key, JSON.stringify([...read(), version])); },
    remove: async id => { storage.setItem(key, JSON.stringify(read().filter(version => version.id !== id))); },
  };
}
