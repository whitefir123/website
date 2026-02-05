/**
 * JournalSystem - 日志系统组件
 * 负责加载、渲染和过滤日志条目
 * 
 * Feature: personal-website-redesign
 * Requirements: 6.1, 6.2, 6.5, 6.6
 */

class JournalSystem {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   * @param {string} dataUrl - 日志数据 JSON 文件的 URL
   */
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.entries = [];
    this.filteredEntries = [];
    this.currentTag = null;
    
    if (!this.container) {
      console.error(`[JournalSystem] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 加载日志条目
   * Requirements: 6.1, 6.6
   */
  async loadEntries() {
    try {
      console.log('[JournalSystem] 正在加载日志数据...');
      
      // 使用 DataLoader 加载数据
      const data = await dataLoader.fetchJSON(this.dataUrl);
      
      // 验证数据结构
      if (!data || !Array.isArray(data.entries)) {
        console.warn('[JournalSystem] 数据格式无效，使用空数组');
        this.entries = [];
      } else {
        // Requirement 6.1: 按日期降序排序（最新的在前）
        this.entries = this.sortEntriesByDate(data.entries);
        console.log(`[JournalSystem] 成功加载 ${this.entries.length} 条日志`);
      }
      
      // 初始化时显示所有条目
      this.filteredEntries = this.entries;
      
      // 渲染日志列表
      this.render();
      
    } catch (error) {
      console.error('[JournalSystem] 加载日志失败:', error);
      this.entries = [];
      this.filteredEntries = [];
      this.render();
    }
  }

  /**
   * 按日期排序日志条目（降序）
   * Requirement 6.1: 日志条目按日期排序（最新的在前）
   * @param {Array} entries - 日志条目数组
   * @returns {Array} 排序后的日志条目数组
   */
  sortEntriesByDate(entries) {
    return [...entries].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // 降序排序
    });
  }

  /**
   * 渲染日志系统
   * Requirements: 6.1, 6.5, 6.6
   */
  render() {
    if (!this.container) {
      console.error('[JournalSystem] 容器不存在，无法渲染');
      return;
    }

    // 清空容器
    this.container.innerHTML = '';

    // 创建日志系统结构
    const journalHTML = `
      <div class="journal-system">
        <!-- 标签过滤器 -->
        <div class="tag-filter-section mb-8">
          ${this.renderTagFilter()}
        </div>
        
        <!-- 日志条目列表 -->
        <div class="journal-entries-list">
          ${this.renderEntriesList()}
        </div>
      </div>
    `;

    this.container.innerHTML = journalHTML;

    // 添加事件监听器
    this.attachEventListeners();
  }

  /**
   * 渲染标签过滤器
   * Requirement 6.5: 支持按标签过滤条目
   */
  renderTagFilter() {
    const allTags = this.getAllTags();
    
    if (allTags.length === 0) {
      return '<p class="text-gray-400 text-center text-sm">暂无标签</p>';
    }

    let filterHTML = `
      <div class="glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold tracking-tighter mb-4">
          <i class="fas fa-filter mr-2 text-purple-400"></i>
          按标签筛选
        </h3>
        <div class="flex flex-wrap gap-3">
          <!-- "全部"按钮 -->
          <button class="tag-filter-btn ${!this.currentTag ? 'active' : ''}" 
                  data-tag="all"
                  aria-label="显示全部日志">
            <i class="fas fa-list mr-2"></i>
            全部 (${this.entries.length})
          </button>
    `;

    // 为每个标签创建过滤按钮
    allTags.forEach(tag => {
      const count = this.getEntriesCountByTag(tag);
      const isActive = this.currentTag === tag;
      
      filterHTML += `
        <button class="tag-filter-btn ${isActive ? 'active' : ''}" 
                data-tag="${tag}"
                aria-label="筛选标签: ${tag}">
          <i class="fas fa-tag mr-2"></i>
          ${tag} (${count})
        </button>
      `;
    });

    filterHTML += `
        </div>
      </div>
    `;

    return filterHTML;
  }

  /**
   * 渲染日志条目列表
   * Requirement 6.6: 显示标题、摘要、日期和阅读时间
   */
  renderEntriesList() {
    if (this.filteredEntries.length === 0) {
      return `
        <div class="glass-card rounded-2xl p-12 text-center">
          <i class="fas fa-book-open text-6xl text-white/10 mb-4"></i>
          <p class="text-white/50 text-lg">
            ${this.currentTag ? `没有找到标签为 "${this.currentTag}" 的日志` : '暂无日志条目'}
          </p>
        </div>
      `;
    }

    let entriesHTML = '<div class="space-y-6">';

    this.filteredEntries.forEach(entry => {
      entriesHTML += this.renderEntryCard(entry);
    });

    entriesHTML += '</div>';

    return entriesHTML;
  }

  /**
   * 渲染单个日志条目卡片
   * Requirements: 6.6, 6.7, 6.8, 6.9, 6.10 - 极简排版美化
   * @param {Object} entry - 日志条目对象
   */
  renderEntryCard(entry) {
    // 验证条目数据
    const validatedEntry = this.validateEntryData(entry);
    
    // 格式化日期
    const formattedDate = this.formatDate(validatedEntry.date);
    
    // 生成标签 HTML
    const tagsHTML = this.renderEntryTags(validatedEntry.tags);
    
    // Requirement 6.9, 6.10: 无边框设计，仅底部细线，悬浮时才显示玻璃背景
    return `
      <article class="journal-entry-card group border-b border-white/5 pb-8 mb-8 cursor-pointer
                      transition-all duration-300
                      hover:bg-white/5 hover:backdrop-blur-md
                      hover:px-6 hover:py-4 hover:rounded-xl
                      hover:-mx-6 hover:-my-4 hover:mb-4
                      animate-on-scroll"
               data-entry-id="${validatedEntry.id}"
               data-detail-page="${validatedEntry.detailPage}"
               role="button"
               tabindex="0"
               aria-label="阅读日志: ${validatedEntry.title}">
        
        <!-- 标题 -->
        <h2 class="text-2xl font-bold tracking-tighter mb-3 group-hover:text-purple-400 transition-colors">
          ${validatedEntry.title}
        </h2>
        
        <!-- 日期和阅读时间 -->
        <!-- Requirement 6.7: 元数据使用小号全大写字体，增加字间距 -->
        <div class="flex items-center gap-4 mb-4 text-xs uppercase tracking-wider text-white/50">
          <time datetime="${validatedEntry.date}">
            ${formattedDate}
          </time>
          <span>${validatedEntry.readTime} min read</span>
        </div>
        
        <!-- 摘要 -->
        <p class="text-white/70 leading-relaxed mb-4">
          ${validatedEntry.excerpt}
        </p>
        
        <!-- 标签 -->
        ${tagsHTML ? `
          <div class="flex flex-wrap gap-2">
            ${tagsHTML}
          </div>
        ` : ''}
      </article>
    `;
  }

  /**
   * 渲染日志条目的标签
   * Requirement 6.8: 透明背景+细边框，悬浮时背景变白、文字变黑
   * @param {Array} tags - 标签数组
   * @returns {string} 标签 HTML
   */
  renderEntryTags(tags) {
    if (!Array.isArray(tags) || tags.length === 0) {
      return '';
    }

    return tags.map(tag => `
      <span class="journal-tag 
                   px-3 py-1 rounded-full
                   bg-transparent border border-white/20
                   text-sm text-white/70
                   transition-all duration-300
                   hover:bg-white hover:text-black hover:border-white
                   cursor-pointer">
        ${tag}
      </span>
    `).join('');
  }

  /**
   * 验证日志条目数据并提供默认值
   * @param {Object} entry - 原始日志条目数据
   * @returns {Object} 验证后的日志条目数据
   */
  validateEntryData(entry) {
    return {
      id: entry.id || 'unknown',
      title: entry.title || '未命名日志',
      date: entry.date || new Date().toISOString().split('T')[0],
      excerpt: entry.excerpt || '暂无摘要',
      content: entry.content || '',
      tags: entry.tags || [],
      readTime: entry.readTime || 5,
      detailPage: entry.detailPage || '#'
    };
  }

  /**
   * 添加事件监听器
   * Requirements: 6.2, 6.5
   */
  attachEventListeners() {
    if (!this.container) return;

    // 标签过滤按钮点击事件 (Requirement 6.5)
    const tagButtons = this.container.querySelectorAll('.tag-filter-btn');
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        if (tag === 'all') {
          this.clearFilter();
        } else {
          this.filterByTag(tag);
        }
      });
    });

    // 日志条目卡片点击事件 (Requirement 6.2)
    const entryCards = this.container.querySelectorAll('.journal-entry-card');
    entryCards.forEach(card => {
      const entryId = card.dataset.entryId;
      const detailPage = card.dataset.detailPage;

      // 点击事件
      card.addEventListener('click', () => {
        this.navigateToEntry(entryId, detailPage);
      });

      // 键盘可访问性
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateToEntry(entryId, detailPage);
        }
      });
    });

    console.log(`[JournalSystem] 已为 ${entryCards.length} 个日志条目添加事件监听器`);
  }

  /**
   * 按标签过滤日志条目
   * Requirement 6.5: 支持按标签过滤条目
   * @param {string} tag - 标签名称
   */
  filterByTag(tag) {
    console.log(`[JournalSystem] 按标签过滤: ${tag}`);
    
    this.currentTag = tag;
    this.filteredEntries = this.entries.filter(entry => 
      entry.tags && entry.tags.includes(tag)
    );
    
    // 重新渲染
    this.render();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * 清除过滤器，显示所有条目
   */
  clearFilter() {
    console.log('[JournalSystem] 清除过滤器，显示全部');
    
    this.currentTag = null;
    this.filteredEntries = this.entries;
    
    // 重新渲染
    this.render();
  }

  /**
   * 导航到日志详情页
   * Requirement 6.2: 点击预览卡片导航到详情页
   * @param {string} entryId - 日志条目 ID
   * @param {string} detailPage - 详情页 URL
   */
  navigateToEntry(entryId, detailPage) {
    console.log(`[JournalSystem] 导航到日志详情: ${entryId} -> ${detailPage}`);
    
    if (detailPage && detailPage !== '#') {
      window.location.href = detailPage;
    } else {
      console.warn(`[JournalSystem] 日志 ${entryId} 没有有效的详情页链接`);
      // 显示提示消息
      if (typeof showSuccess === 'function') {
        showSuccess('该日志详情页即将推出');
      }
    }
  }

  /**
   * 获取所有唯一标签
   * @returns {Array} 标签数组
   */
  getAllTags() {
    const tagsSet = new Set();
    
    this.entries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet).sort();
  }

  /**
   * 获取指定标签的日志条目数量
   * @param {string} tag - 标签名称
   * @returns {number} 条目数量
   */
  getEntriesCountByTag(tag) {
    return this.entries.filter(entry => 
      entry.tags && entry.tags.includes(tag)
    ).length;
  }

  /**
   * 格式化日期
   * @param {string} dateString - ISO 日期字符串
   * @returns {string} 格式化的日期字符串
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year} 年 ${month} 月 ${day} 日`;
  }

  /**
   * 重新加载数据
   */
  async reload() {
    // 清除缓存
    dataLoader.clearCache();
    // 重新加载
    await this.loadEntries();
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.JournalSystem = JournalSystem;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JournalSystem };
}
