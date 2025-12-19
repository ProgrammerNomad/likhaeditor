import { Plugin } from '@likhaeditor/core';
import type { Editor } from '@likhaeditor/core';
/**
 * Underline Plugin
 * Adds underline formatting to text
 */
export declare class UnderlinePlugin extends Plugin {
    name: string;
    commands(): {
        toggleUnderline: (editor: Editor) => boolean;
    };
    keymap(): {
        'Mod-u': (editor: Editor) => any;
    };
}
//# sourceMappingURL=underline.d.ts.map