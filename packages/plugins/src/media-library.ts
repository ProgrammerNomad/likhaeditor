import type { Editor } from '@likhaeditor/core';
import { Plugin } from '@likhaeditor/core';

export interface MediaAsset {
  url: string;
  alt?: string;
  title?: string;
}

export interface MediaLibraryOptions {
  onPick?: (assets: MediaAsset[]) => void | Promise<void>;
}

/** Delegates asset picking to the host application (no bundled media store). */
export class MediaLibraryPlugin extends Plugin {
  name = 'mediaLibrary';

  constructor(private options: MediaLibraryOptions = {}) {
    super();
  }

  commands() {
    return {
      openMediaLibrary: async (editor: Editor): Promise<boolean> => {
        void editor;
        await this.options.onPick?.([]);
        return Boolean(this.options.onPick);
      },
      insertFromMediaLibrary: (editor: Editor, asset: MediaAsset): boolean => {
        if (!asset.url) return false;
        return Boolean(editor.executeCommand('insertImage', asset.url, asset.alt, asset.title));
      },
    };
  }
}
