import { describe, it, expect, vi } from 'vitest';
import { Button } from '../src/button';

describe('Button', () => {
  it('should create a button element', () => {
    const button = new Button({ label: 'Test' });
    const element = button.getElement();
    
    expect(element.tagName).toBe('BUTTON');
    expect(element.type).toBe('button');
    expect(element.className).toContain('likha-button');
  });

  it('should display label', () => {
    const button = new Button({ label: 'Click me' });
    const element = button.getElement();
    
    expect(element.textContent).toContain('Click me');
  });

  it('should display icon', () => {
    const button = new Button({ icon: '<svg>test</svg>' });
    const element = button.getElement();
    
    expect(element.innerHTML).toContain('<svg>test</svg>');
  });

  it('should apply custom className', () => {
    const button = new Button({ 
      label: 'Test',
      className: 'custom-btn' 
    });
    
    expect(button.getElement().className).toContain('custom-btn');
  });

  it('should set title attribute', () => {
    const button = new Button({ 
      label: 'Test',
      title: 'Test tooltip' 
    });
    
    expect(button.getElement().title).toBe('Test tooltip');
  });

  it('should handle click events', () => {
    const onClick = vi.fn();
    const button = new Button({ 
      label: 'Test',
      onClick 
    });
    
    button.getElement().click();
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should set disabled state', () => {
    const button = new Button({ 
      label: 'Test',
      disabled: true 
    });
    
    expect(button.getElement().disabled).toBe(true);
  });

  it('should toggle disabled state', () => {
    const button = new Button({ label: 'Test' });
    
    button.setDisabled(true);
    expect(button.getElement().disabled).toBe(true);
    
    button.setDisabled(false);
    expect(button.getElement().disabled).toBe(false);
  });

  it('should toggle active state', () => {
    const button = new Button({ label: 'Test' });
    
    button.setActive(true);
    expect(button.getElement().className).toContain('likha-button--active');
    
    button.setActive(false);
    expect(button.getElement().className).not.toContain('likha-button--active');
  });

  it('should check active state periodically when isActive provided', () => {
    const isActive = false;
    const button = new Button({ 
      label: 'Test',
      isActive: () => isActive
    });
    
    // Initially not active
    expect(button.getElement().className).not.toContain('likha-button--active');
    
    // Cleanup
    button.destroy();
  });

  it('should destroy button', () => {
    const button = new Button({ label: 'Test' });
    const container = document.createElement('div');
    container.appendChild(button.getElement());
    
    button.destroy();
    
    expect(container.contains(button.getElement())).toBe(false);
  });
});
