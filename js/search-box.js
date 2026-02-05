/**
 * SearchBox - 日志搜索框组件
 * 提供实时模糊搜索功能，支持防抖优化
 * 
 * Feature: mood-journal-enhancement
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

class SearchBox {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   * @param {Function} onSearch - 搜索回调函数，接收过滤后的结果数组
   */
  constructor(containerId, onSearch) {
    this.container = document.getElementById(containerId);
    this.onSearch = onSearch;
    this.allEntries = [];
    this.debounceTimer = null;
    this.debounceDelay = 300; // 300ms 防抖延迟
    
    if (!this.container) {
      console.error(`[SearchBox] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 渲染搜索框
   * Requirement 3.1: 在标签过滤器上方添加搜索输入框
   */
  render() {
    if (!this.container) {
      console.error('[SearchBox] 容器不存在，无法渲染');
      return;
    }

    // 玻璃拟态风格搜索框
    const searchBoxHTML = `
      <div class="search-box glass-card rounded-xl p-4 mb-6 transition-all duration-300 hover:border-white/30">
        <div class="flex items-center gap-3">
          <!-- 搜索图标 -->
          <i class="fas fa-search text-white/50 transition-colors duration-300"></i>
          
          <!-- 搜索输入框 -->
          <input type="text" 
                 id="journal-search-input"
                 placeholder="搜索日志标题或摘要..." 
                 class="flex-1 bg-transparent outline-none text-white placeholder-white/40 transition-all duration-300"
                 aria-label="搜索日志"
                 autocomplete="off" />
          
          <!-- 清空按钮 -->
          <button id="clear-search-btn" 
                  class="clear-search hidden text-white/50 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label="清空搜索">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = searchBoxHTML;

    // 添加事件监听器
    this.attachEventListeners();

    console.log('[SearchBox] 搜索框渲染完成');
  }

  /**
   * 添加事件监听器
   * Requirement 3.2: 实时模糊搜索
   */
  attachEventListeners() {
    const searchInput = document.getElementById('journal-search-input');
    const clearBtn = document.getElementById('clear-search-btn');

    if (!searchInput || !clearBtn) {
      console.error('[SearchBox] 找不到搜索输入框或清空按钮');
      return;
    }

    // 搜索输入事件（带防抖）
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      
      // 显示或隐藏清空按钮
      if (query.trim()) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }

      // 防抖搜索
      this.debouncedSearch(query);
    });

    // 清空按钮点击事件
    clearBtn.addEventListener('click', () => {
      this.clear();
    });

    // 键盘快捷键：Esc 清空搜索
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clear();
      }
    });

    console.log('[SearchBox] 事件监听器已添加');
  }

  /**
   * 防抖搜索
   * Requirement 3.2: 对搜索输入进行防抖处理（300ms 延迟）
   * @param {string} query - 搜索查询
   */
  debouncedSearch(query) {
    // 清除之前的定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // 设置新的定时器
    this.debounceTimer = setTimeout(() => {
      this.handleSearch(query);
    }, this.debounceDelay);
  }

  /**
   * 处理搜索逻辑
   * Requirements: 3.2, 3.3, 3.4
   * @param {string} query - 搜索查询
   */
  handleSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    console.log(`[SearchBox] 执行搜索: "${normalizedQuery}"`);

    // Requirement 3.4: 空查询显示所有条目
    if (!normalizedQuery) {
      this.onSearch(this.allEntries);
      return;
    }

    // Requirement 3.2, 3.3: 模糊搜索标题和摘要
    const results = this.allEntries.filter(entry => {
      const titleMatch = entry.title.toLowerCase().includes(normalizedQuery);
      const excerptMatch = entry.excerpt.toLowerCase().includes(normalizedQuery);
      return titleMatch || excerptMatch;
    });

    console.log(`[SearchBox] 找到 ${results.length} 条匹配结果`);

    // 触发搜索回调
    this.onSearch(results);
  }

  /**
   * 清空搜索
   * Requirement 3.4: 清空搜索框并显示所有条目
   */
  clear() {
    const searchInput = document.getElementById('journal-search-input');
    const clearBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }

    if (clearBtn) {
      clearBtn.classList.add('hidden');
    }

    console.log('[SearchBox] 搜索已清空');

    // 显示所有条目
    this.onSearch(this.allEntries);
  }

  /**
   * 设置所有条目数据
   * @param {Array} entries - 日志条目数组
   */
  setEntries(entries) {
    this.allEntries = entries || [];
    console.log(`[SearchBox] 已设置 ${this.allEntries.length} 条日志数据`);
  }

  /**
   * 获取当前搜索查询
   * @returns {string} 当前搜索查询
   */
  getCurrentQuery() {
    const searchInput = document.getElementById('journal-search-input');
    return searchInput ? searchInput.value : '';
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.SearchBox = SearchBox;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SearchBox };
}
