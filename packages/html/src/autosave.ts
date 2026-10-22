export interface AutosaveOptions {
  /** Persist to a backend or storage controlled by the host application. */
  save: (html: string, signal: AbortSignal) => void | Promise<void>;
  delay?: number;
  onError?: (error: unknown) => void;
}

/** Serializes writes so an older save cannot finish after and overwrite a newer one. */
export function createAutosave(options: AutosaveOptions) {
  let pending: string | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let task: Promise<void> | undefined;
  let destroyed = false;
  const controller = new AbortController();
  const flush = (): Promise<void> => {
    clearTimeout(timer);
    if (destroyed) return Promise.resolve();
    if (task) return task;
    task = (async () => {
      while (pending !== undefined && !destroyed) {
        const html = pending;
        pending = undefined;
        try {
          await options.save(html, controller.signal);
        } catch (error) {
          if (!destroyed && pending === undefined) pending = html;
          throw error;
        }
      }
    })().finally(() => { task = undefined; });
    return task;
  };
  return {
    schedule(html: string) {
      if (destroyed) return;
      pending = html;
      clearTimeout(timer);
      timer = setTimeout(() => { void flush().catch(error => { if (!destroyed) options.onError?.(error); }); }, options.delay ?? 500);
    },
    flush,
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      pending = undefined;
      controller.abort();
    },
  };
}
