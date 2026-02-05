/**
 * ProjectShowcase - 项目展示组件
 * 负责加载和渲染项目卡片
 * 
 * Feature: personal-website-redesign
 * Requirements: 4.1, 4.2, 4.6
 */

class ProjectShowcase {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   * @param {string} dataUrl - 项目数据 JSON 文件的 URL
   */
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.projects = [];
    
    if (!this.container) {
      console.error(`[ProjectShowcase] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 加载项目数据
   * Requirements: 4.1, 4.2
   */
  async loadProjects() {
    try {
      console.log('[ProjectShowcase] 正在加载项目数据...');
      
      // 使用 DataLoader 加载数据
      const data = await dataLoader.fetchJSON(this.dataUrl);
      
      // 验证数据结构
      if (!data || !Array.isArray(data.projects)) {
        console.warn('[ProjectShowcase] 数据格式无效，使用空数组');
        this.projects = [];
      } else {
        this.projects = data.projects;
        console.log(`[ProjectShowcase] 成功加载 ${this.projects.length} 个项目`);
      }
      
      // 渲染项目卡片
      this.render();
      
    } catch (error) {
      console.error('[ProjectShowcase] 加载项目失败:', error);
      this.projects = [];
      this.render();
    }
  }

  /**
   * 渲染所有项目卡片
   * Requirements: 4.1
   */
  render() {
    if (!this.container) {
      console.error('[ProjectShowcase] 容器不存在，无法渲染');
      return;
    }

    // 清空容器
    this.container.innerHTML = '';

    // 如果没有项目，显示空状态
    if (this.projects.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-folder-open text-6xl text-white/10 mb-4"></i>
          <p class="text-white/50 text-lg">暂无项目</p>
        </div>
      `;
      return;
    }

    // 渲染每个项目卡片
    this.projects.forEach(project => {
      const cardHTML = this.renderProjectCard(project);
      this.container.insertAdjacentHTML('beforeend', cardHTML);
    });

    // 添加点击事件监听器
    this.attachEventListeners();

    // 添加滚动动画类
    this.container.querySelectorAll('.project-card').forEach(card => {
      card.classList.add('animate-on-scroll');
    });
  }

  /**
   * 渲染单个项目卡片的 HTML
   * Requirements: 4.1, 4.6, 4.7, 4.8, 4.9, 4.10
   * @param {Object} project - 项目数据对象
   * @returns {string} 项目卡片的 HTML 字符串
   */
  renderProjectCard(project) {
    // 验证项目数据
    const validatedProject = this.validateProjectData(project);
    
    // 获取状态颜色类
    const statusColorClass = this.getStatusColorClass(validatedProject.statusColor);
    
    // 生成技术栈标签 HTML (Requirement 4.6)
    const techStackHTML = this.renderTechStack(validatedProject.techStack);
    
    // 判断是否有实时链接
    const hasLiveUrl = validatedProject.liveUrl && validatedProject.liveUrl !== null;
    
    // 生成卡片 HTML
    // Requirement 4.10: 响应式 padding (移动端较小，桌面端宽敞)
    return `
      <div class="project-card glass-card rounded-3xl overflow-hidden group cursor-pointer p-4 sm:p-6 lg:p-8" 
           data-project-id="${validatedProject.id}"
           data-detail-page="${validatedProject.detailPage}"
           data-live-url="${validatedProject.liveUrl || ''}">
        
        <!-- 项目缩略图 -->
        <!-- Requirement 4.7: 使用 aspect-video 替代固定高度 -->
        <div class="aspect-video bg-gradient-to-br ${this.getGradientClass(validatedProject.statusColor)} relative overflow-hidden rounded-lg mb-4">
          ${validatedProject.thumbnail && validatedProject.thumbnail !== '/assets/images/placeholder.webp' 
            ? `<img src="${validatedProject.thumbnail}" 
                    alt="${validatedProject.title}" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy" />`
            : `<div class="absolute inset-0 flex items-center justify-center text-5xl opacity-20 group-hover:opacity-40 transition">
                 <i class="fas fa-gamepad"></i>
               </div>`
          }
        </div>
        
        <!-- 项目信息 -->
        <div>
          <!-- 状态标签 -->
          <span class="text-xs ${statusColorClass} font-bold tracking-widest uppercase">
            ${validatedProject.status || '未知'}
          </span>
          
          <!-- 项目标题 -->
          <!-- Requirement 4.8: 标题使用 line-clamp-2 -->
          <h3 class="text-xl font-bold tracking-tighter line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors duration-300">
            ${validatedProject.title}
          </h3>
          
          <!-- 项目描述 -->
          <!-- 提示词 3: 描述使用 line-clamp-2，严格执行 -->
          <p class="text-white/70 leading-relaxed line-clamp-2 mb-4" style="min-height: 3rem;">
            ${validatedProject.description}
          </p>
          
          <!-- 技术栈标签云 (提示词 3: 超低对比度样式) -->
          <div class="mb-6">
            <div class="flex flex-wrap gap-2">
              ${techStackHTML}
            </div>
          </div>
          
