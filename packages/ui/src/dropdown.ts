/**
 * Dropdown menu component
 */

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface DropdownOptions {
  items: DropdownOption[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export class Dropdown {
  private element: HTMLElement;
  private button: HTMLButtonElement;
  private menu: HTMLElement;
  private options: DropdownOptions;
  private isOpen: boolean = false;
  private outsideClick = (event: MouseEvent) => {
    if (!this.element.contains(event.target as Node)) this.close();
  };

  constructor(options: DropdownOptions) {
    this.options = options;

    // Create container
    this.element = document.createElement('div');
    this.element.className = `likha-dropdown ${options.className || ''}`.trim();

    // Create button
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'likha-dropdown__button';
    this.button.textContent = options.placeholder || 'Select...';
    this.button.addEventListener('click', () => this.toggle());

    // Create menu
    this.menu = document.createElement('div');
    this.menu.className = 'likha-dropdown__menu';
    this.menu.style.display = 'none';

    // Add items to menu
    options.items.forEach(item => {
      const menuItem = document.createElement('button');
      menuItem.type = 'button';
      menuItem.className = 'likha-dropdown__item';
      menuItem.dataset.value = item.value;
      
      if (item.disabled) {
        menuItem.disabled = true;
        menuItem.classList.add('likha-dropdown__item--disabled');
      }

      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'likha-dropdown__item-icon';
        icon.innerHTML = item.icon;
        menuItem.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'likha-dropdown__item-label';
      label.textContent = item.label;
      menuItem.appendChild(label);

      menuItem.addEventListener('click', () => {
        if (!item.disabled) {
          this.select(item.value, item.label);
        }
      });

      this.menu.appendChild(menuItem);
    });

    // Assemble dropdown
    this.element.appendChild(this.button);
    this.element.appendChild(this.menu);

    // Close on outside click
    document.addEventListener('click', this.outsideClick);
    this.button.setAttribute('aria-expanded', 'false');
    this.element.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.close();
        this.button.focus();
      }
    });
  }

  /**
   * Toggle dropdown open/closed
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown menu
   */
  open(): void {
    this.isOpen = true;
    this.button.setAttribute('aria-expanded', 'true');
    this.menu.style.display = 'block';
    this.element.classList.add('likha-dropdown--open');
  }

  /**
   * Close dropdown menu
   */
  close(): void {
    this.isOpen = false;
    this.button.setAttribute('aria-expanded', 'false');
    this.menu.style.display = 'none';
    this.element.classList.remove('likha-dropdown--open');
  }

  /**
   * Select an item
   */
  select(value: string, label: string): void {
    this.button.textContent = label;
    this.close();
    
    if (this.options.onSelect) {
      this.options.onSelect(value);
    }
  }

  /**
   * Get the dropdown DOM element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Destroy the dropdown
   */
  destroy(): void {
    document.removeEventListener('click', this.outsideClick);
    this.element.remove();
  }
}
