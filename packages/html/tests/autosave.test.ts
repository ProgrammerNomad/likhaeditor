import { afterEach, expect, it, vi } from 'vitest';
import { createAutosave } from '../src/autosave';

afterEach(() => vi.useRealTimers());
it('debounces edits and explicitly flushes the latest content', async () => {
  vi.useFakeTimers();
  const save = vi.fn();
  const autosave = createAutosave({ save });
  autosave.schedule('one'); autosave.schedule('two');
  await autosave.flush();
  expect(save).toHaveBeenCalledTimes(1);
  expect(save.mock.calls[0][0]).toBe('two');
  autosave.destroy(); expect(vi.getTimerCount()).toBe(0);
});
it('serializes in-flight writes and coalesces newer pending edits', async () => {
  let finish: () => void = () => {};
  const saved: string[] = [];
  const autosave = createAutosave({ save: async html => {
    saved.push(html);
    if (html === 'first') await new Promise<void>(resolve => { finish = resolve; });
  } });
  autosave.schedule('first'); const first = autosave.flush();
  autosave.schedule('second'); autosave.schedule('third');
  expect(saved).toEqual(['first']);
  finish(); await first;
  expect(saved).toEqual(['first', 'third']);
  autosave.destroy();
});
it('reports failures, retains content for explicit retry, and aborts on destroy', async () => {
  vi.useFakeTimers();
  const onError = vi.fn();
  const save = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
  const autosave = createAutosave({ save, onError });
  autosave.schedule('keep me');
  await vi.advanceTimersByTimeAsync(500);
  expect(onError).toHaveBeenCalledOnce();
  await autosave.flush();
  expect(save.mock.calls.map(call => call[0])).toEqual(['keep me', 'keep me']);
  const signal = save.mock.calls[0][1] as AbortSignal;
  autosave.destroy(); expect(signal.aborted).toBe(true);
  autosave.schedule('ignored'); await autosave.flush();
  expect(save).toHaveBeenCalledTimes(2);
});
