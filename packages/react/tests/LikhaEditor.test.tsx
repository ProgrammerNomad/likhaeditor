import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { LikhaEditor } from '../src/LikhaEditor';

describe('LikhaEditor', () => {
  it('mounts toolbar and editor surface', async () => {
    const { container } = render(
      <LikhaEditor content="<p>Hello</p>" toolbarButtons={['bold', 'undo']} />,
    );
    await waitFor(() => {
      expect(container.querySelector('[role="toolbar"]')).toBeTruthy();
      expect(container.querySelector('.ProseMirror')).toBeTruthy();
    });
  });
});
