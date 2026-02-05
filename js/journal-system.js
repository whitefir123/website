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
    this.currentMood = null; // 提示词 3: 当前选中的心情过滤
    this.searchBox = null; // SearchBox 组件实例
    
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
      await this.render();
      
      // Task 2.9: 初始化 SearchBox 组件
      this.initializeSearchBox();
      
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
   * Task 2.9: 添加搜索框容器
   */
  async render() {
    if (!this.container) {
      console.error('[JournalSystem] 容器不存在，无法渲染');
      return;
    }

    // 清空容器
    this.container.innerHTML = '';

    // 渲染日志列表（异步）
    const entriesListHTML = await this.renderEntriesList();

    // 创建日志系统结构
    // Task 2.9: 在标签过滤器上方添加搜索框容器
    const journalHTML = `
      <div class="journal-system">
        <!-- Task 2.9: 搜索框容器 -->
        <div id="journal-search-box" class="mb-6"></div>
        
        <!-- 标签过滤器 -->
        <div class="tag-filter-section mb-8">
          ${await this.renderTagFilter()}
        </div>
        
        <!-- 日志条目列表 -->
        <div class="journal-entries-list">
          ${entriesListHTML}
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
   * 提示词 3: 增加心情过滤功能
   */
  async renderTagFilter() {
    const allTags = this.getAllTags();
    
    // 提示词 3: 加载心情类型数据
    let moodTypes = {};
    try {
      const moodData = await dataLoader.fetchJSON('/data/moods.json');
      moodTypes = moodData.moodTypes || {};
    } catch (error) {
      console.warn('[JournalSystem] 无法加载心情类型数据:', error);
    }
    
    let filterHTML = `
      <div class="glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold tracking-tighter mb-4">
          <i class="fas fa-filter mr-2 text-purple-400"></i>
          筛选日志
        </h3>
        
        <!-- 提示词 3: 心情过滤区域 -->
        ${Object.keys(moodTypes).length > 0 ? `
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">按心情筛选</h4>
          <div class="flex flex-wrap gap-2">
            ${Object.entries(moodTypes).map(([key, moodType]) => `
              <button class="mood-filter-btn ${this.currentMood === key ? 'active' : ''} px-3 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      data-mood="${key}"
                      style="--mood-color: ${moodType.color};"
                      aria-label="筛选心情: ${moodType.label}">
                <span class="mr-2">${moodType.icon}</span>
                <span>${moodType.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- 标签过滤区域 -->
        ${allTags.length > 0 ? `
        <div>
          <h4 class="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">按标签筛选</h4>
          <div class="flex flex-wrap gap-3">
            <!-- "全部"按钮 -->
            <button class="tag-filter-btn ${!this.currentTag && !this.currentMood ? 'active' : ''}" 
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
        ` : '<p class="text-gray-400 text-center text-sm">暂无标签</p>'}
      </div>
    `;

    return filterHTML;
  }

  /**
   * 渲染日志条目列表
   * Requirements: 6.1, 6.6
   * 提示词 3: 空状态美化 - 支持心情过滤的空状态
   * @returns {Promise<string>} 日志列表 HTML
   */
  async renderEntriesList() {
    // 如果没有条目，显示空状态
    if (this.filteredEntries.length === 0) {
      // 提示词 3: 空状态美化
      const emptyMessage = this.currentMood 
        ? `没有找到心情为该类型的日志` 
        : this.currentTag 
          ? `没有找到标签为 "${this.currentTag}" 的日志` 
          : '暂无日志条目';
      
      return `
        <div class="empty-state glass-card rounded-2xl">
          <div class="empty-state-icon">
            <i class="fas fa-${this.currentMood || this.currentTag ? 'search' : 'book-open'}"></i>
          </div>
          <h3 class="empty-state-title">${emptyMessage}</h3>
          <p class="empty-state-description">
            ${this.currentMood || this.currentTag 
              ? '尝试选择其他筛选条件，或点击"全部"查看所有日志。' 
              : '开始记录你的第一篇日志吧！'}
          </p>
        </div>
      `;
    }

    let entriesHTML = '<div class="space-y-6">';

    // 使用 Promise.all 并行渲染所有卡片
    const cardPromises = this.filteredEntries.map(entry => this.renderEntryCard(entry));
    const cards = await Promise.all(cardPromises);
    
    entriesHTML += cards.join('');
    entriesHTML += '</div>';

    return entriesHTML;
  }

  /**
   * 渲染单个日志条目卡片
   * Requirements: 6.6, 6.7, 6.8, 6.9, 6.10 - 极简排版美化
   * @param {Object} entry - 日志条目对象
   */
  /**
   * 渲染单个日志条目卡片
   * Requirements: 6.6, 6.7, 6.8, 6.9, 6.10, 22.1, 22.2, 22.3, 22.4, 22.5
   * @param {Object} entry - 日志条目对象
   * @returns {string} 日志卡片 HTML
   */
  async renderEntryCard(entry) {
    // 验证条目数据
    const validatedEntry = this.validateEntryData(entry);
    
    // 格式化日期
    const formattedDate = this.formatDate(validatedEntry.date);
    
    // 生成标签 HTML
    const tagsHTML = this.renderEntryTags(validatedEntry.tags);
    
    // Requirement 22.1, 22.2, 22.3: 获取当日心情颜色
    const moodColor = await this.getMoodColorForDate(validatedEntry.date);
    
    // Requirement 6.9, 6.10: 无边框设计，仅底部细线，悬浮时才显示玻璃背景
    // Requirement 22.1: 左侧 2px 竖线显示心情颜色
    return `
      <article class="journal-entry-card group border-b border-white/5 pb-8 mb-8 cursor-pointer
                      transition-all duration-300
                      hover:bg-white/5 hover:backdrop-blur-md
                      hover:px-6 hover:py-4 hover:rounded-xl
                      hover:-mx-6 hover:-my-4 hover:mb-4
                      animate-on-scroll
                      relative pl-6"
               data-entry-id="${validatedEntry.id}"
               data-detail-page="${validatedEntry.detailPage}"
               role="button"
               tabindex="0"
               aria-label="阅读日志: ${validatedEntry.title}"
               style="border-left: 2px solid ${moodColor};">
        
        <!-- Requirement 22.4, 22.5: 心情色标微妙发光效果 -->
        <div class="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
             style="background: ${moodColor}; box-shadow: 0 0 8px ${moodColor}40;"></div>
        
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
   * 获取指定日期的心情颜色
   * Requirements: 22.2, 22.3
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   * @returns {Promise<string>} 心情颜色（十六进制）
   */
  async getMoodColorForDate(date) {
    try {
      // 加载心情数据
      const moodData = await dataLoader.fetchJSON('/data/moods.json');
      
      if (!moodData || !moodData.moods) {
        // Requirement 22.3: 无心情数据时使用中性灰色
        return '#6b7280';
      }
      
      // 查找匹配日期的心情
      const mood = moodData.moods.find(m => m.date === date);
      
      // Requirement 22.2: 自动匹配心情颜色
      if (mood && mood.color) {
        return mood.color;
      }
      
      // Requirement 22.3: 默认中性灰色
      return '#6b7280';
      
    } catch (error) {
      console.warn('[JournalSystem] 无法加载心情数据:', error);
      return '#6b7280';
    }
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
   * 提示词 3: 增加心情过滤按钮事件
   */
  attachEventListeners() {
    if (!this.container) return;

    // 提示词 3: 心情过滤按钮点击事件
    const moodButtons = this.container.querySelectorAll('.mood-filter-btn');
    moodButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        this.filterByMood(mood);
      });
    });

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
   * Task 2.9: 初始化 SearchBox 组件
   * Requirements: 3.1, 3.2, 3.3, 3.4
   */
  initializeSearchBox() {
    // 检查 SearchBox 类是否可用
    if (typeof SearchBox === 'undefined') {
      console.warn('[JournalSystem] SearchBox 类未定义，跳过搜索功能初始化');
      return;
    }

    // 创建 SearchBox 实例
    this.searchBox = new SearchBox('journal-search-box', (filteredResults) => {
      this.handleSearchResults(filteredResults);
    });

    // 设置所有日志条目数据
    this.searchBox.setEntries(this.entries);

    // 渲染搜索框
    this.searchBox.render();

    console.log('[JournalSystem] SearchBox 组件已初始化');
  }

  /**
   * Task 2.9: 处理搜索结果
   * Requirements: 3.2, 3.3
   * @param {Array} filteredResults - 搜索过滤后的日志条目数组
   */
  async handleSearchResults(filteredResults) {
    console.log(`[JournalSystem] 搜索结果: ${filteredResults.length} 条`);

    // 更新过滤后的条目
    this.filteredEntries = filteredResults;

    // 重新渲染日志列表
    const entriesListHTML = await this.renderEntriesList();
    const listContainer = this.container.querySelector('.journal-entries-list');
    
    if (listContainer) {
      listContainer.innerHTML = entriesListHTML;
      
      // 重新添加卡片点击事件
      const entryCards = listContainer.querySelectorAll('.journal-entry-card');
      entryCards.forEach(card => {
        const entryId = card.dataset.entryId;
        const detailPage = card.dataset.detailPage;

        card.addEventListener('click', () => {
          this.navigateToEntry(entryId, detailPage);
        });

        card.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.navigateToEntry(entryId, detailPage);
          }
        });
      });
    }
  }

  /**
   * 按标签过滤日志条目
   * Requirement 6.5: 支持按标签过滤条目
   * @param {string} tag - 标签名称
   */
  async filterByTag(tag) {
    console.log(`[JournalSystem] 按标签过滤: ${tag}`);
    
    this.currentTag = tag;
    this.currentMood = null; // 清除心情过滤
    this.filteredEntries = this.entries.filter(entry => 
      entry.tags && entry.tags.includes(tag)
    );
    
    // 重新渲染
    await this.render();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * 按心情过滤日志条目
   * 提示词 3: 多维过滤 - 根据日期匹配心情数据
   * @param {string} mood - 心情类型键
   */
  async filterByMood(mood) {
    console.log(`[JournalSystem] 按心情过滤: ${mood}`);
    
    this.currentMood = mood;
    this.currentTag = null; // 清除标签过滤
    
    try {
      // 加载心情数据
      const moodData = await dataLoader.fetchJSON('/data/moods.json');
      
      if (!moodData || !moodData.moods) {
        console.warn('[JournalSystem] 心情数据无效');
        this.filteredEntries = [];
        this.render();
        return;
      }
      
      // 获取所有匹配该心情的日期
      const moodDates = moodData.moods
        .filter(m => m.mood === mood)
        .map(m => m.date);
      
      // 过滤出这些日期的日志
      this.filteredEntries = this.entries.filter(entry => 
        moodDates.includes(entry.date)
      );
      
      console.log(`[JournalSystem] 找到 ${this.filteredEntries.length} 条匹配心情 "${mood}" 的日志`);
      
    } catch (error) {
      console.error('[JournalSystem] 按心情过滤失败:', error);
      this.filteredEntries = [];
    }
    
    // 重新渲染
    await this.render();
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * 清除过滤器，显示所有条目
   * 提示词 3: 同时清除标签和心情过滤
   */
  async clearFilter() {
    console.log('[JournalSystem] 清除过滤器，显示全部');
    
    this.currentTag = null;
    this.currentMood = null;
    this.filteredEntries = this.entries;
    
    // 重新渲染
    await this.render();
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
