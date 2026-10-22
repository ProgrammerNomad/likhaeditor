import { useEditor, type UseEditorOptions } from './useEditor';

export type LikhaEditorReactProps = UseEditorOptions & {
  className?: string;
};

/** React wrapper around {@link createEditor} with automatic destroy on unmount. */
export function LikhaEditor({ className, ...options }: LikhaEditorReactProps) {
  const { hostRef } = useEditor(options);
  return <div ref={hostRef} className={className} />;
}
