/**
 * Button component for toolbar actions
 */

export interface ButtonOptions {
  icon?: string;
  label?: string;
  title?: string;
  onClick?: (event: MouseEvent) => void;
  isActive?: () => boolean;
  className?: string;
  disabled?: boolean;
}

export class Button {
  private element: HTMLButtonElement;
  private options: ButtonOptions;
  private activeCheckInterval?: number;

  constructor(options: ButtonOptions) {
    this.options = options;
    
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.element.className = `likha-button ${options.className || ''}`.trim();
    
    if (options.title) {
      this.element.title = options.title;
      this.element.setAttribute('aria-label', options.title);
    }
    
    if (options.disabled) {
      this.element.disabled = true;
    }

    // Add icon if provided
    if (options.icon) {
      const iconEl = document.createElement('span');
      iconEl.className = 'likha-button__icon';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.innerHTML = options.icon;
      this.element.appendChild(iconEl);
    }

    // Add label if provided
    if (options.label) {
      const labelEl = document.createElement('span');
      labelEl.className = 'likha-button__label';
      labelEl.textContent = options.label;
      this.element.appendChild(labelEl);
    }

    // Attach click handler
    this.element.addEventListener('mousedown', event => event.preventDefault());
    if (options.onClick) {
      this.element.addEventListener('click', options.onClick);
    }

    // Set up active state checking if provided
    if (options.isActive) {
      this.startActiveStateCheck();
    }
  }

  /**
   * Start checking active state periodically
   */
  private startActiveStateCheck(): void {
    if (!this.options.isActive) return;

    this.updateActiveState();
    this.activeCheckInterval = window.setInterval(() => {
      this.updateActiveState();
    }, 100);
  }

  /**
   * Update the active state class
   */
  private updateActiveState(): void {
    if (!this.options.isActive) return;

    const isActive = this.options.isActive();
    this.element.setAttribute('aria-pressed', String(isActive));
    if (isActive) {
      this.element.classList.add('likha-button--active');
    } else {
      this.element.classList.remove('likha-button--active');
    }
  }

  /**
   * Get the button DOM element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Set button enabled/disabled state
   */
  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
  }

  /**
   * Manually set active state
   */
  setActive(active: boolean): void {
    this.element.setAttribute('aria-pressed', String(active));
    if (active) {
      this.element.classList.add('likha-button--active');
    } else {
      this.element.classList.remove('likha-button--active');
    }
  }

  /**
   * Destroy the button
   */
  destroy(): void {
    if (this.activeCheckInterval) {
      clearInterval(this.activeCheckInterval);
    }
    this.element.remove();
  }
}
