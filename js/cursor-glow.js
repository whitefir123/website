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
   * 提示词 1: 增强光晕在经过 .glass-card 时的反射效果
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   */
  updateGlowPosition(x, y) {
    if (!this.isInitialized) return;
    
    // 检测鼠标是否在 glass-card 上
    const elementUnderCursor = document.elementFromPoint(x, y);
    const isOverGlassCard = elementUnderCursor && elementUnderCursor.closest('.glass-card, .project-card');
    
    // 提示词 1: 在 glass-card 上时增强光晕强度和范围
    if (isOverGlassCard) {
      // 增强版：更大范围（800px）+ 更高不透明度（0.12）+ 多层渐变
      this.glowElement.style.background = `
        radial-gradient(circle 800px at ${x}px ${y}px, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 100%),
        radial-gradient(circle 400px at ${x}px ${y}px, rgba(255, 255, 255, 0.03) 0%, transparent 60%)
      `;
    } else {
      // 标准版：600px 范围 + 8% 不透明度
      this.glowElement.style.background = `radial-gradient(circle 600px at ${x}px ${y}px, rgba(139, 92, 246, 0.08) 0%, transparent 100%)`;
    }
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
