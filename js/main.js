/**
 * Whitefir Studio - 主应用程序
 * 
 * Feature: personal-website-redesign
 * 负责初始化全局功能和组件
 */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Whitefir] 应用程序初始化中...');
  
  // 初始化平滑滚动
  initSmoothScroll();
  
  // 初始化移动端菜单
  initMobileMenu();
  
  // 初始化滚动动画
  initScrollAnimations();
  
  console.log('[Whitefir] 应用程序初始化完成');
});

/**
 * 初始化平滑滚动
 * 为所有锚点链接添加平滑滚动效果
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // 如果只是 #，不做处理
      if (href === '#') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  console.log('[Whitefir] 平滑滚动已初始化');
}

/**
 * 初始化移动端菜单
 * 处理汉堡菜单的展开/收起
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      
      // 切换图标
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        } else {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        }
      }
    });
    
    console.log('[Whitefir] 移动端菜单已初始化');
  }
}

/**
 * 初始化滚动动画
 * 使用 AnimationController 类实现元素进入视口时的动画效果
 * Requirements: 3.4
 */
function initScrollAnimations() {
  // 使用 AnimationController 类
  if (typeof AnimationController !== 'undefined') {
    window.animationController = new AnimationController({
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  } else {
    console.warn('[Whitefir] AnimationController 未加载，使用降级方案');
    // 降级方案：直接显示所有元素
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
}

/**
 * 工具函数：显示加载提示
 * @param {string} message - 提示消息
 */
function showLoading(message = '加载中...') {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-indicator';
  loadingDiv.className = 'fixed top-20 right-4 z-50 glass-card p-4 rounded-xl';
  loadingDiv.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas fa-spinner fa-spin text-purple-400"></i>
      <p class="text-sm text-white">${message}</p>
    </div>
  `;
  
  document.body.appendChild(loadingDiv);
}

/**
 * 工具函数：隐藏加载提示
 */
function hideLoading() {
  const loadingDiv = document.getElementById('loading-indicator');
  if (loadingDiv) {
    loadingDiv.style.opacity = '0';
    loadingDiv.style.transition = 'opacity 300ms ease-in-out';
    setTimeout(() => loadingDiv.remove(), 300);
  }
}

/**
 * 工具函数：显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-20 right-4 z-50 glass-card border-green-500/50 p-4 rounded-xl';
  successDiv.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas fa-check-circle text-green-400 text-xl"></i>
      <p class="text-sm text-white">${message}</p>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.style.opacity = '0';
    successDiv.style.transition = 'opacity 300ms ease-in-out';
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

// 导出工具函数到全局作用域
if (typeof window !== 'undefined') {
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
  window.showSuccess = showSuccess;
}
