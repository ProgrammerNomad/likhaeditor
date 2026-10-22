import { useEffect, useRef, useState } from 'react';
import { createEditor, type LikhaEditorOptions } from '@likhaeditor/likhaeditor';

export type LikhaEditorInstance = ReturnType<typeof createEditor>;

export type UseEditorOptions = Omit<LikhaEditorOptions, 'element' | 'onChange'> & {
  onChange?: (html: string) => void;
};

/** Creates a Likha instance once the host element is mounted. */
export function useEditor(options: UseEditorOptions) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<LikhaEditorInstance | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || instanceRef.current) return;
    instanceRef.current = createEditor({
      ...optionsRef.current,
      element: host,
      onChange: (html) => optionsRef.current.onChange?.(html),
    });
    setReady(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
      setReady(false);
    };
  }, []);

  return { hostRef, instance: instanceRef.current, ready };
}
