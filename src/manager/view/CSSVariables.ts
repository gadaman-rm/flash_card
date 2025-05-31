class CSSVariables {
  private element: HTMLElement;

  constructor(element: HTMLElement = document.documentElement) {
    this.element = element;
  }

  /**
   * Get the value of a CSS variable.
   * @param variableName - The name of the CSS variable (without '--').
   * @returns The value of the CSS variable, or null if it doesn't exist.
   */
  get(variableName: string): string | null {
    return this.element.style.getPropertyValue(`${variableName}`) || null;
  }

  /**
   * Set the value of a CSS variable.
   * @param variableName - The name of the CSS variable (without '--').
   * @param value - The value to set for the CSS variable.
   */
  set(variableName: string, value: string): void {
    this.element.style.setProperty(`${variableName}`, value);
  }

  /**
   * Remove a CSS variable.
   * @param variableName - The name of the CSS variable (without '--').
   */
  remove(variableName: string): void {
    this.element.style.removeProperty(`${variableName}`);
  }

  /**
   * Check if a CSS variable exists.
   * @param variableName - The name of the CSS variable (without '--').
   * @returns True if the CSS variable exists, false otherwise.
   */
  has(variableName: string): boolean {
    return this.get(variableName) !== null;
  }
}

// Example usage:
const cssVariables = new CSSVariables();
export default cssVariables;
