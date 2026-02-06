/**
 * EmotionStatistics - 情绪统计面板组件
 * 负责展示当前月份的心情分布统计
 * 
 * Feature: mood-journal-enhancement
 * Requirements: 3.5, 3.6, 3.7, 3.8, 3.10
 * 
 * Feature: journal-editor-enhancement
 * Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2
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
    
    // Feature: journal-editor-enhancement, Requirements: 10.1
    // Intersection Observer 用于检测统计条进入视口
    this.viewportObserver = null;
    this.animationController = null;
    
    // Feature: journal-editor-enhancement, Requirements: 11.1, 11.2
    // 心情过滤控制器引用
    this.moodFilterController = null;
    this.calendarInstance = null; // 日历实例引用
    
    // Feature: journal-editor-enhancement, Requirements: 9.3
    // 生活建议配置 - 心情类型到建议文本的映射
    this.lifeAdviceConfig = {
      happy: '保持这份快乐！继续做让你开心的事情，也别忘了与身边的人分享这份喜悦。',
      sad: '允许自己感受悲伤，这是正常的情绪。试着和信任的人聊聊，或者做些让自己舒服的事情。',
      excited: '你的热情很棒！记得在兴奋之余也要照顾好自己的身体，保持充足的休息。',
      neutral: '平静也是一种力量。享受这份宁静，也可以尝试一些新鲜事物为生活增添色彩。',
      anxious: '深呼吸，一切都会好起来的。试着将担忧写下来，或者做些运动来释放压力。',
      tired: '你的身体在提醒你需要休息。给自己一些放松的时间，早点睡觉，明天会更好。',
      motivated: '太棒了！趁着这股动力去实现你的目标吧，但也要记得劳逸结合哦。'
    };
    
    if (!this.container) {
      console.error(`[EmotionStatistics] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 渲染统计面板
   * Requirements: 3.5, 3.6, 3.7, 3.8, 9.1, 9.2, 9.3, 9.4
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
    
    // 识别主导心情
    const dominantMood = hasData ? this.identifyDominantMood(frequency) : null;
    
    // 构建统计面板 HTML
    const statisticsHTML = `
      <div class="emotion-statistics glass-card rounded-2xl p-6">
        <h3 class="text-lg font-bold tracking-tighter mb-6 flex items-center gap-2">
          <i class="fas fa-chart-pie text-purple-400"></i>
          <span>本月情绪统计</span>
        </h3>
        
        ${hasData ? this.renderStatistics(frequency) : this.renderEmptyState()}
        
        ${dominantMood ? this.renderLifeAdvice(dominantMood) : ''}
      </div>
    `;
    
    this.container.innerHTML = statisticsHTML;
    
    // Feature: journal-editor-enhancement, Requirements: 10.1, 10.2, 10.3, 10.4
    // 使用 Intersection Observer 触发入场动画
    this.setupEntranceAnimation();
    
    // Feature: journal-editor-enhancement, Requirements: 11.1, 11.2
    // 为统计面板中的心情类型绑定点击事件以触发过滤
    this.attachFilterEventListeners();
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
   * 识别主导心情类型
   * Requirements: 9.1, 9.2 - 识别出现频率最高的心情类型
   * @param {Object} frequency - 心情频率对象
   * @returns {string|null} 主导心情类型键，如果没有数据则返回 null
   */
  identifyDominantMood(frequency) {
    // 如果没有数据，返回 null
    if (!frequency || Object.keys(frequency).length === 0) {
      return null;
    }
    
    // 由于 frequency 已经按百分比降序排序，第一个就是主导心情
    const dominantMoodKey = Object.keys(frequency)[0];
    
    console.log(`[EmotionStatistics] 主导心情: ${dominantMoodKey} (${frequency[dominantMoodKey].percentage}%)`);
    
    return dominantMoodKey;
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
   * Feature: journal-editor-enhancement, Requirements: 11.1 - 添加可点击样式
   * @param {string} moodKey - 心情类型键
   * @param {Object} data - 心情数据 { count, percentage, color, label, icon }
   * @returns {string} HTML 字符串
   */
  renderProgressBar(moodKey, data) {
    return `
      <div class="mood-stat cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-all duration-300" 
           data-mood="${moodKey}"
           role="button"
           tabindex="0"
           aria-label="点击过滤 ${data.label} 心情">
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
   * 渲染生活建议区域
   * Requirements: 9.3, 9.4 - 根据主导心情显示对应建议
   * @param {string} dominantMoodKey - 主导心情类型键
   * @returns {string} HTML 字符串
   */
  renderLifeAdvice(dominantMoodKey) {
    // 获取建议文本
    const adviceText = this.lifeAdviceConfig[dominantMoodKey];
    
    // 如果没有配置建议，返回空字符串
    if (!adviceText) {
      console.warn(`[EmotionStatistics] 未找到心情类型 ${dominantMoodKey} 的生活建议配置`);
      return '';
    }
    
    // 获取心情类型信息
    const moodType = this.moodTypes[dominantMoodKey];
    const moodIcon = moodType ? moodType.icon : '💭';
    const moodLabel = moodType ? moodType.label : dominantMoodKey;
    const moodColor = moodType ? moodType.color : '#6b7280';
    
    // 构建生活建议 HTML - 遵循大厂风格设计
    return `
      <div class="life-advice mt-6 pt-6 border-t border-white/10">
        <div class="flex items-start gap-3">
          <!-- 图标区域 -->
          <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
               style="background: ${moodColor}20; box-shadow: 0 0 20px ${moodColor}40;">
            <span class="text-2xl" style="filter: drop-shadow(0 0 8px ${moodColor});">
              ${moodIcon}
            </span>
          </div>
          
          <!-- 建议内容区域 -->
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-white/70 mb-2 flex items-center gap-2">
              <i class="fas fa-lightbulb text-yellow-400"></i>
              <span>本月主导心情：${moodLabel}</span>
            </h4>
            <p class="text-sm text-white/80 leading-relaxed">
              ${adviceText}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 实现进度条动画效果
   * Requirements: 3.6 - 实现进度条动画效果
   * @deprecated 已被 setupEntranceAnimation 替代
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
   * 设置统计条入场动画
   * Feature: journal-editor-enhancement
   * Requirements: 10.1, 10.2, 10.3, 10.4
   * 使用 Intersection Observer 检测统计条进入视口，并执行伸展动画
   */
  setupEntranceAnimation() {
    // 如果容器不存在，直接返回
    if (!this.container) {
      return;
    }

    // 获取所有统计条元素
    const progressBars = this.container.querySelectorAll('.progress-bar-fill');
    
    // 如果没有统计条，直接返回
    if (progressBars.length === 0) {
      return;
    }

    // 创建 Intersection Observer
    // Requirements: 10.1 - 检测统计条进入视口
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 当 10% 的元素可见时触发
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素进入视口，触发动画
          this.animateStatisticsBars();
          // 动画触发后，停止观察
          observer.disconnect();
        }
      });
    }, observerOptions);

    // 观察统计面板容器
    const statisticsPanel = this.container.querySelector('.emotion-statistics');
    if (statisticsPanel) {
      observer.observe(statisticsPanel);
    }

    // 保存 observer 引用以便后续清理
    this.viewportObserver = observer;
  }

  /**
   * 执行统计条伸展动画
   * Feature: journal-editor-enhancement
   * Requirements: 10.2, 10.3, 10.4
   * 使用 cubic-bezier(0.34, 1.56, 0.64, 1) 曲线，为每个统计条设置递增的动画延迟
   */
  animateStatisticsBars() {
    // 获取所有统计条元素
    const progressBars = this.container.querySelectorAll('.progress-bar-fill');
    
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    progressBars.forEach((bar, index) => {
      const targetWidth = parseFloat(bar.dataset.targetWidth);
      
      // Requirements: 10.4 - 为每个统计条设置递增的动画延迟
      const delay = index * 100; // 100ms, 200ms, 300ms...
      
      if (prefersReducedMotion) {
        // 如果用户偏好减少动画，直接设置宽度
        setTimeout(() => {
          bar.style.width = `${targetWidth}%`;
        }, delay);
      } else {
        // Requirements: 10.2 - 应用 cubic-bezier(0.34, 1.56, 0.64, 1) 曲线
        // Requirements: 10.3 - 从 0% 宽度伸展至目标百分比
        
        // 添加 will-change 优化性能
        bar.style.willChange = 'width';
        
        // 初始状态
        bar.style.width = '0%';
        bar.style.transition = 'none';
        
        // 延迟后开始动画
        setTimeout(() => {
          bar.style.transition = 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          bar.style.width = `${targetWidth}%`;
          
          // 动画完成后清理 will-change
          setTimeout(() => {
            bar.style.willChange = 'auto';
          }, 800);
        }, delay);
      }
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

  /**
   * 清理资源
   * Feature: journal-editor-enhancement
   * 断开 Intersection Observer 连接
   */
  destroy() {
    if (this.viewportObserver) {
      this.viewportObserver.disconnect();
      this.viewportObserver = null;
    }
  }

  /**
   * 设置日历实例引用
   * Feature: journal-editor-enhancement, Requirements: 11.2
   * @param {Object} calendar - 日历实例
   */
  setCalendarInstance(calendar) {
    this.calendarInstance = calendar;
    console.log('[EmotionStatistics] 日历实例已设置');
  }

  /**
   * 设置心情过滤控制器引用
   * Feature: journal-editor-enhancement, Requirements: 11.2
   * @param {Object} controller - MoodFilterController 实例
   */
  setMoodFilterController(controller) {
    this.moodFilterController = controller;
    console.log('[EmotionStatistics] MoodFilterController 已设置');
  }

  /**
   * 为统计面板中的心情类型绑定点击事件
   * Feature: journal-editor-enhancement
   * Requirements: 11.1, 11.2 - 点击心情类型触发过滤事件
   */
  attachFilterEventListeners() {
    if (!this.container) {
      console.warn('[EmotionStatistics] 容器不存在，无法绑定过滤事件');
      return;
    }

    // 获取所有心情统计项
    const moodStats = this.container.querySelectorAll('.mood-stat[data-mood]');
    
    if (moodStats.length === 0) {
      console.log('[EmotionStatistics] 没有心情统计项，跳过绑定过滤事件');
      return;
    }

    console.log(`[EmotionStatistics] 为 ${moodStats.length} 个心情统计项绑定过滤事件`);

    moodStats.forEach(statElement => {
      const moodKey = statElement.dataset.mood;
      
      if (!moodKey) {
        console.warn('[EmotionStatistics] 心情统计项缺少 data-mood 属性');
        return;
      }

      // 点击事件
      statElement.addEventListener('click', () => {
        this.handleMoodFilterClick(moodKey, statElement);
      });

      // 键盘可访问性
      statElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleMoodFilterClick(moodKey, statElement);
        }
      });
    });
  }

  /**
   * 处理心情过滤点击事件
   * Feature: journal-editor-enhancement
   * Requirements: 11.1, 11.2 - 调用 MoodFilterController 激活过滤
   * @param {string} moodKey - 心情类型键
   * @param {HTMLElement} statElement - 统计项元素
   */
  handleMoodFilterClick(moodKey, statElement) {
    console.log('[EmotionStatistics] 点击心情类型:', moodKey);

    // 检查 MoodFilterController 是否可用
    if (!this.moodFilterController && !window.moodFilterController) {
      console.error('[EmotionStatistics] MoodFilterController 未初始化');
      return;
    }

    // 使用实例或全局控制器
    const controller = this.moodFilterController || window.moodFilterController;

    // Requirement 11.2: 调用 MoodFilterController 激活过滤
    controller.activateFilter(moodKey);

    // 更新视觉反馈
    this.updateFilterVisualFeedback(moodKey);

    console.log('[EmotionStatistics] 过滤已激活:', moodKey);
  }

  /**
   * 更新过滤视觉反馈
   * Feature: journal-editor-enhancement
   * 为激活的心情统计项添加视觉高亮
   * @param {string} activeMoodKey - 激活的心情类型键，null 表示清除所有高亮
   */
  updateFilterVisualFeedback(activeMoodKey) {
    if (!this.container) {
      return;
    }

    const moodStats = this.container.querySelectorAll('.mood-stat[data-mood]');
    
    moodStats.forEach(statElement => {
      const moodKey = statElement.dataset.mood;
      
      if (activeMoodKey === null) {
        // 清除所有高亮
        statElement.classList.remove('filter-active');
        statElement.style.backgroundColor = '';
      } else if (moodKey === activeMoodKey) {
        // 高亮激活的心情
        statElement.classList.add('filter-active');
        statElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        // 降低其他心情的视觉强度
        statElement.classList.remove('filter-active');
        statElement.style.backgroundColor = '';
        statElement.style.opacity = '0.5';
      }
    });

    // 如果清除过滤，恢复所有透明度
    if (activeMoodKey === null) {
      moodStats.forEach(statElement => {
        statElement.style.opacity = '1';
      });
    }
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
