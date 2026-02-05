/**
 * Navigation Component
 * Handles mobile menu toggle, smooth scrolling, and active section highlighting
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

class NavigationComponent {
  constructor() {
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.lastActiveSection = null; // 提示词 4: 记录上一个激活的 section，避免闪烁
    this.jellyBg = null; // 果冻背景元素
    this.init();
  }
  
  init() {
    this.attachEventListeners();
    this.highlightActiveSection();
    this.setupSmoothScroll();
    this.initJellyBackground(); // 初始化果冻背景
    this.initLoadingProgress(); // 初始化加载进度条
  }
  
  /**
   * Attach event listeners for mobile menu toggle
   */
  attachEventListeners() {
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
      
      // Close mobile menu when clicking on a link
      const mobileLinks = this.mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.mobileMenu.contains(e.target) && 
            !this.mobileMenuBtn.contains(e.target) &&
            !this.mobileMenu.classList.contains('hidden')) {
          this.closeMobileMenu();
        }
      });
    }
  }
  
  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu() {
    if (this.mobileMenu.classList.contains('hidden')) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }
  
  /**
   * Open mobile menu with animation
   */
  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden');
    // Change icon to close
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
  }
  
  /**
   * Close mobile menu with animation
   */
  closeMobileMenu() {
    this.mobileMenu.classList.add('hidden');
    // Change icon back to hamburger
    const icon = this.mobileMenuBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  }
  
  /**
   * Highlight the active section in navigation
   */
  highlightActiveSection() {
    // Get current page path and hash
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Remove active styles first
      link.classList.remove('text-white', 'border-b-2', 'border-purple-500');
      link.classList.add('text-white/70');
      
      // Check if link matches current page
      if (href === '/calendar.html' && currentPath.includes('calendar.html')) {
        this.setActiveLink(link);
      } else if (href === '/journal.html' && currentPath.includes('journal.html')) {
        this.setActiveLink(link);
      } else if (href.includes('#') && (currentPath === '/' || currentPath === '/index.html' || currentPath === '')) {
        // For homepage sections
        const targetHash = href.split('#')[1];
        if (currentHash === `#${targetHash}` || (!currentHash && targetHash === 'home')) {
          this.setActiveLink(link);
        }
      }
    });
    
    // Update on hash change
    window.addEventListener('hashchange', () => {
      this.highlightActiveSection();
    });
    
    // Update on scroll to detect visible sections
    this.setupScrollSpy();
  }
  
  /**
   * Set a link as active
   */
  setActiveLink(link) {
    link.classList.add('text-white', 'border-b-2', 'border-purple-500');
    link.classList.remove('text-white/70');
  }
  
  /**
   * Setup scroll spy to highlight sections in viewport
   */
  setupScrollSpy() {
    // Only run on homepage
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '') {
      return;
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateActiveOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  /**
   * Update active link based on scroll position
   * 提示词 4: 优化滚动监听逻辑，避免在滚动到两个 Section 边界时导航条高亮闪烁
   */
  updateActiveOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // 增加偏移量以提前触发
    
    let currentSection = null;
    
    // 找到当前最匹配的 section
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      // 使用更宽松的判断条件，减少边界闪烁
      if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
        currentSection = sectionId;
      }
    });
    
    // 如果找到了当前 section，更新导航高亮
    if (currentSection) {
      // 防抖：只在 section 真正改变时更新
      if (this.lastActiveSection !== currentSection) {
        this.lastActiveSection = currentSection;
        
        // Update hash without scrolling
        if (window.location.hash !== `#${currentSection}`) {
          history.replaceState(null, null, `#${currentSection}`);
        }
        
        // Update active link
        this.navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.remove('text-white', 'border-b-2', 'border-purple-500');
          link.classList.add('text-white/70');
          
          if (href === `/#${currentSection}` || href === `#${currentSection}`) {
            this.setActiveLink(link);
          }
        });
      }
    }
  }
  
  /**
   * Setup smooth scroll behavior for anchor links
   */
  setupSmoothScroll() {
    // Get all links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle if it's a hash link on the same page
        if (href && href !== '#' && !href.includes('/#')) {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Calculate offset for fixed navigation
            const navHeight = document.querySelector('nav')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            // Smooth scroll to target
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update URL hash without jumping
            history.pushState(null, null, href);
            
            // Close mobile menu if open
            this.closeMobileMenu();
          }
        }
      });
    });
  }
  
  /**
   * 初始化果冻背景效果
   */
  initJellyBackground() {
    // 只在桌面端启用
    if (window.innerWidth < 768) return;
    
    const desktopNav = document.querySelector('nav .hidden.md\\:flex');
    if (!desktopNav) return;
    
    // 创建果冻背景元素
    this.jellyBg = document.createElement('div');
    this.jellyBg.className = 'nav-jelly-bg';
    
    // 包装导航链接
    const navLinksWrapper = document.createElement('div');
    navLinksWrapper.className = 'nav-links-container flex space-x-8 relative';
    
    // 将现有链接移到包装器中
    const links = Array.from(desktopNav.children);
    links.forEach(link => navLinksWrapper.appendChild(link));
    
    // 添加果冻背景和包装器
    navLinksWrapper.appendChild(this.jellyBg);
    desktopNav.appendChild(navLinksWrapper);
    
    // 为每个链接添加 hover 事件
    this.navLinks.forEach(link => {
      link.addEventListener('mouseenter', (e) => {
        this.updateJellyPosition(e.target);
      });
    });
    
    // 鼠标离开导航区域时隐藏果冻背景
    navLinksWrapper.addEventListener('mouseleave', () => {
      if (this.jellyBg) {
        this.jellyBg.style.opacity = '0';
      }
    });
  }
  
  /**
   * 更新果冻背景位置
   */
  updateJellyPosition(linkElement) {
    if (!this.jellyBg) return;
    
    const rect = linkElement.getBoundingClientRect();
    const parentRect = linkElement.parentElement.getBoundingClientRect();
    
    const left = rect.left - parentRect.left;
    const width = rect.width;
    
    this.jellyBg.style.left = `${left}px`;
    this.jellyBg.style.width = `${width}px`;
    this.jellyBg.style.opacity = '1';
  }
  
  /**
   * 初始化加载进度条
   */
  initLoadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.id = 'loading-progress';
    document.body.appendChild(progressBar);
    
    // 模拟加载进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 90) {
        progress = 90;
        clearInterval(interval);
      }
      progressBar.style.width = `${progress}%`;
    }, 200);
    
    // 页面完全加载后完成进度条
    window.addEventListener('load', () => {
      clearInterval(interval);
      progressBar.style.width = '100%';
      
      // 延迟后移除进度条
      setTimeout(() => {
        progressBar.classList.add('complete');
        setTimeout(() => {
          progressBar.remove();
        }, 500);
      }, 300);
    });
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new NavigationComponent();
  });
} else {
  new NavigationComponent();
}
