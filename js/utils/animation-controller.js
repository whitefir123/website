/**
 * Animation Controller
 * 统一管理动效执行
 * Feature: journal-editor-enhancement
 * Requirements: 5.2, 5.3, 5.4, 10.1, 10.2, 10.3, 10.4
 */

class AnimationController {
  constructor() {
    // 动画曲线配置
    this.SPRING_BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    this.EASE_IN_OUT = 'ease-in-out';
    this.DEFAULT_DURATION = 300; // 毫秒

    // 检查用户是否偏好减少动画
    this.prefersReducedMotion = this.checkReducedMotionPreference();
  }

  /**
   * 检查用户是否偏好减少动画
   * @returns {boolean}
   */
  checkReducedMotionPreference() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 执行 spring-bounce 动画
   * @param {HTMLElement} element - 目标元素
   * @param {Function} callback - 动画完成回调
   */
  springBounce(element, callback) {
    if (!element) {
      console.warn('[AnimationController] 元素不存在');
      return;
    }

    // 如果用户偏好减少动画，使用简单淡入效果
    if (this.prefersReducedMotion) {
      this.fadeIn(element);
      if (callback) callback();
      return;
    }

    // 添加 will-change 优化性能
    element.style.willChange = 'transform';

    // 应用动画
    element.style.animation = 'none';
    // 强制重排以重置动画
    void element.offsetWidth;
    element.style.animation = `springBounce 0.6s ${this.SPRING_BOUNCE}`;

    // 动画完成后清理
    const handleAnimationEnd = () => {
      element.style.willChange = 'auto';
      element.removeEventListener('animationend', handleAnimationEnd);
      if (callback) callback();
    };

    element.addEventListener('animationend', handleAnimationEnd);
  }

  /**
   * 执行统计条伸展动画
   * @param {HTMLElement} bar - 统计条元素
   * @param {number} targetWidth - 目标宽度百分比
   * @param {number} delay - 延迟时间（毫秒）
   */
  expandBar(bar, targetWidth, delay = 0) {
    if (!bar) {
      console.warn('[AnimationController] 统计条元素不存在');
      return;
    }

    // 如果用户偏好减少动画，直接设置宽度
    if (this.prefersReducedMotion) {
      bar.style.width = `${targetWidth}%`;
      return;
    }

    // 添加 will-change 优化性能
    bar.style.willChange = 'width';

    // 初始状态
    bar.style.width = '0%';
    bar.style.transition = 'none';

    // 延迟后开始动画
    setTimeout(() => {
      bar.style.transition = `width 0.8s ${this.SPRING_BOUNCE}`;
      bar.style.width = `${targetWidth}%`;

      // 动画完成后清理
      setTimeout(() => {
        bar.style.willChange = 'auto';
      }, 800);
    }, delay);
  }

  /**
   * 淡入动画
   * @param {HTMLElement} element - 目标元素
   * @param {number} duration - 动画时长（毫秒）
   */
  fadeIn(element, duration = this.DEFAULT_DURATION) {
    if (!element) {
      console.warn('[AnimationController] 元素不存在');
      return;
    }

    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${this.EASE_IN_OUT}`;

    // 强制重排
    void element.offsetWidth;

    element.style.opacity = '1';
  }

  /**
   * 淡出动画
   * @param {HTMLElement} element - 目标元素
   * @param {number} duration - 动画时长（毫秒）
   * @param {Function} callback - 动画完成回调
   */
  fadeOut(element, duration = this.DEFAULT_DURATION, callback) {
    if (!element) {
      console.warn('[AnimationController] 元素不存在');
      return;
    }

    element.style.transition = `opacity ${duration}ms ${this.EASE_IN_OUT}`;
    element.style.opacity = '0';

    setTimeout(() => {
      if (callback) callback();
    }, duration);
  }

  /**
   * 滑入动画（从下方）
   * @param {HTMLElement} element - 目标元素
   * @param {number} distance - 滑动距离（像素）
   * @param {number} duration - 动画时长（毫秒）
   */
  slideInUp(element, distance = 20, duration = this.DEFAULT_DURATION) {
    if (!element) {
      console.warn('[AnimationController] 元素不存在');
      return;
    }

    if (this.prefersReducedMotion) {
      this.fadeIn(element, duration);
      return;
    }

    element.style.opacity = '0';
    element.style.transform = `translateY(${distance}px)`;
    element.style.transition = `opacity ${duration}ms ${this.EASE_IN_OUT}, transform ${duration}ms ${this.EASE_IN_OUT}`;

    // 强制重排
    void element.offsetWidth;

    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  /**
   * 创建 Intersection Observer 用于检测元素进入视口
   * @param {Function} callback - 元素进入视口时的回调
   * @param {Object} options - Intersection Observer 选项
   * @returns {IntersectionObserver}
   */
  createViewportObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerOptions = { ...defaultOptions, ...options };

    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    }, observerOptions);
  }

  /**
   * 为多个元素添加递增延迟的动画
   * @param {HTMLElement[]} elements - 元素数组
   * @param {Function} animationFn - 动画函数
   * @param {number} delayIncrement - 延迟递增量（毫秒）
   */
  staggerAnimation(elements, animationFn, delayIncrement = 100) {
    if (!elements || !Array.isArray(elements)) {
      console.warn('[AnimationController] 元素数组无效');
      return;
    }

    elements.forEach((element, index) => {
      const delay = index * delayIncrement;
      setTimeout(() => {
        animationFn(element);
      }, delay);
    });
  }
}

// 导出到全局作用域（浏览器环境）
if (typeof window !== 'undefined') {
  window.AnimationController = AnimationController;
  window.animationController = new AnimationController();
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController };
}
