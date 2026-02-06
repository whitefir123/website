/**
 * Mood Filter Controller
 * 管理心情过滤状态和日历高亮
 * Feature: journal-editor-enhancement
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

class MoodFilterController {
  constructor() {
    this.currentFilter = null; // 当前过滤的心情类型
    this.calendarInstance = null; // 日历实例引用
    this.debounceTimer = null; // 防抖定时器
    this.DEBOUNCE_DELAY = 300; // 防抖延迟（毫秒）
  }

  /**
   * 设置日历实例引用
   * @param {Object} calendar - 日历实例
   */
  setCalendarInstance(calendar) {
    this.calendarInstance = calendar;
  }

  /**
   * 激活过滤（带防抖）
   * @param {string} moodType - 心情类型
   */
  activateFilter(moodType) {
    // 清除之前的防抖定时器
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // 防抖处理
    this.debounceTimer = setTimeout(() => {
      this._activateFilterImmediate(moodType);
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * 立即激活过滤（内部方法）
   * @param {string} moodType - 心情类型
   */
  _activateFilterImmediate(moodType) {
    // 如果点击的是当前已激活的过滤，则清除过滤
    if (this.currentFilter === moodType) {
      this.clearFilter();
      return;
    }

    // 清除旧的过滤状态
    if (this.currentFilter) {
      this.restoreAllDates();
    }

    // 设置新的过滤状态
    this.currentFilter = moodType;

    // 高亮匹配的日期
    this.highlightDates(moodType);
  }

  /**
   * 清除过滤
   */
  clearFilter() {
    if (!this.currentFilter) {
      return;
    }

    this.currentFilter = null;
    this.restoreAllDates();
  }

  /**
   * 高亮匹配的日期
   * @param {string} moodType - 心情类型
   */
  highlightDates(moodType) {
    if (!this.calendarInstance) {
      console.warn('[MoodFilterController] 日历实例未设置');
      return;
    }

    // 获取所有日期单元格
    const dateCells = document.querySelectorAll('[data-date]');
    
    dateCells.forEach(cell => {
      const date = cell.getAttribute('data-date');
      const cellMoodType = this.getMoodTypeForDate(date);

      if (cellMoodType === moodType) {
        // 匹配的日期：高亮显示
        this.highlightCell(cell);
      } else {
        // 非匹配的日期：降低透明度
        this.dimCell(cell);
      }
    });

    // 触发自定义事件，通知其他组件过滤已激活
    this.dispatchFilterEvent('activated', moodType);
  }

  /**
   * 恢复所有日期显示
   */
  restoreAllDates() {
    const dateCells = document.querySelectorAll('[data-date]');
    
    dateCells.forEach(cell => {
      this.restoreCell(cell);
    });

    // 触发自定义事件，通知其他组件过滤已清除
    this.dispatchFilterEvent('cleared', null);
  }

  /**
   * 高亮单元格
   * @param {HTMLElement} cell - 日期单元格
   */
  highlightCell(cell) {
    cell.style.opacity = '1';
    cell.style.transform = 'scale(1.05)';
    cell.style.transition = 'all 0.3s ease-in-out';
    cell.classList.add('filter-highlighted');
  }

  /**
   * 降低单元格透明度
   * @param {HTMLElement} cell - 日期单元格
   */
  dimCell(cell) {
    cell.style.opacity = '0.3';
    cell.style.transform = 'scale(1)';
    cell.style.transition = 'all 0.3s ease-in-out';
    cell.classList.add('filter-dimmed');
  }

  /**
   * 恢复单元格显示
   * @param {HTMLElement} cell - 日期单元格
   */
  restoreCell(cell) {
    cell.style.opacity = '1';
    cell.style.transform = 'scale(1)';
    cell.style.transition = 'all 0.3s ease-in-out';
    cell.classList.remove('filter-highlighted', 'filter-dimmed');
  }

  /**
   * 获取指定日期的心情类型
   * @param {string} date - 日期字符串 (YYYY-MM-DD)
   * @returns {string|null} 心情类型或 null
   */
  getMoodTypeForDate(date) {
    if (!this.calendarInstance || !this.calendarInstance.moods) {
      console.warn('[MoodFilterController] 日历实例或心情数据不可用');
      return null;
    }

    // 从日历实例获取心情记录
    const moodRecord = this.calendarInstance.moods.find(mood => mood.date === date);
    
    return moodRecord ? moodRecord.mood : null;
  }

  /**
   * 获取当前过滤状态
   * @returns {string|null} 当前过滤的心情类型或 null
   */
  getCurrentFilter() {
    return this.currentFilter;
  }

  /**
   * 检查是否有激活的过滤
   * @returns {boolean}
   */
  hasActiveFilter() {
    return this.currentFilter !== null;
  }

  /**
   * 触发自定义过滤事件
   * @param {string} action - 动作类型 ('activated' 或 'cleared')
   * @param {string|null} moodType - 心情类型
   */
  dispatchFilterEvent(action, moodType) {
    const event = new CustomEvent('moodFilterChange', {
      detail: {
        action,
        moodType,
        timestamp: Date.now()
      }
    });

    window.dispatchEvent(event);
  }

  /**
   * 重置控制器状态
   */
  reset() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.clearFilter();
    this.calendarInstance = null;
  }
}

// 导出到全局作用域（浏览器环境）
if (typeof window !== 'undefined') {
  window.MoodFilterController = MoodFilterController;
  window.moodFilterController = new MoodFilterController();
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MoodFilterController };
}
