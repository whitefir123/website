/**
 * LineRevealController - 文字行切入动画控制器
 * 
 * 实现文字从隐藏容器中向上滑动出现的电影级入场效果
 * 
 * Features:
 * - Intersection Observer 触发动画
 * - 多行文字顺序延迟效果
 * - overflow-hidden + translateY 实现
 * - 0.6-0.8秒完成动画
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */

class LineRevealController {
  constructor() {
    this.observer = null;
    this.isInitialized = false;
    this.init();
  }

  /**
   * 初始化 Line Reveal 控制器
   */
  init() {
    // 创建 Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // 可选：动画完成后停止观察以提升性能
          // this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3, // 当元素30%可见时触发
      rootMargin: '0px 0px -50px 0px' // 提前触发动画
    });

    // 观察所有 line-reveal-container 元素
    this.observeElements();
    
    this.isInitialized = true;
    console.log('[LineRevealController] 初始化完成');
  }

  /**
   * 观察所有需要 line reveal 动画的元素
   */
  observeElements() {
    const containers = document.querySelectorAll('.line-reveal-container');
    
    containers.forEach(container => {
      this.observer.observe(container);
    });

    console.log(`[LineRevealController] 正在观察 ${containers.length} 个元素`);
  }

  /**
   * 为元素添加 line reveal 效果
   * @param {HTMLElement} element - 需要添加效果的元素
   * @param {number} delay - 延迟时间（秒）
   */
  static applyToElement(element, delay = 0) {
    if (!element) return;

    // 创建包装容器
    const container = document.createElement('div');
    container.className = 'line-reveal-container';
    
    // 创建文字容器
    const textContainer = document.createElement('div');
    textContainer.className = 'line-reveal-text';
    textContainer.style.transitionDelay = `${delay}s`;
    textContainer.innerHTML = element.innerHTML;
    
    // 替换原始元素内容
    element.innerHTML = '';
    container.appendChild(textContainer);
    element.appendChild(container);
  }

  /**
   * 批量为元素添加 line reveal 效果
   * @param {string} selector - CSS 选择器
   * @param {number} staggerDelay - 每个元素之间的延迟（秒）
   */
  static applyToElements(selector, staggerDelay = 0.1) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      LineRevealController.applyToElement(element, index * staggerDelay);
    });

    console.log(`[LineRevealController] 已为 ${elements.length} 个元素添加 line reveal 效果`);
  }

  /**
   * 手动触发元素的 reveal 动画
   * @param {HTMLElement} container - line-reveal-container 元素
   */
  static reveal(container) {
    if (container && container.classList.contains('line-reveal-container')) {
      container.classList.add('revealed');
    }
  }

  /**
   * 重置元素的 reveal 状态
   * @param {HTMLElement} container - line-reveal-container 元素
   */
  static reset(container) {
    if (container && container.classList.contains('line-reveal-container')) {
      container.classList.remove('revealed');
    }
  }

  /**
   * 销毁控制器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.isInitialized = false;
  }

  /**
   * 重新观察元素（用于动态添加的内容）
   */
  refresh() {
    this.observeElements();
  }
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.lineRevealController = new LineRevealController();
  });
} else {
  window.lineRevealController = new LineRevealController();
}