          <!-- 操作按钮 (提示词 3: 极简形式 - 文字 + 箭头) -->
          <div class="flex gap-4 items-center">
            ${hasLiveUrl 
              ? `<a href="${validatedProject.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-minimal">
                   立即体验
                   <i class="fas fa-arrow-right"></i>
                 </a>`
              : `<span class="text-gray-500 text-sm">即将推出</span>`
            }
            <a href="${validatedProject.detailPage}" class="btn-minimal">
              查看详情
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染技术栈标签云
   * 提示词 3: 超低对比度样式，仅在悬停时才加深颜色
   * @param {string[]} techStack - 技术栈数组
   * @returns {string} 技术栈标签的 HTML 字符串
   */
  renderTechStack(techStack) {
    if (!Array.isArray(techStack) || techStack.length === 0) {
      return '<span class="text-xs text-white/30">暂无技术栈信息</span>';
    }

    return techStack.map(tech => `
      <span class="tech-tag">
        ${tech}
      </span>
    `).join('');
  }

  /**
   * 验证项目数据并提供默认值
   * @param {Object} project - 原始项目数据
   * @returns {Object} 验证后的项目数据
   */
  validateProjectData(project) {
    return {
      id: project.id || 'unknown',
      title: project.title || '未命名项目',
      description: project.description || '暂无描述',
      thumbnail: project.thumbnail || '/assets/images/placeholder.webp',
      screenshots: project.screenshots || [],
      techStack: project.techStack || [],
      liveUrl: project.liveUrl || null,
      detailPage: project.detailPage || '#',
      featured: project.featured || false,
      status: project.status || '未知',
      statusColor: project.statusColor || 'gray'
    };
  }

  /**
   * 获取状态颜色类
   * @param {string} color - 颜色名称
   * @returns {string} Tailwind CSS 颜色类
   */
  getStatusColorClass(color) {
    const colorMap = {
      'indigo': 'text-indigo-400',
      'purple': 'text-purple-400',
      'blue': 'text-blue-400',
      'green': 'text-green-400',
      'orange': 'text-orange-400',
      'red': 'text-red-400',
      'gray': 'text-gray-400'
    };
    return colorMap[color] || 'text-gray-400';
  }

  /**
   * 获取渐变背景类
   * @param {string} color - 颜色名称
   * @returns {string} Tailwind CSS 渐变类
   */
  getGradientClass(color) {
    const gradientMap = {
      'indigo': 'from-indigo-900 to-purple-800',
      'purple': 'from-purple-900 to-pink-800',
      'blue': 'from-blue-900 to-cyan-800',
      'green': 'from-green-900 to-emerald-800',
      'orange': 'from-orange-900 to-red-800',
      'red': 'from-red-900 to-pink-800',
      'gray': 'from-gray-800 to-gray-900'
    };
    return gradientMap[color] || 'from-gray-800 to-gray-900';
  }

  /**
   * 添加事件监听器
   * Requirement 4.2: 点击卡片导航到详情页
   */
  attachEventListeners() {
    if (!this.container) return;

    // 为每个项目卡片添加点击事件
    const projectCards = this.container.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const projectId = card.dataset.projectId;
      const detailPage = card.dataset.detailPage;
      const liveUrl = card.dataset.liveUrl;

      // "立即体验"按钮点击事件
      const liveDemoBtn = card.querySelector('.btn-live-demo');
      if (liveDemoBtn && liveUrl) {
        liveDemoBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // 阻止事件冒泡
          console.log(`[ProjectShowcase] 打开实时演示: ${liveUrl}`);
          window.open(liveUrl, '_blank');
        });
      }

      // "查看详情"按钮点击事件
      const viewDetailsBtn = card.querySelector('.btn-view-details');
      if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // 阻止事件冒泡
          this.navigateToDetail(projectId, detailPage);
        });
      }

      // 卡片整体点击事件（导航到详情页）
      card.addEventListener('click', () => {
        this.navigateToDetail(projectId, detailPage);
      });

      // 添加键盘可访问性
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `查看 ${projectId} 项目详情`);
      
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateToDetail(projectId, detailPage);
        }
      });

      // 鼠标聚光灯效果：追踪鼠标位置
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });

      // 鼠标离开时重置位置
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });

    console.log(`[ProjectShowcase] 已为 ${projectCards.length} 个项目卡片添加事件监听器`);
  }

  /**
   * 导航到项目详情页
   * Requirement 4.2: 点击卡片导航到详情页
   * @param {string} projectId - 项目 ID
   * @param {string} detailPage - 详情页 URL
   */
  navigateToDetail(projectId, detailPage) {
    console.log(`[ProjectShowcase] 导航到项目详情: ${projectId} -> ${detailPage}`);
    
    if (detailPage && detailPage !== '#') {
      window.location.href = detailPage;
    } else {
      console.warn(`[ProjectShowcase] 项目 ${projectId} 没有有效的详情页链接`);
      // 可以显示一个提示消息
      if (typeof showSuccess === 'function') {
        showSuccess('该项目详情页即将推出');
      }
    }
  }

  /**
   * 过滤项目（可选功能）
   * @param {Function} filterFn - 过滤函数
   */
  filterProjects(filterFn) {
    const filteredProjects = this.projects.filter(filterFn);
    const originalProjects = this.projects;
    this.projects = filteredProjects;
    this.render();
    this.projects = originalProjects; // 恢复原始数据
  }

  /**
   * 仅显示精选项目
   */
  showFeaturedOnly() {
    this.filterProjects(project => project.featured === true);
  }

  /**
   * 重新加载项目数据
   */
  async reload() {
    // 清除缓存
    dataLoader.clearCache();
    // 重新加载
    await this.loadProjects();
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.ProjectShowcase = ProjectShowcase;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProjectShowcase };
}
