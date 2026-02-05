/**
 * Magnetic Effect - 磁吸按钮效果
 * 提示词 4: 当鼠标靠近社交图标或导航链接时，图标会向鼠标方向轻微偏移
 */

class MagneticEffect {
  constructor() {
    this.magneticElements = [];
    this.init();
  }

  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupMagneticElements());
    } else {
      this.setupMagneticElements();
    }
  }

  setupMagneticElements() {
    // 获取所有带有 magnetic-element 类的元素
    this.magneticElements = document.querySelectorAll('.magnetic-element');
    
    this.magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
      element.addEventListener('mouseleave', () => this.handleMouseLeave(element));
    });

    console.log(`[MagneticEffect] 已为 ${this.magneticElements.length} 个元素添加磁吸效果`);
  }

  handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 计算鼠标相对于元素中心的偏移
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // 限制偏移量（最大 8px）
    const maxOffset = 8;
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.3));
    const offsetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * 0.3));
    
    // 应用变换
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  handleMouseLeave(element) {
    // 鼠标离开时恢复原位
    element.style.transform = 'translate(0, 0)';
  }
}

// 初始化磁吸效果
if (typeof window !== 'undefined') {
  window.magneticEffect = new MagneticEffect();
}
