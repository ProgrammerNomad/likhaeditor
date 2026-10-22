export interface DialogField { name: string; label: string; value?: string; required?: boolean; }

/** Native modal semantics provide focus containment, Escape, and screen-reader support. */
export function openInputDialog(options: {
  title: string;
  fields: DialogField[];
  onSubmit: (values: Record<string, string>) => string | void;
  onClose?: () => void;
}): () => void {
  const previous = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'likha-dialog';
  dialog.setAttribute('aria-label', options.title);
  const form = document.createElement('form');
  const title = document.createElement('h2');
  title.textContent = options.title;
  form.appendChild(title);
  const inputs = new Map<string, HTMLInputElement>();
  for (const field of options.fields) {
    const label = document.createElement('label');
    label.textContent = field.label;
    const input = document.createElement('input');
    input.name = field.name;
    input.value = field.value ?? '';
    input.required = field.required ?? false;
    label.appendChild(input);
    form.appendChild(label);
    inputs.set(field.name, input);
  }
  const error = document.createElement('p');
  error.setAttribute('role', 'alert');
  const cancel = document.createElement('button');
  cancel.type = 'button'; cancel.textContent = 'Cancel';
  const submit = document.createElement('button');
  submit.type = 'submit'; submit.textContent = 'Apply';
  form.append(error, cancel, submit);
  dialog.appendChild(form);
  let closed = false;
  const cleanup = () => {
    if (closed) return;
    closed = true;
    dialog.remove();
    if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    options.onClose?.();
  };
  cancel.addEventListener('click', cleanup);
  dialog.addEventListener('cancel', event => { event.preventDefault(); cleanup(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = options.onSubmit(Object.fromEntries([...inputs].map(([name, input]) => [name, input.value])));
    if (result) error.textContent = result;
    else cleanup();
  });
  document.body.appendChild(dialog);
  dialog.showModal();
  inputs.values().next().value?.focus();
  return cleanup;
}
