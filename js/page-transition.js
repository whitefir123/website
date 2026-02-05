/**
 * PageTransitionController - 无缝页面过渡控制器
 * 
 * 实现页面导航时的平滑淡入淡出过渡效果
 * 
 * Features:
 * - 支持 View Transition API（现代浏览器）
 * - 降级方案：全屏淡入淡出遮罩
 * - 拦截导航链接
 * - 300-400ms 过渡时间
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

class PageTransitionController {
  constructor() {
    this.transitionOverlay = null;
    this.isTransitioning = false;
    this.supportsViewTransition = 'startViewTransition' in document;
    this.init();
  }

  /**
   * 初始化页面过渡控制器
   */
  init() {
    // 创建过渡遮罩
    this.createOverlay();
    
    // 拦截导航链接
    this.interceptNavigationLinks();
    
    // 页面加载时淡入
    this.fadeIn();
    
    console.log(`[PageTransition] 初始化完成 (View Transition API: ${this.supportsViewTransition ? '支持' : '不支持'})`);
  }

  /**
   * 创建过渡遮罩元素
   */
  createOverlay() {
    this.transitionOverlay = document.createElement('div');
    this.transitionOverlay.className = 'page-transition-overlay';
    this.transitionOverlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.transitionOverlay);
  }

  /**
   * 拦截所有内部导航链接
   * Requirement 19.3: 拦截导航链接
   */
  interceptNavigationLinks() {
    // 拦截所有内部链接
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      
      // 检查是否是内部链接
      if (link && this.isInternalLink(link)) {
        e.preventDefault();
        this.transitionToPage(link.href);
      }
    });
  }

  /**
   * 判断是否是内部链接
   * @param {HTMLAnchorElement} link - 链接元素
   * @returns {boolean}
   */
  isInternalLink(link) {
    // 排除外部链接
    if (link.target === '_blank') return false;
    if (link.rel === 'external') return false;
    if (link.href.startsWith('mailto:')) return false;
    if (link.href.startsWith('tel:')) return false;
    if (link.href.startsWith('#')) return false;
    
    // 检查是否是同域名
    try {
      const linkUrl = new URL(link.href);
      const currentUrl = new URL(window.location.href);
      return linkUrl.hostname === currentUrl.hostname;
    } catch (e) {
      return false;
    }
  }

  /**
   * 过渡到新页面
   * Requirements: 19.1, 19.2, 19.3, 19.4
   * @param {string} url - 目标页面 URL
   */
  async transitionToPage(url) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    console.log(`[PageTransition] 导航到: ${url}`);

    // Requirement 19.1: 优先使用 View Transition API
    if (this.supportsViewTransition) {
      try {
        await document.startViewTransition(() => {
          window.location.href = url;
        }).finished;
      } catch (error) {
        console.warn('[PageTransition] View Transition API 失败，使用降级方案', error);
        await this.fallbackTransition(url);
      }
    } else {
      // Requirement 19.2: 降级方案 - 全屏淡入淡出遮罩
      await this.fallbackTransition(url);
    }
  }

  /**
   * 降级过渡方案
   * Requirement 19.2, 19.3, 19.4, 19.5
   * @param {string} url - 目标页面 URL
   */
  async fallbackTransition(url) {
    // Requirement 19.3: 淡出当前页面
    await this.fadeOut();
    
    // 导航到新页面
    window.location.href = url;
  }

  /**
   * 淡出效果
   * Requirement 19.5: 300-400ms 完成
   * @returns {Promise}
   */
  fadeOut() {
    return new Promise(resolve => {
      this.transitionOverlay.classList.add('active');
      setTimeout(resolve, 350); // 350ms
    });
  }

  /**
   * 淡入效果
   * Requirement 19.4: 新页面淡入
   * @returns {Promise}
   */
  fadeIn() {
    return new Promise(resolve => {
      // 延迟一帧以确保 DOM 已渲染
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.transitionOverlay.classList.remove('active');
          this.isTransitioning = false;
          resolve();
        }, 100);
      });
    });
  }

  /**
   * 手动触发淡出
   */
  async triggerFadeOut() {
    await this.fadeOut();
  }

  /**
   * 手动触发淡入
   */
  async triggerFadeIn() {
    await this.fadeIn();
  }

  /**
   * 销毁控制器
   */
  destroy() {
    if (this.transitionOverlay && this.transitionOverlay.parentNode) {
      this.transitionOverlay.parentNode.removeChild(this.transitionOverlay);
    }
  }
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitionController = new PageTransitionController();
  });
} else {
  window.pageTransitionController = new PageTransitionController();
}
