/**
 * AnimationController - 动画控制器
 * 
 * 功能：
 * - 使用 Intersection Observer 实现滚动触发的淡入向上动画
 * - 管理页面元素的进入动画
 * - 提供统一的动画接口
 * 
 * Feature: personal-website-redesign
 * Requirements: 3.4 (滚动触发动画)
 * 
 * 使用方法：
 * 1. 在 HTML 元素上添加 .animate-on-scroll 类
 * 2. 页面加载时初始化：new AnimationController()
 * 3. 当元素进入视口时，自动添加 .animate-fade-in-up 类触发动画
 */

class AnimationController {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {number} options.threshold - 触发动画的阈值 (0-1)，默认 0.1
   * @param {string} options.rootMargin - 根边距，默认 '0px'
   */
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px'
    };
    
    this.observer = null;
    this.animatedElements = new Set();
    
    this.init();
  }
  
  /**
   * 初始化动画控制器
   */
  init() {
    try {
      this.setupIntersectionObserver();
      this.observeElements();
      console.log('✅ AnimationController 初始化成功');
    } catch (error) {
      console.warn('⚠️ AnimationController 初始化失败，禁用滚动动画:', error);
      this.fallbackToImmediateDisplay();
    }
  }
  
  /**
   * 设置 Intersection Observer
   * 监听元素进入视口的事件
   */
  setupIntersectionObserver() {
    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      throw new Error('Intersection Observer not supported');
    }
    
    // 创建观察器
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 当元素进入视口时
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    });
  }
  
  /**
   * 观察所有需要动画的元素
   */
  observeElements() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if (elements.length === 0) {
      console.log('ℹ️ 没有找到需要动画的元素 (.animate-on-scroll)');
      return;
    }
    
    elements.forEach(element => {
      this.observer.observe(element);
    });
    
    console.log(`📊 正在观察 ${elements.length} 个元素的滚动动画`);
  }
  
  /**
   * 为元素添加动画
   * @param {HTMLElement} element - 要动画的元素
   */
  animateElement(element) {
    // 避免重复动画
    if (this.animatedElements.has(element)) {
      return;
    }
    
    // 添加动画类
    element.classList.add('animate-fade-in-up');
    this.animatedElements.add(element);
    
    // 停止观察已动画的元素（性能优化）
    this.observer.unobserve(element);
  }
  
  /**
   * 降级处理：立即显示所有元素（不使用动画）
   * 用于不支持 Intersection Observer 的浏览器
   */
  fallbackToImmediateDisplay() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    console.log('ℹ️ 使用降级方案：立即显示所有内容（无动画）');
  }
  
  /**
   * 手动触发元素动画
   * @param {HTMLElement|string} elementOrSelector - 元素或选择器
   */
  triggerAnimation(elementOrSelector) {
    const element = typeof elementOrSelector === 'string' 
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;
    
    if (!element) {
      console.warn('⚠️ 未找到要动画的元素:', elementOrSelector);
      return;
    }
    
    this.animateElement(element);
  }
  
  /**
   * 重新观察所有元素（用于动态添加的内容）
   */
  refresh() {
    // 停止当前观察
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // 清空已动画元素集合
    this.animatedElements.clear();
    
    // 重新初始化
    this.setupIntersectionObserver();
    this.observeElements();
    
    console.log('🔄 AnimationController 已刷新');
  }
  
  /**
   * 销毁动画控制器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    this.animatedElements.clear();
    console.log('🗑️ AnimationController 已销毁');
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationController;
}
