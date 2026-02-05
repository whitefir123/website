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
   * 提示词 2: 结合 scale 和 blur 的微小变化，呈现"涟漪状"入场感
   * @param {HTMLElement} container - 瀑布流容器
   */
  animateStaggerContainer(container) {
    // 获取所有直接子元素
    const children = Array.from(container.children);
    
    // 提示词 2: 根据 Bento Grid 位置动态计算延迟
    // 计算每个元素的位置（行和列）
    const containerRect = container.getBoundingClientRect();
    
    children.forEach((child, index) => {
      const childRect = child.getBoundingClientRect();
      
      // 计算元素中心点相对于容器的距离（用于涟漪效果）
      const centerX = childRect.left + childRect.width / 2 - containerRect.left;
      const centerY = childRect.top + childRect.height / 2 - containerRect.top;
      const distance = Math.sqrt(centerX * centerX + centerY * centerY);
      
      // 根据距离计算延迟（距离越远，延迟越大）
      const delay = Math.min(distance * 0.3, 800); // 最大延迟 800ms
      
      setTimeout(() => {
        // 提示词 2: 添加增强的动画类（包含 scale 和 blur）
        child.style.animation = 'smartFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        child.style.opacity = '1';
      }, delay);
    });
    
    console.log(`🌊 瀑布流动画（涟漪状）：${children.length} 个子元素`);
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
 * ParallaxController - 增强视差效果控制器
 * 为背景和前景元素创建差异化滚动速度，营造 3D 深度感
 * 
 * Requirements: 20.1, 20.2, 20.3, 20.4, 20.5
 */
class ParallaxController {
  /**
   * 构造函数
   * @param {Object} options - 配置选项
   */
  constructor(options = {}) {
    this.elements = [];
    this.ticking = false;
    this.isMobile = window.innerWidth <= 768;
    
    // Requirement 20.5: 移动设备禁用视差效果
    if (this.isMobile) {
      console.log('[ParallaxController] 移动设备检测到，视差效果已禁用');
      return;
    }
    
    this.init();
  }
  
  /**
   * 初始化视差效果
   * Requirement 20.1, 20.4
   */
  init() {
    // 查找所有带有 data-parallax 属性的元素
    this.findParallaxElements();
    
    if (this.elements.length === 0) {
      console.log('[ParallaxController] 未找到视差元素');
      return;
    }
    
    // Requirement 20.4: 使用 requestAnimationFrame 优化性能
    window.addEventListener('scroll', () => this.requestTick());
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      if (this.isMobile) {
        this.resetParallax();
      }
    });
    
    console.log(`[ParallaxController] 初始化完成，${this.elements.length} 个元素`);
  }
  
  /**
   * 查找所有视差元素
   */
  findParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      this.elements.push({ element: el, speed });
    });
  }
  
  /**
   * 请求动画帧
   * Requirement 20.4: 使用 requestAnimationFrame
   */
  requestTick() {
    if (!this.ticking && !this.isMobile) {
      requestAnimationFrame(() => this.update());
      this.ticking = true;
    }
  }
  
  /**
   * 更新视差位置
   * Requirements: 20.1, 20.2, 20.3
   */
  update() {
    const scrollY = window.pageYOffset;
    
    this.elements.forEach(({ element, speed }) => {
      // Requirement 20.1: 背景移动速度慢于前景
      // speed < 1: 背景（慢速）
      // speed = 0: 前景（不动）
      // speed > 1: 超快速（特殊效果）
      const offset = scrollY * speed;
      
      // Requirement 20.2, 20.3: 创建 3D 深度感，但保持微妙
      element.style.transform = `translateY(${offset}px)`;
    });
    
    this.ticking = false;
  }
  
  /**
   * 重置视差效果（移动端）
   */
  resetParallax() {
    this.elements.forEach(({ element }) => {
      element.style.transform = 'translateY(0)';
    });
  }
  
  /**
   * 添加新的视差元素
   * @param {HTMLElement} element - 元素
   * @param {number} speed - 速度（0-1）
   */
  addElement(element, speed = 0.5) {
    if (!this.isMobile) {
      this.elements.push({ element, speed });
    }
  }
  
  /**
   * 销毁控制器
   */
  destroy() {
    this.resetParallax();
    this.elements = [];
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController, ParallaxController };
}
