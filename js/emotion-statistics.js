/**
 * EmotionStatistics - 情绪统计面板组件
 * 负责展示当前月份的心情分布统计
 * 
 * Feature: mood-journal-enhancement
 * Requirements: 3.5, 3.6, 3.7, 3.8, 3.10
 */

class EmotionStatistics {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   * @param {Array} moods - 心情数据数组
   * @param {Object} moodTypes - 心情类型配置对象
   * @param {Date} currentMonth - 当前显示的月份
   */
  constructor(containerId, moods, moodTypes, currentMonth) {
    this.container = document.getElementById(containerId);
    this.moods = moods || [];
    this.moodTypes = moodTypes || {};
    this.currentMonth = currentMonth || new Date();
    
    if (!this.container) {
      console.error(`[EmotionStatistics] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 渲染统计面板
   * Requirements: 3.5, 3.6, 3.7, 3.8
   */
  render() {
    if (!this.container) {
      console.error('[EmotionStatistics] 容器不存在，无法渲染');
      return;
    }

    // 计算心情频率
    const frequency = this.calculateMoodFrequency();
    
    // 检查是否有数据
    const hasData = Object.keys(frequency).length > 0;
    
    // 构建统计面板 HTML
    const statisticsHTML = `
      <div class="emotion-statistics glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold tracking-tighter mb-6 flex items-center gap-2">
          <i class="fas fa-chart-pie text-purple-400"></i>
          <span>本月情绪统计</span>
        </h3>
        
        ${hasData ? this.renderStatistics(frequency) : this.renderEmptyState()}
      </div>
    `;
    
    this.container.innerHTML = statisticsHTML;
    
    // 触发进度条动画
    this.animateProgressBars();
  }

  /**
   * 计算心情频率
   * Requirements: 3.6 - 统计当前月份各类心情出现的频率
   * @returns {Object} 心情频率对象 { moodKey: { count, percentage, color, label, icon } }
   */
  calculateMoodFrequency() {
    // 获取当前月份的年份和月份
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // 过滤出当前月份的心情记录
    const currentMonthMoods = this.moods.filter(mood => {
      const moodDate = new Date(mood.date);
      return moodDate.getFullYear() === year && moodDate.getMonth() === month;
    });
    
    // 如果没有数据，返回空对象
    if (currentMonthMoods.length === 0) {
      return {};
    }
    
    // 统计每种心情的出现次数
    const moodCounts = {};
    currentMonthMoods.forEach(mood => {
      const moodKey = mood.mood;
      if (!moodCounts[moodKey]) {
        moodCounts[moodKey] = 0;
      }
      moodCounts[moodKey]++;
    });
    
    // 计算百分比并构建频率对象
    const totalCount = currentMonthMoods.length;
    const frequency = {};
    
    Object.entries(moodCounts).forEach(([moodKey, count]) => {
      const percentage = Math.round((count / totalCount) * 100);
      const moodType = this.moodTypes[moodKey];
      
      frequency[moodKey] = {
        count: count,
        percentage: percentage,
        color: moodType ? moodType.color : '#6b7280',
        label: moodType ? moodType.label : moodKey,
        icon: moodType ? moodType.icon : '😐'
      };
    });
    
    // 按百分比降序排序
    const sortedFrequency = Object.fromEntries(
      Object.entries(frequency).sort((a, b) => b[1].percentage - a[1].percentage)
    );
    
    return sortedFrequency;
  }

  /**
   * 渲染统计数据
   * Requirements: 3.7, 3.8 - 使用百分比进度条展示心情占比
   * @param {Object} frequency - 心情频率对象
   * @returns {string} HTML 字符串
   */
  renderStatistics(frequency) {
    let statisticsHTML = '<div class="space-y-4">';
    
    Object.entries(frequency).forEach(([moodKey, data]) => {
      statisticsHTML += this.renderProgressBar(moodKey, data);
    });
    
    statisticsHTML += '</div>';
    
    return statisticsHTML;
  }

  /**
   * 渲染进度条
   * Requirements: 3.7, 3.8 - 使用与 Mood_Types_Config 一致的颜色方案
   * @param {string} moodKey - 心情类型键
   * @param {Object} data - 心情数据 { count, percentage, color, label, icon }
   * @returns {string} HTML 字符串
   */
  renderProgressBar(moodKey, data) {
    return `
      <div class="mood-stat" data-mood="${moodKey}">
        <div class="flex justify-between items-center mb-2">
          <span class="flex items-center gap-2">
            <span class="text-xl" style="filter: drop-shadow(0 0 8px ${data.color});">
              ${data.icon}
            </span>
            <span class="text-sm font-medium">${data.label}</span>
          </span>
          <span class="text-sm text-white/50">${data.percentage}%</span>
        </div>
        <div class="progress-bar-bg h-2 rounded-full bg-white/10 overflow-hidden">
          <div class="progress-bar-fill h-full rounded-full transition-all duration-500 ease-out"
               style="width: 0%; background: ${data.color}; box-shadow: 0 0 10px ${data.color};"
               data-target-width="${data.percentage}%">
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 渲染空状态
   * @returns {string} HTML 字符串
   */
  renderEmptyState() {
    return `
      <div class="text-center py-8">
        <i class="fas fa-chart-pie text-white/20 text-4xl mb-4"></i>
        <p class="text-white/50 text-sm">本月暂无心情记录</p>
      </div>
    `;
  }

  /**
   * 实现进度条动画效果
   * Requirements: 3.6 - 实现进度条动画效果
   */
  animateProgressBars() {
    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      const progressBars = this.container.querySelectorAll('.progress-bar-fill');
      
      progressBars.forEach((bar, index) => {
        const targetWidth = bar.dataset.targetWidth;
        
        // 延迟动画，创建瀑布效果
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, index * 100);
      });
    });
  }

  /**
   * 更新统计数据
   * Requirements: 3.10 - 当用户切换日历月份时，更新统计数据
   * @param {Array} moods - 新的心情数据数组
   * @param {Date} currentMonth - 新的当前月份
   */
  update(moods, currentMonth) {
    this.moods = moods || [];
    this.currentMonth = currentMonth || new Date();
    
    console.log(`[EmotionStatistics] 更新统计数据: ${this.getMonthYearString()}`);
    
    // 重新渲染
    this.render();
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
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.EmotionStatistics = EmotionStatistics;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmotionStatistics };
}
