/**
 * MoodCalendar - 心情日历组件
 * 负责渲染月度日历并显示每日心情指示器
 * 
 * Feature: personal-website-redesign
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */

class MoodCalendar {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   * @param {string} dataUrl - 心情数据 JSON 文件的 URL
   */
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.currentMonth = new Date();
    this.moods = [];
    this.moodTypes = {};
    this.emotionStatistics = null; // EmotionStatistics 组件实例
    
    // Feature: journal-editor-enhancement, Requirements: 11.3, 11.4, 11.5
    // 心情过滤状态
    this.activeFilter = null; // 当前激活的过滤心情类型
    this.moodFilterController = null; // MoodFilterController 实例引用
    
    if (!this.container) {
      console.error(`[MoodCalendar] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 加载心情数据
   * Requirements: 5.2, 5.5
   * Feature: mood-journal-enhancement
   * Requirements: 3.8 - 初始化 EmotionStatistics 组件
   */
  async loadMoods() {
    try {
      console.log('[MoodCalendar] 正在加载心情数据...');
      
      // 使用 DataLoader 加载数据
      const data = await dataLoader.fetchJSON(this.dataUrl);
      
      // 验证数据结构
      if (!data) {
        console.warn('[MoodCalendar] 数据格式无效');
        this.moods = [];
        this.moodTypes = {};
      } else {
        this.moods = data.moods || [];
        this.moodTypes = data.moodTypes || {};
        console.log(`[MoodCalendar] 成功加载 ${this.moods.length} 条心情记录`);
      }
      
      // 渲染日历
      this.render();
      
      // Feature: mood-journal-enhancement
      // Requirements: 3.8 - 初始化 EmotionStatistics 组件
      this.initEmotionStatistics();
      
    } catch (error) {
      console.error('[MoodCalendar] 加载心情数据失败:', error);
      this.moods = [];
      this.moodTypes = {};
      this.render();
    }
  }

  /**
   * 渲染日历
   * Requirements: 5.1, 5.6
   * 提示词 3: 跨数据关联 - 显示日志图标
   */
  async render() {
    if (!this.container) {
      console.error('[MoodCalendar] 容器不存在，无法渲染');
      return;
    }

    // 清空容器
    this.container.innerHTML = '';

    // 创建日历结构
    const calendarHTML = `
      <div class="mood-calendar">
        <!-- 日历头部：月份导航 -->
        <div class="calendar-header flex justify-between items-center mb-8">
          <button id="prev-month" class="nav-btn glass-card px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300" aria-label="上个月">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2 id="current-month" class="text-2xl md:text-3xl font-bold tracking-tighter">
            ${this.getMonthYearString()}
          </h2>
          <button id="next-month" class="nav-btn glass-card px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300" aria-label="下个月">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <!-- Feature: journal-editor-enhancement, Requirements: 11.5 - 清除过滤按钮 -->
        <div id="filter-indicator" class="filter-indicator hidden mb-4 p-3 rounded-lg glass-card flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-filter text-purple-400"></i>
            <span class="text-sm text-white/80">正在过滤：<span id="filter-mood-label" class="font-bold"></span></span>
          </div>
          <button id="clear-filter-btn" class="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-sm font-medium">
            <i class="fas fa-times mr-1"></i>
            清除过滤
          </button>
        </div>
        
        <!-- 日历网格 -->
        <div class="calendar-grid-container glass-card rounded-2xl p-6">
          ${this.renderCalendarGrid()}
        </div>
        
        <!-- 心情图例 -->
        <div class="mood-legend mt-8">
          ${this.renderMoodLegend()}
        </div>
      </div>
    `;

    this.container.innerHTML = calendarHTML;

    // 添加事件监听器
    this.attachEventListeners();
    
    // 提示词 3: 跨数据关联 - 为有日志的日期添加图标
    await this.addJournalIndicators();
  }

  /**
   * 渲染日历网格
   * Requirements: 5.1 - 显示月度日历网格
   */
  renderCalendarGrid() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月天数
    const daysInMonth = lastDay.getDate();
    
    // 获取当月第一天是星期几 (0 = 周日, 1 = 周一, ...)
    const firstDayOfWeek = firstDay.getDay();
    
    // 构建日历网格 HTML
    let gridHTML = '<div class="grid grid-cols-7 gap-2">';
    
    // 添加星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
      gridHTML += `
        <div class="text-center text-sm font-bold text-white/50 py-2">
          ${day}
        </div>
      `;
    });
    
    // 添加空白单元格（月初之前的日期）
    for (let i = 0; i < firstDayOfWeek; i++) {
      gridHTML += '<div class="calendar-day-empty"></div>';
    }
    
    // 添加当月的每一天
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = this.formatDate(year, month, day);
      const mood = this.getMoodForDate(dateString);
      gridHTML += this.renderDay(day, dateString, mood);
    }
    
    gridHTML += '</div>';
    
    return gridHTML;
  }

  /**
   * 渲染单个日期单元格
   * Requirements: 5.1, 5.2, 5.3, 5.8
   * @param {number} day - 日期数字
   * @param {string} dateString - 格式化的日期字符串 (YYYY-MM-DD)
   * @param {Object|null} mood - 心情数据对象
   */
  renderDay(day, dateString, mood) {
    const today = new Date();
    const isToday = dateString === this.formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Requirement 5.8: 极其微妙的背景色，移除厚重边框
    let dayClasses = 'calendar-day relative aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-300 cursor-pointer';
    
    // 基础背景色 - 极其微妙
    dayClasses += ' bg-white/[0.02]';
    
    // Hover 效果
    dayClasses += ' hover:bg-white/[0.05] hover:scale-105';
    
    // 如果是今天，添加特殊样式
    if (isToday) {
      dayClasses += ' ring-1 ring-purple-500/50';
    }
    
    // Requirement 5.2: 如果有心情记录，添加扩散光圈
    let glowStyle = '';
    if (mood) {
      const moodType = this.moodTypes[mood.mood];
      const color = mood.color || (moodType ? moodType.color : '#6b7280');
      // 扩散光圈效果
      glowStyle = `box-shadow: 0 0 20px ${color}40;`;
    }
    
    // 构建日期单元格 HTML
    let dayHTML = `
      <div class="${dayClasses}" 
           style="${glowStyle}"
           data-date="${dateString}"
           ${mood ? `data-mood="${mood.mood}"` : ''}
           ${mood ? `data-note="${this.escapeHtml(mood.note || '')}"` : ''}
           role="button"
           tabindex="0"
           aria-label="${dateString}${mood ? ` - ${this.moodTypes[mood.mood]?.label || mood.mood}` : ''}">
        
        <!-- 日期数字 -->
        <div class="text-center text-sm font-medium ${isToday ? 'text-purple-400' : 'text-white/60'}">
          ${day}
        </div>
        
        <!-- 心情指示器 (Requirement 5.2) -->
        ${mood ? this.renderMoodIndicator(mood) : ''}
      </div>
    `;
    
    return dayHTML;
  }

  /**
   * 渲染心情指示器
   * 提示词 2: 移除 Emoji，改用彩色毛玻璃光点
   * @param {Object} mood - 心情数据对象
   */
  renderMoodIndicator(mood) {
    const moodType = this.moodTypes[mood.mood];
    const color = mood.color || (moodType ? moodType.color : '#6b7280');
    
    // 提示词 2：使用不同颜色的毛玻璃光点（Blurred Orbs）
    // 根据心情类型使用不同的渐变色
    let gradientColors = this.getMoodGradient(mood.mood);
    
    return `
      <div class="mood-indicator mt-2 flex justify-center items-center">
        <div class="mood-dot-wrapper mt-2" style="--mood-color: ${color};">
          <div class="mood-dot" style="background: ${gradientColors}; color: ${color};"></div>
        </div>
      </div>
    `;
  }

  /**
   * 获取心情对应的渐变色
   * 提示词 2：不同心情使用不同的渐变色
   * @param {string} moodKey - 心情类型键
   * @returns {string} CSS 渐变色
   */
  getMoodGradient(moodKey) {
    const gradientMap = {
      'happy': 'linear-gradient(135deg, #10b981, #14b8a6)', // Emerald-to-Teal
      'excited': 'linear-gradient(135deg, #f59e0b, #ef4444)', // Amber-to-Red
      'calm': 'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Blue-to-Purple
      'tired': 'linear-gradient(135deg, #6366f1, #06b6d4)', // Indigo-to-Cyan (淡蓝渐变)
      'sad': 'linear-gradient(135deg, #6b7280, #9ca3af)', // Gray
      'anxious': 'linear-gradient(135deg, #f97316, #fb923c)', // Orange
      'productive': 'linear-gradient(135deg, #22c55e, #84cc16)', // Green-to-Lime
      'creative': 'linear-gradient(135deg, #a855f7, #ec4899)' // Purple-to-Pink
    };
    
    return gradientMap[moodKey] || 'linear-gradient(135deg, #6b7280, #9ca3af)';
  }

  /**
   * 渲染心情图例
   * Requirement 5.5: 使用不同颜色区分不同心情类型
   */
  renderMoodLegend() {
    if (Object.keys(this.moodTypes).length === 0) {
      return '<p class="text-gray-400 text-center text-sm">暂无心情类型数据</p>';
    }

    let legendHTML = `
      <div class="glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold tracking-tighter mb-4">心情图例</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    `;

    Object.entries(this.moodTypes).forEach(([key, moodType]) => {
      legendHTML += `
        <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
          <span class="text-2xl" style="filter: drop-shadow(0 0 8px ${moodType.color});">
            ${moodType.icon}
          </span>
          <div>
            <p class="text-sm font-bold">${moodType.label}</p>
            <p class="text-xs text-white/50">${key}</p>
          </div>
        </div>
      `;
    });

    legendHTML += `
        </div>
      </div>
    `;

    return legendHTML;
  }

  /**
   * 添加事件监听器
   * Requirements: 5.3, 5.4
   * Feature: mood-journal-enhancement
   * Requirements: 1.1 - 点击无记录日期显示心情记录对话框
   * Feature: journal-editor-enhancement
   * Requirements: 7.1, 7.2, 7.3, 7.4 - 双击快捷记录功能
   * Requirements: 11.5 - 清除过滤按钮事件
   */
  attachEventListeners() {
    // 上个月按钮
    const prevBtn = document.getElementById('prev-month');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateMonth(-1));
    }

    // 下个月按钮
    const nextBtn = document.getElementById('next-month');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateMonth(1));
    }

    // Feature: journal-editor-enhancement, Requirements: 11.5
    // 清除过滤按钮
    const clearFilterBtn = document.getElementById('clear-filter-btn');
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener('click', () => {
        console.log('[MoodCalendar] 点击清除过滤按钮');
        this.clearFilter();
      });
    }

    // 为每个日期单元格添加 hover 提示 (Requirement 5.3)
    const dayElements = this.container.querySelectorAll('.calendar-day[data-mood]');
    dayElements.forEach(dayEl => {
      // 鼠标悬停显示提示
      dayEl.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.currentTarget);
      });

      dayEl.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      // 键盘可访问性
      dayEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showTooltip(e.currentTarget);
        }
      });
    });

    // Feature: mood-journal-enhancement
    // Requirement 1.1: 点击无心情记录的日期显示心情记录对话框
    // Feature: journal-editor-enhancement
    // Requirements: 7.3 - 使用事件标志确保双击不触发单击事件
    const emptyDayElements = this.container.querySelectorAll('.calendar-day:not([data-mood])');
    emptyDayElements.forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        // 延迟执行单击事件，以便检测是否为双击
        dayEl._clickTimer = setTimeout(() => {
          const date = dayEl.dataset.date;
          if (date) {
            console.log('[MoodCalendar] 点击无记录日期:', date);
            this.showMoodRecordModal(date);
          }
        }, 250); // 250ms 延迟以检测双击
      });

      // 键盘可访问性
      dayEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const date = dayEl.dataset.date;
          if (date) {
            this.showMoodRecordModal(date);
          }
        }
      });
    });

    // Feature: journal-editor-enhancement
    // Requirements: 7.1, 7.2, 7.4 - 为所有日期单元格添加双击快捷记录功能
    const allDayElements = this.container.querySelectorAll('.calendar-day[data-date]');
    allDayElements.forEach(dayEl => {
      dayEl.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const date = dayEl.dataset.date;
        const hasMood = dayEl.dataset.mood;

        if (!date) return;

        // Requirement 7.4: 如果该日期已有心情记录，打开编辑弹窗
        if (hasMood) {
          console.log('[MoodCalendar] 双击已有记录日期，打开编辑弹窗:', date);
          this.showMoodRecordModal(date);
        } else {
          // Requirement 7.1, 7.2: 如无记录则自动创建 neutral 类型记录
          console.log('[MoodCalendar] 双击无记录日期，快捷记录 neutral 心情:', date);
          this.quickRecordNeutralMood(date);
        }

        // 清除单击事件的定时器
        const clickTimer = dayEl._clickTimer;
        if (clickTimer) {
          clearTimeout(clickTimer);
          dayEl._clickTimer = null;
        }
      });
    });
  }

  /**
   * 显示心情记录对话框
   * Feature: mood-journal-enhancement
   * Requirements: 1.1, 1.4 - 显示对话框并处理保存回调
   * Feature: journal-editor-enhancement
   * Requirements: 5.1 - 传递日历实例引用以触发保存动效
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   */
  showMoodRecordModal(date) {
    // 检查 MoodRecordModal 是否已加载
    if (typeof MoodRecordModal === 'undefined') {
      console.error('[MoodCalendar] MoodRecordModal 组件未加载');
      return;
    }

    // 创建对话框实例
    const modal = new MoodRecordModal({
      date: date,
      moodTypes: this.moodTypes,
      calendarInstance: this, // Feature: journal-editor-enhancement, Requirement 5.1
      onSave: (moodData) => {
        console.log('[MoodCalendar] 新心情记录:', moodData);
        console.log('[MoodCalendar] JSON 格式:', JSON.stringify(moodData, null, 2));
        
        // 将新心情记录添加到数据中
        this.moods.push(moodData);
        
        // 重新渲染日历以显示新记录
        this.render();
      },
      onClose: () => {
        console.log('[MoodCalendar] 心情记录对话框已关闭');
      }
    });

    // 显示对话框
    modal.show();
  }

  /**
   * 快捷记录 neutral 心情
   * Feature: journal-editor-enhancement
   * Requirements: 7.1, 7.2 - 双击无记录日期自动创建 neutral 类型记录并执行保存动效
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   */
  quickRecordNeutralMood(date) {
    if (!date) {
      console.warn('[MoodCalendar] 无法快捷记录：日期参数缺失');
      return;
    }

    // 检查 neutral 心情类型是否存在
    if (!this.moodTypes.neutral) {
      console.warn('[MoodCalendar] 无法快捷记录：neutral 心情类型不存在');
      // 如果 neutral 不存在，打开对话框让用户选择
      this.showMoodRecordModal(date);
      return;
    }

    console.log('[MoodCalendar] 快捷记录 neutral 心情，日期:', date);

    // 生成 neutral 心情记录数据
    const moodData = {
      date: date,
      mood: 'neutral',
      note: '',
      color: this.moodTypes.neutral.color,
      timestamp: Date.now()
    };

    console.log('[MoodCalendar] 生成的心情记录数据:', moodData);
    console.log('[MoodCalendar] JSON 格式:', JSON.stringify(moodData, null, 2));

    // 将新心情记录添加到数据中
    this.moods.push(moodData);

    // Requirement 7.2: 执行相同的保存动效
    this.triggerSaveAnimation(date);

    // 重新渲染日历以显示新记录
    // 延迟渲染以确保动画完成
    setTimeout(() => {
      this.render();
    }, 700); // 等待动画完成（600ms 动画 + 100ms 缓冲）
  }

  /**
   * 显示心情提示框
   * 提示词 2: 毛玻璃悬浮框 + 弹簧动画 + 边缘检测 + 位置跟随感更丝滑
   * @param {HTMLElement} dayElement - 日期元素
   */
  /**
   * 显示心情提示框
   * Requirements: 5.3, 21.1, 21.2, 21.3, 21.4
   * @param {HTMLElement} dayElement - 日期元素
   */
  async showTooltip(dayElement) {
    const date = dayElement.dataset.date;
    const moodKey = dayElement.dataset.mood;
    const note = dayElement.dataset.note;

    if (!moodKey) return;

    const moodType = this.moodTypes[moodKey];
    const moodLabel = moodType ? moodType.label : moodKey;
    const moodColor = moodType ? moodType.color : '#6b7280';
    const gradientColors = this.getMoodGradient(moodKey);

    // Requirement 21.1: 检查是否存在日志条目
    const journalEntry = await this.checkJournalEntry(date);

    // 移除已存在的提示框
    this.hideTooltip();

    // 提示词 2: 创建毛玻璃悬浮框
    const tooltip = document.createElement('div');
    tooltip.id = 'mood-tooltip';
    tooltip.className = 'fixed z-50 p-4 rounded-xl max-w-xs pointer-events-none';
    tooltip.style.borderColor = moodColor;
    tooltip.style.borderWidth = '1px';
    tooltip.style.borderStyle = 'solid';
    
    // 提示词 2: 应用弹簧动画
    tooltip.style.animation = 'springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    tooltip.style.opacity = '0';
    
    tooltip.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="mood-dot" style="background: ${gradientColors}; width: 24px; height: 24px; border-radius: 50%; filter: blur(2px); box-shadow: 0 0 16px ${moodColor};"></div>
        <div>
          <p class="font-bold text-sm mb-1">${moodLabel}</p>
          <p class="text-xs text-white/50 mb-2">${date}</p>
          ${note ? `<p class="text-sm text-white/80 leading-relaxed mb-3">${note}</p>` : ''}
          ${journalEntry ? this.renderJournalLink(journalEntry) : ''}
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);

    // 提示词 2: 边缘检测并自动调整位置 - 位置跟随感更丝滑
    const rect = dayElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.top - tooltipRect.height - 10;
    
    if (top < 10) {
      top = rect.bottom + 10;
    }
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    if (left < 10) {
      left = 10;
    }
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = window.innerHeight - tooltipRect.height - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    // 触发弹簧动画
    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);
  }

  /**
   * 检查指定日期是否有日志条目
   * Requirement 21.1: 检查日志条目是否存在
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   * @returns {Promise<Object|null>} 日志条目或 null
   */
  async checkJournalEntry(date) {
    try {
      // 加载日志数据
      const journalData = await dataLoader.fetchJSON('/data/journal-entries.json');
      
      if (!journalData || !journalData.entries) {
        return null;
      }
      
      // 查找匹配日期的日志条目
      const entry = journalData.entries.find(e => e.date === date);
      return entry || null;
      
    } catch (error) {
      console.warn('[MoodCalendar] 无法加载日志数据:', error);
      return null;
    }
  }

  /**
   * 渲染日志链接
   * Requirements: 21.2, 21.3, 21.4
   * @param {Object} entry - 日志条目
   * @returns {string} HTML 字符串
   */
  renderJournalLink(entry) {
    // Requirement 21.2, 21.4: 显示"查看当日日志"链接，视觉上清晰可操作
    return `
      <a href="${entry.detailPage}" 
         class="journal-link flex items-center gap-2 mt-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 pointer-events-auto"
         style="background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.4); color: white;">
        <i class="fas fa-book"></i>
        <span>查看当日日志</span>
        <i class="fas fa-arrow-right text-xs"></i>
      </a>
    `;
  }

  /**
   * 隐藏心情提示框
   */
  hideTooltip() {
    const tooltip = document.getElementById('mood-tooltip');
    if (tooltip) {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(-10px)';
      setTimeout(() => tooltip.remove(), 300);
    }
  }

  /**
   * 导航到上个月或下个月
   * Requirements: 5.4, 5.5 - 支持月份导航 + 淡入淡出过渡效果
   * Feature: mood-journal-enhancement
   * Requirements: 3.7, 3.10 - 月份切换时更新统计数据
   * 提示词 3: 支持异步渲染
   * @param {number} direction - 方向 (-1 = 上个月, 1 = 下个月)
   */
  async navigateMonth(direction) {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    this.currentMonth = newMonth;
    
    console.log(`[MoodCalendar] 导航到: ${this.getMonthYearString()}`);
    
    // Requirement 5.5: 应用淡入淡出过渡效果
    const gridContainer = this.container.querySelector('.calendar-grid-container');
    if (gridContainer) {
      // 淡出
      gridContainer.style.opacity = '0';
      gridContainer.style.transform = 'translateY(10px)';
      
      // 等待淡出完成后重新渲染
      setTimeout(async () => {
        await this.render();
        
        // Feature: mood-journal-enhancement
        // Requirements: 3.7, 3.10 - 更新情绪统计面板
        this.updateEmotionStatistics();
        
        // 淡入
        const newGridContainer = this.container.querySelector('.calendar-grid-container');
        if (newGridContainer) {
          newGridContainer.style.opacity = '0';
          newGridContainer.style.transform = 'translateY(-10px)';
          
          setTimeout(() => {
            newGridContainer.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            newGridContainer.style.opacity = '1';
            newGridContainer.style.transform = 'translateY(0)';
          }, 10);
        }
      }, 200);
    } else {
      // 如果找不到容器，直接重新渲染
      await this.render();
      
      // Feature: mood-journal-enhancement
      // Requirements: 3.7, 3.10 - 更新情绪统计面板
      this.updateEmotionStatistics();
    }
  }

  /**
   * 获取指定日期的心情数据
   * @param {string} dateString - 日期字符串 (YYYY-MM-DD)
   * @returns {Object|null} 心情数据对象或 null
   */
  getMoodForDate(dateString) {
    return this.moods.find(mood => mood.date === dateString) || null;
  }

  /**
   * 格式化日期为 YYYY-MM-DD
   * @param {number} year - 年份
   * @param {number} month - 月份 (0-11)
   * @param {number} day - 日期
   * @returns {string} 格式化的日期字符串
   */
  formatDate(year, month, day) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  }

  /**
   * 获取当前月份年份字符串
   * @returns {string} 格式化的月份年份字符串
   */
  getMonthYearString() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    return `${year} 年 ${monthNames[month]}`;
  }

  /**
   * 为有日志的日期添加图标指示器
   * 提示词 3: 跨数据关联 - 在日历单元格内显示"书本"图标
   */
  async addJournalIndicators() {
    try {
      // 加载日志数据
      const journalData = await dataLoader.fetchJSON('/data/journal-entries.json');
      
      if (!journalData || !journalData.entries) {
        console.log('[MoodCalendar] 没有日志数据');
        return;
      }
      
      // 为每个有日志的日期添加图标
      journalData.entries.forEach(entry => {
        const dateCell = this.container.querySelector(`[data-date="${entry.date}"]`);
        
        if (dateCell) {
          // 检查是否已经有图标
          if (!dateCell.querySelector('.journal-indicator')) {
            // 添加日志图标
            const indicator = document.createElement('div');
            indicator.className = 'journal-indicator absolute top-1 right-1';
            indicator.innerHTML = '<i class="fas fa-book text-xs text-purple-400/60 hover:text-purple-400 transition-colors"></i>';
            indicator.title = '该日期有日志';
            
            dateCell.appendChild(indicator);
            
            // 为日期单元格添加 data-has-journal 属性
            dateCell.dataset.hasJournal = 'true';
            dateCell.dataset.journalId = entry.id;
          }
        }
      });
      
      console.log('[MoodCalendar] 已添加日志指示器');
      
    } catch (error) {
      console.warn('[MoodCalendar] 无法加载日志数据:', error);
    }
  }

  /**
   * 转义 HTML 特殊字符
   * @param {string} text - 要转义的文本
   * @returns {string} 转义后的文本
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 触发保存动效
   * Feature: journal-editor-enhancement
   * Requirements: 5.1, 5.2, 5.3, 5.4 - 为指定日期单元格执行 spring-bounce 动画并显示成功标记
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   */
  triggerSaveAnimation(date) {
    if (!date) {
      console.warn('[MoodCalendar] 无法触发保存动效：日期参数缺失');
      return;
    }

    console.log('[MoodCalendar] 触发保存动效，日期:', date);

    // 查找对应的日期单元格
    const dateCell = this.container.querySelector(`[data-date="${date}"]`);
    
    if (!dateCell) {
      console.warn('[MoodCalendar] 找不到日期单元格:', date);
      return;
    }

    // Requirement 5.2: 使用 AnimationController 执行动画
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // 如果用户偏好减少动画，直接显示成功标记
      this.showSuccessCheckmark(dateCell);
      return;
    }

    // Requirement 5.3: 添加 will-change 优化性能
    dateCell.style.willChange = 'transform';
    
    // 执行 spring-bounce 动画
    // Requirement 5.3: 应用 cubic-bezier(0.34, 1.56, 0.64, 1) 曲线
    dateCell.style.animation = 'none';
    // 强制重排以重置动画
    void dateCell.offsetWidth;
    dateCell.style.animation = 'springBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // 动画完成后的处理
    const handleAnimationEnd = () => {
      console.log('[MoodCalendar] 保存动效完成');
      
      // 清理性能优化属性
      dateCell.style.willChange = 'auto';
      
      // 移除事件监听器
      dateCell.removeEventListener('animationend', handleAnimationEnd);
      
      // Requirement 5.4: 动画完成后显示成功勾选标记
      this.showSuccessCheckmark(dateCell);
    };

    dateCell.addEventListener('animationend', handleAnimationEnd);
  }

  /**
   * 显示成功勾选标记
   * Feature: journal-editor-enhancement
   * Requirement 5.4 - 在日期单元格上显示成功勾选标记
   * @param {HTMLElement} dateCell - 日期单元格元素
   */
  showSuccessCheckmark(dateCell) {
    if (!dateCell) {
      console.warn('[MoodCalendar] 无法显示成功标记：单元格不存在');
      return;
    }

    // 检查是否已经有成功标记
    if (dateCell.querySelector('.success-checkmark')) {
      console.log('[MoodCalendar] 成功标记已存在');
      return;
    }

    // 创建成功勾选标记
    const checkmark = document.createElement('div');
    checkmark.className = 'success-checkmark absolute top-1 left-1 z-10';
    checkmark.innerHTML = `
      <div class="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/40">
        <i class="fas fa-check text-xs text-green-400"></i>
      </div>
    `;
    
    // 初始状态：不可见
    checkmark.style.opacity = '0';
    checkmark.style.transform = 'scale(0.5)';
    checkmark.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // 添加到日期单元格
    dateCell.appendChild(checkmark);
    
    // 触发淡入和放大动画
    setTimeout(() => {
      checkmark.style.opacity = '1';
      checkmark.style.transform = 'scale(1)';
    }, 10);
    
    console.log('[MoodCalendar] 成功标记已显示');
    
    // 3秒后淡出标记
    setTimeout(() => {
      checkmark.style.opacity = '0';
      checkmark.style.transform = 'scale(0.8)';
      
      // 动画完成后移除元素
      setTimeout(() => {
        checkmark.remove();
      }, 300);
    }, 3000);
  }

  /**
   * 初始化情绪统计组件
   * Feature: mood-journal-enhancement
   * Requirements: 3.8 - 集成 EmotionStatistics 到 MoodCalendar
   * Feature: journal-editor-enhancement
   * Requirements: 11.2 - 建立组件间的连接以支持过滤功能
   */
  initEmotionStatistics() {
    const statsContainer = document.getElementById('emotion-statistics-container');
    
    if (!statsContainer) {
      console.warn('[MoodCalendar] 找不到情绪统计容器，跳过初始化');
      return;
    }
    
    // 检查 EmotionStatistics 类是否已加载
    if (typeof EmotionStatistics === 'undefined') {
      console.error('[MoodCalendar] EmotionStatistics 组件未加载');
      return;
    }
    
    // 创建 EmotionStatistics 实例
    this.emotionStatistics = new EmotionStatistics(
      'emotion-statistics-container',
      this.moods,
      this.moodTypes,
      this.currentMonth
    );
    
    // Feature: journal-editor-enhancement, Requirements: 11.2
    // 设置日历实例引用，以便 EmotionStatistics 可以触发过滤
    this.emotionStatistics.setCalendarInstance(this);
    
    // 动态导入并设置 MoodFilterController
    import('./utils/mood-filter-controller.js')
      .then(module => {
        const controller = module.default;
        
        // 为 EmotionStatistics 设置控制器
        this.emotionStatistics.setMoodFilterController(controller);
        
        // 为 MoodCalendar 设置控制器
        this.setMoodFilterController(controller);
        
        // 为控制器设置日历实例
        controller.setCalendarInstance(this);
        
        console.log('[MoodCalendar] MoodFilterController 连接已建立');
      })
      .catch(error => {
        console.warn('[MoodCalendar] 无法加载 MoodFilterController:', error);
      });
    
    // 渲染统计面板
    this.emotionStatistics.render();
    
    console.log('[MoodCalendar] EmotionStatistics 组件已初始化');
  }

  /**
   * 更新情绪统计数据
   * Feature: mood-journal-enhancement
   * Requirements: 3.7, 3.10 - 月份切换时更新统计数据
   */
  updateEmotionStatistics() {
    if (!this.emotionStatistics) {
      console.warn('[MoodCalendar] EmotionStatistics 组件未初始化');
      return;
    }
    
    // 调用 EmotionStatistics 的 update 方法
    this.emotionStatistics.update(this.moods, this.currentMonth);
    
    console.log('[MoodCalendar] 情绪统计数据已更新');
  }

  /**
   * 重新加载数据
   */
  async reload() {
    // 清除缓存
    dataLoader.clearCache();
    // 重新加载
    await this.loadMoods();
  }

  /**
   * 设置心情过滤控制器引用
   * Feature: journal-editor-enhancement, Requirements: 11.2
   * @param {Object} controller - MoodFilterController 实例
   */
  setMoodFilterController(controller) {
    this.moodFilterController = controller;
    
    // 监听过滤事件
    window.addEventListener('moodFilterChange', (e) => {
      const { action, moodType } = e.detail;
      
      if (action === 'activated') {
        this.highlightDates(moodType);
      } else if (action === 'cleared') {
        this.clearFilter();
      }
    });
    
    console.log('[MoodCalendar] MoodFilterController 已设置，过滤事件监听已启动');
  }

  /**
   * 高亮匹配的日期
   * Feature: journal-editor-enhancement
   * Requirements: 11.3, 11.4 - 高亮匹配日期，降低非匹配日期透明度至 30%
   * @param {string} moodType - 心情类型
   */
  highlightDates(moodType) {
    if (!moodType) {
      console.warn('[MoodCalendar] 无法高亮日期：心情类型参数缺失');
      return;
    }

    console.log('[MoodCalendar] 高亮心情类型:', moodType);

    // 设置当前激活的过滤
    this.activeFilter = moodType;

    // 获取所有日期单元格
    const dateCells = this.container.querySelectorAll('.calendar-day[data-date]');
    
    if (dateCells.length === 0) {
      console.warn('[MoodCalendar] 找不到日期单元格');
      return;
    }

    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDuration = prefersReducedMotion ? '0s' : '0.3s';

    dateCells.forEach(cell => {
      const cellMood = cell.dataset.mood;
      
      // 设置过渡效果
      cell.style.transition = `opacity ${transitionDuration} ease-in-out, transform ${transitionDuration} ease-in-out`;
      
      if (cellMood === moodType) {
        // Requirement 11.3: 高亮匹配的日期
        cell.style.opacity = '1';
        cell.style.transform = 'scale(1.05)';
        cell.classList.add('filter-highlighted');
      } else {
        // Requirement 11.4: 降低非匹配日期透明度至 30%
        cell.style.opacity = '0.3';
        cell.style.transform = 'scale(1)';
        cell.classList.add('filter-dimmed');
      }
    });

    // 显示过滤指示器
    this.showFilterIndicator(moodType);

    console.log('[MoodCalendar] 日期高亮完成');
  }

  /**
   * 清除过滤
   * Feature: journal-editor-enhancement
   * Requirements: 11.5 - 恢复所有日期的正常显示
   */
  clearFilter() {
    console.log('[MoodCalendar] 清除过滤');

    // 清除激活的过滤状态
    this.activeFilter = null;

    // 获取所有日期单元格
    const dateCells = this.container.querySelectorAll('.calendar-day[data-date]');
    
    if (dateCells.length === 0) {
      console.warn('[MoodCalendar] 找不到日期单元格');
      return;
    }

    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDuration = prefersReducedMotion ? '0s' : '0.3s';

    // Requirement 11.5: 恢复所有日期的正常显示
    dateCells.forEach(cell => {
      cell.style.transition = `opacity ${transitionDuration} ease-in-out, transform ${transitionDuration} ease-in-out`;
      cell.style.opacity = '1';
      cell.style.transform = 'scale(1)';
      cell.classList.remove('filter-highlighted', 'filter-dimmed');
    });

    // 隐藏过滤指示器
    this.hideFilterIndicator();

    // 通知 MoodFilterController 清除过滤
    if (this.moodFilterController) {
      // 直接更新控制器状态，不触发事件（避免循环）
      this.moodFilterController.currentFilter = null;
      this.moodFilterController.restoreAllDates();
    }

    console.log('[MoodCalendar] 过滤已清除');
  }

  /**
   * 显示过滤指示器
   * Feature: journal-editor-enhancement, Requirements: 11.5
   * @param {string} moodType - 心情类型
   */
  showFilterIndicator(moodType) {
    const indicator = document.getElementById('filter-indicator');
    const moodLabel = document.getElementById('filter-mood-label');
    
    if (!indicator || !moodLabel) {
      console.warn('[MoodCalendar] 找不到过滤指示器元素');
      return;
    }

    // 获取心情类型标签
    const moodTypeConfig = this.moodTypes[moodType];
    const label = moodTypeConfig ? moodTypeConfig.label : moodType;
    const icon = moodTypeConfig ? moodTypeConfig.icon : '😐';

    // 更新标签文本
    moodLabel.innerHTML = `${icon} ${label}`;

    // 显示指示器（带淡入动画）
    indicator.classList.remove('hidden');
    indicator.style.opacity = '0';
    indicator.style.transform = 'translateY(-10px)';
    
    // 触发动画
    setTimeout(() => {
      indicator.style.transition = 'all 0.3s ease-in-out';
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateY(0)';
    }, 10);
  }

  /**
   * 隐藏过滤指示器
   * Feature: journal-editor-enhancement, Requirements: 11.5
   */
  hideFilterIndicator() {
    const indicator = document.getElementById('filter-indicator');
    
    if (!indicator) {
      return;
    }

    // 淡出动画
    indicator.style.transition = 'all 0.3s ease-in-out';
    indicator.style.opacity = '0';
    indicator.style.transform = 'translateY(-10px)';
    
    // 动画完成后隐藏
    setTimeout(() => {
      indicator.classList.add('hidden');
    }, 300);
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.MoodCalendar = MoodCalendar;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MoodCalendar };
}
