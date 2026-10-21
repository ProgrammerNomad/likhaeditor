/**
 * Toolbar component
 * Provides a container for editor action buttons
 */

export interface ToolbarOptions {
  container?: HTMLElement | string;
  sticky?: boolean;
  className?: string;
}

export class Toolbar {
  private element: HTMLElement;
  private container: HTMLElement;
  private cleanups: Array<() => void> = [];

  onDestroy(cleanup: () => void): void {
    this.cleanups.push(cleanup);
  }

  constructor(options: ToolbarOptions = {}) {
    
    // Create toolbar element
    this.element = document.createElement('div');
    this.element.className = `likha-toolbar ${options.className || ''}`.trim();
    this.element.setAttribute('role', 'toolbar');
    this.element.setAttribute('aria-label', 'Text formatting');
    
    if (options.sticky) {
      this.element.classList.add('likha-toolbar--sticky');
    }

    // Find or use container
    if (options.container) {
      if (typeof options.container === 'string') {
        const found = document.querySelector(options.container);
        if (!found) {
          throw new Error(`Toolbar container not found: ${options.container}`);
        }
        this.container = found as HTMLElement;
      } else {
        this.container = options.container;
      }
      this.container.appendChild(this.element);
    } else {
      this.container = this.element;
    }
  }

  /**
   * Add a button group to the toolbar
   */
  addGroup(buttons: HTMLElement[]): void {
    const group = document.createElement('div');
    group.className = 'likha-toolbar__group';
    
    buttons.forEach(button => {
      group.appendChild(button);
    });
    
    this.element.appendChild(group);
  }

  /**
   * Add a single button to the toolbar
   */
  addButton(button: HTMLElement): void {
    this.element.appendChild(button);
  }

  /**
   * Add a separator between button groups
   */
  addSeparator(): void {
    const separator = document.createElement('div');
    separator.className = 'likha-toolbar__separator';
    this.element.appendChild(separator);
  }

  /**
   * Get the toolbar DOM element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Show the toolbar
   */
  show(): void {
    this.element.style.display = '';
  }

  /**
   * Hide the toolbar
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Destroy the toolbar
   */
  destroy(): void {
    this.cleanups.splice(0).forEach(cleanup => cleanup());
    this.element.remove();
  }
}
