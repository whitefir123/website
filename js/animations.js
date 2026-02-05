/**
 * AnimationController - 动画控制器
 * 
 * 功能：
 * - 使用 Intersection Observer 实现滚动触发的淡入向上动画
 * - 瀑布流入场：子元素按 50ms 间隔依次触发
 * - 管理页面元素的进入动画
 * - 提供统一的动画接口
 * 
 * Feature: personal-website-redesign
 * Requirements: 3.4 (滚动触发动画)
 * 
 * 使用方法：
 * 1. 在 HTML 元素上添加 .animate-on-scroll 类
 * 2. 在容器上添加 .stagger-container 类以启用瀑布流效果
 * 3. 页面加载时初始化：new AnimationController()
 * 4. 当元素进入视口时，自动添加 .animate-smart-fade-in 类触发动画
 */

class AnimationController {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   * @param {number} options.threshold - 触发动画的阈值 (0-1)，默认 0.1
   * @param {string} options.rootMargin - 根边距，默认 '0px'
   * @param {number} options.staggerDelay - 瀑布流延迟间隔（毫秒），默认 50
   */
  constructor(options = {}) {
    this.options = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      staggerDelay: options.staggerDelay || 50
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
    
    // 检查是否为瀑布流容器
    if (element.classList.contains('stagger-container')) {
      this.animateStaggerContainer(element);
    } else {
      // 普通元素：直接添加动画类
      element.classList.add('animate-smart-fade-in');
    }
    
    this.animatedElements.add(element);
    
    // 停止观察已动画的元素（性能优化）
    this.observer.unobserve(element);
  }
  
  /**
   * 为瀑布流容器的子元素依次添加动画
   * @param {HTMLElement} container - 瀑布流容器
   */
  animateStaggerContainer(container) {
    // 获取所有直接子元素
    const children = Array.from(container.children);
    
    // 为每个子元素按顺序添加动画，间隔 50ms
    children.forEach((child, index) => {
      setTimeout(() => {
        child.classList.add('animate-smart-fade-in');
      }, index * this.options.staggerDelay);
    });
    
    console.log(`🌊 瀑布流动画：${children.length} 个子元素，间隔 ${this.options.staggerDelay}ms`);
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

/**
 * ParallaxController - 视差效果控制器
 * 为 Hero Section 文字添加随滚动微弱移动的视差效果
 */
class ParallaxController {
  /**
   * 构造函数
   * @param {string} selector - 要应用视差效果的元素选择器
   * @param {number} intensity - 视差强度（0-1），默认 0.3
   */
  constructor(selector, intensity = 0.3) {
    this.elements = document.querySelectorAll(selector);
    this.intensity = intensity;
    this.ticking = false;
    
    if (this.elements.length > 0) {
      this.init();
    }
  }
  
  /**
   * 初始化视差效果
   */
  init() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
    
    console.log(`✨ 视差效果已启用：${this.elements.length} 个元素，强度 ${this.intensity}`);
  }
  
  /**
   * 更新视差位置
   */
  updateParallax() {
    const scrollY = window.scrollY;
    
    this.elements.forEach(element => {
      // 计算视差偏移量（向上移动）
      const offset = scrollY * this.intensity;
      element.style.transform = `translateY(${offset}px)`;
    });
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController, ParallaxController };
}
