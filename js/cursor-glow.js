/**
 * CursorGlow Component
 * 
 * Creates a subtle radial gradient glow that follows the cursor
 * to add dynamic lighting to the dark background.
 * 
 * Features:
 * - Smooth cursor tracking with mousemove event
 * - Extremely subtle purple glow (rgba(139, 92, 246, 0.08))
 * - Does not interfere with text readability
 * - Fixed positioning with pointer-events: none
 */

class CursorGlow {
  constructor() {
    this.glowElement = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize the cursor glow effect
   */
  init() {
    // Create glow element
    this.glowElement = document.createElement('div');
    this.glowElement.className = 'cursor-glow';
    this.glowElement.setAttribute('aria-hidden', 'true');
    
    // Insert at the beginning of body to ensure it's behind content
    document.body.insertBefore(this.glowElement, document.body.firstChild);
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.updateGlowPosition(e.clientX, e.clientY);
    });
    
    // Disable on touch devices for performance
    if ('ontouchstart' in window) {
      this.glowElement.style.display = 'none';
      return;
    }
    
    this.isInitialized = true;
    console.log('CursorGlow initialized');
  }

  /**
   * Update glow position based on cursor coordinates
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   */
  updateGlowPosition(x, y) {
    if (!this.isInitialized) return;
    
    // Create radial gradient centered at cursor position
    // 600px radius for subtle, wide glow
    // rgba(139, 92, 246, 0.08) = magic purple at 8% opacity
    this.glowElement.style.background = `radial-gradient(circle 600px at ${x}px ${y}px, rgba(139, 92, 246, 0.08) 0%, transparent 100%)`;
  }

  /**
   * Destroy the cursor glow effect
   */
  destroy() {
    if (this.glowElement && this.glowElement.parentNode) {
      this.glowElement.parentNode.removeChild(this.glowElement);
    }
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cursorGlow = new CursorGlow();
  });
} else {
  window.cursorGlow = new CursorGlow();
}
