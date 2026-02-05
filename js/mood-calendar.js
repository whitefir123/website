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
    
    if (!this.container) {
      console.error(`[MoodCalendar] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 加载心情数据
   * Requirements: 5.2, 5.5
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
   */
  render() {
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
  }

  /**
   * 显示心情提示框
   * 提示词 2: 毛玻璃悬浮框 + 弹簧动画 + 边缘检测 + 位置跟随感更丝滑
   * @param {HTMLElement} dayElement - 日期元素
   */
  showTooltip(dayElement) {
    const date = dayElement.dataset.date;
    const moodKey = dayElement.dataset.mood;
    const note = dayElement.dataset.note;

    if (!moodKey) return;

    const moodType = this.moodTypes[moodKey];
    const moodLabel = moodType ? moodType.label : moodKey;
    const moodColor = moodType ? moodType.color : '#6b7280';
    const gradientColors = this.getMoodGradient(moodKey);

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
          ${note ? `<p class="text-sm text-white/80 leading-relaxed">${note}</p>` : ''}
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
   * @param {number} direction - 方向 (-1 = 上个月, 1 = 下个月)
   */
  navigateMonth(direction) {
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
      setTimeout(() => {
        this.render();
        
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
      this.render();
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
   * 重新加载数据
   */
  async reload() {
    // 清除缓存
    dataLoader.clearCache();
    // 重新加载
    await this.loadMoods();
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
