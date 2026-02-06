/**
 * MoodRecordModal - 心情记录对话框组件
 * 负责收集用户的心情数据，提供交互式心情选择界面
 * 
 * Feature: mood-journal-enhancement
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 */

class MoodRecordModal {
  /**
   * 构造函数
   * @param {Object} config - 配置对象
   * @param {string} config.date - 日期字符串 (YYYY-MM-DD)
   * @param {Object} config.moodTypes - 心情类型配置对象
   * @param {Function} config.onSave - 保存回调函数
   * @param {Function} config.onClose - 关闭回调函数
   * @param {Object} config.calendarInstance - MoodCalendar 实例引用（用于触发动画）
   */
  constructor(config) {
    this.date = config.date;
    this.moodTypes = config.moodTypes || {};
    this.onSave = config.onSave || (() => {});
    this.onClose = config.onClose || (() => {});
    this.calendarInstance = config.calendarInstance || null;
    
    this.selectedMood = null;
    this.note = '';
    this.modalElement = null;
    this.isVisible = false;
    
    // Feature: journal-editor-enhancement
    // Requirements: 6.1, 6.2 - 心情类型到占位符文本的映射
    this.placeholderConfig = {
      happy: "分享一下你的喜悦吧...",
      sad: "写下来会让心情好一些...",
      neutral: "记录今天的平静时光...",
      excited: "这份激动值得被记住！",
      anxious: "倾诉你的担忧，我在倾听...",
      tired: "休息一下，记录此刻的感受...",
      motivated: "记录下这份动力的来源！"
    };
    
    console.log('[MoodRecordModal] 初始化对话框，日期:', this.date);
  }

  /**
   * 显示对话框
   * Requirements: 1.1, 1.5 - 显示对话框并执行淡入动画
   */
  show() {
    if (this.isVisible) {
      console.warn('[MoodRecordModal] 对话框已经显示');
      return;
    }

    // 渲染对话框
    this.render();
    
    // 添加到 DOM
    document.body.appendChild(this.modalElement);
    
    // 触发淡入动画
    setTimeout(() => {
      this.modalElement.classList.add('modal-visible');
      const content = this.modalElement.querySelector('.modal-content');
      if (content) {
        content.classList.add('modal-content-visible');
      }
    }, 10);
    
    this.isVisible = true;
    
    // 添加事件监听器
    this.attachEventListeners();
    
    console.log('[MoodRecordModal] 对话框已显示');
  }

  /**
   * 隐藏对话框
   * Requirements: 1.5, 1.6 - 隐藏对话框并执行淡出动画
   */
  hide() {
    if (!this.isVisible || !this.modalElement) {
      return;
    }

    // 执行淡出动画
    this.modalElement.classList.remove('modal-visible');
    const content = this.modalElement.querySelector('.modal-content');
    if (content) {
      content.classList.remove('modal-content-visible');
    }
    
    // 等待动画完成后移除元素
    setTimeout(() => {
      if (this.modalElement && this.modalElement.parentNode) {
        this.modalElement.parentNode.removeChild(this.modalElement);
      }
      this.modalElement = null;
      this.isVisible = false;
      
      // 调用关闭回调
      this.onClose();
      
      console.log('[MoodRecordModal] 对话框已关闭');
    }, 300);
  }

  /**
   * 渲染对话框 HTML
   * Requirements: 1.2, 1.7, 1.8 - 渲染玻璃拟态对话框，展示心情选项
   */
  render() {
    // 创建对话框容器
    const modal = document.createElement('div');
    modal.id = 'mood-record-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out';
    
    // 构建对话框 HTML
    modal.innerHTML = `
      <!-- 背景遮罩 -->
      <div class="modal-backdrop absolute inset-0 backdrop-blur-sm" style="background-color: hsl(240 10% 3.9% / 0.8);"></div>
      
      <!-- 对话框内容 -->
      <div class="modal-content relative glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform scale-95 opacity-0 transition-all duration-300 ease-out"
           style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1);">
        
        <!-- 关闭按钮 -->
        <button class="modal-close-btn absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ease-in-out hover:scale-110"
                aria-label="关闭对话框">
          <i class="fas fa-times text-white/70"></i>
        </button>
        
        <!-- 标题 -->
        <h3 class="text-xl sm:text-2xl font-bold tracking-tighter mb-2">记录今日心情</h3>
        <p class="text-white/50 text-sm mb-6">${this.formatDateDisplay(this.date)}</p>
        
        <!-- 心情选项网格 -->
        <div class="mood-options grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          ${this.renderMoodOptions()}
        </div>
        
        <!-- 备注输入 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-white/70 mb-2">
            <i class="fas fa-pen mr-2"></i>添加备注（可选）
          </label>
          <textarea 
            id="mood-note-input"
            class="w-full rounded-xl p-3 sm:p-4 resize-none text-sm leading-relaxed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white;"
            placeholder="记录此刻的想法..." 
            rows="3"
            maxlength="200"></textarea>
          <p class="text-xs text-white/40 mt-2">
            <span id="note-char-count">0</span> / 200
          </p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex gap-3">
          <button class="modal-cancel-btn flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out hover:scale-105"
                  style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);">
            取消
          </button>
          <button id="mood-save-btn" 
                  class="flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style="background: linear-gradient(135deg, #8b5cf6, #ec4899); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);"
                  disabled>
            <i class="fas fa-check mr-2"></i>保存
          </button>
        </div>
      </div>
    `;
    
    this.modalElement = modal;
  }

  /**
   * 渲染心情选项网格
   * Requirements: 1.2 - 展示所有心情选项（包含图标和标签）
   */
  renderMoodOptions() {
    if (Object.keys(this.moodTypes).length === 0) {
      return '<p class="col-span-3 text-center text-white/50 text-sm">暂无心情选项</p>';
    }

    let optionsHTML = '';
    
    Object.entries(this.moodTypes).forEach(([key, moodType]) => {
      optionsHTML += `
        <button class="mood-option p-3 sm:p-4 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 flex flex-col items-center justify-center gap-2"
                style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);"
                data-mood="${key}"
                data-color="${moodType.color}"
                aria-label="选择心情: ${moodType.label}">
          <span class="text-2xl sm:text-3xl" style="filter: drop-shadow(0 0 8px ${moodType.color});">
            ${moodType.icon}
          </span>
          <span class="text-xs sm:text-sm font-medium">${moodType.label}</span>
        </button>
      `;
    });
    
    return optionsHTML;
  }

  /**
   * 添加事件监听器
   * Requirements: 1.5, 1.6 - 处理心情选择、保存、关闭等交互
   */
  attachEventListeners() {
    if (!this.modalElement) return;

    // 点击背景遮罩关闭对话框 (Requirement 1.6)
    const backdrop = this.modalElement.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        console.log('[MoodRecordModal] 点击背景遮罩，关闭对话框');
        this.hide();
      });
    }

    // 关闭按钮
    const closeBtn = this.modalElement.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('[MoodRecordModal] 点击关闭按钮');
        this.hide();
      });
    }

    // 取消按钮
    const cancelBtn = this.modalElement.querySelector('.modal-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        console.log('[MoodRecordModal] 点击取消按钮');
        this.hide();
      });
    }

    // 心情选项点击事件
    const moodOptions = this.modalElement.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        const moodKey = option.dataset.mood;
        this.selectMood(moodKey);
      });
    });

    // 备注输入事件
    const noteInput = this.modalElement.querySelector('#mood-note-input');
    if (noteInput) {
      noteInput.addEventListener('input', (e) => {
        this.note = e.target.value;
        this.updateCharCount();
      });
    }

    // 保存按钮
    const saveBtn = this.modalElement.querySelector('#mood-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.handleSave();
      });
    }

    // ESC 键关闭对话框
    this.keydownHandler = (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        console.log('[MoodRecordModal] 按下 ESC 键，关闭对话框');
        this.hide();
      }
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * 处理心情选择
   * Requirements: 1.5 - 选中状态切换
   * Feature: journal-editor-enhancement
   * Requirements: 6.1, 6.2, 6.4 - 动态更新占位符并添加淡入过渡效果
   * @param {string} moodKey - 心情类型键
   */
  selectMood(moodKey) {
    if (!this.modalElement) return;

    this.selectedMood = moodKey;
    console.log('[MoodRecordModal] 选择心情:', moodKey);

    // 更新所有选项的选中状态
    const moodOptions = this.modalElement.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
      const isSelected = option.dataset.mood === moodKey;
      
      if (isSelected) {
        const color = option.dataset.color;
        option.style.border = `2px solid ${color}`;
        option.style.boxShadow = `0 0 20px ${color}40`;
        option.style.background = `rgba(255, 255, 255, 0.08)`;
        option.classList.add('selected');
      } else {
        option.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        option.style.boxShadow = 'none';
        option.style.background = 'rgba(255, 255, 255, 0.05)';
        option.classList.remove('selected');
      }
    });

    // Feature: journal-editor-enhancement
    // Requirements: 6.1, 6.2, 6.4 - 动态更新备注输入框的占位符文本
    const noteInput = this.modalElement.querySelector('#mood-note-input');
    if (noteInput && this.placeholderConfig[moodKey]) {
      // 添加淡入过渡效果 (Requirement 6.4)
      noteInput.style.opacity = '0';
      noteInput.style.transition = 'opacity 300ms ease-in-out';
      
      setTimeout(() => {
        noteInput.placeholder = this.placeholderConfig[moodKey];
        noteInput.style.opacity = '1';
        console.log('[MoodRecordModal] 更新占位符:', this.placeholderConfig[moodKey]);
      }, 150);
    }

    // 启用保存按钮
    const saveBtn = this.modalElement.querySelector('#mood-save-btn');
    if (saveBtn) {
      saveBtn.disabled = false;
    }
  }

  /**
   * 更新字符计数
   */
  updateCharCount() {
    const charCount = this.modalElement.querySelector('#note-char-count');
    if (charCount) {
      charCount.textContent = this.note.length;
    }
  }

  /**
   * 处理保存操作
   * Requirements: 1.3, 1.4 - 生成心情记录数据并调用回调
   * Feature: journal-editor-enhancement
   * Requirements: 5.1, 5.5 - 保存成功后触发日历动画
   */
  handleSave() {
    if (!this.selectedMood) {
      console.warn('[MoodRecordModal] 未选择心情，无法保存');
      return;
    }

    // 生成心情记录数据
    const moodData = this.generateMoodData();
    
    // 输出到控制台 (Requirement 1.4)
    console.log('[MoodRecordModal] 生成的心情记录数据:', moodData);
    console.log('[MoodRecordModal] JSON 格式:', JSON.stringify(moodData, null, 2));
    
    // 调用保存回调
    this.onSave(moodData);
    
    // Feature: journal-editor-enhancement
    // Requirements: 5.1, 5.5 - 触发日历单元格的保存动效
    if (this.calendarInstance && typeof this.calendarInstance.triggerSaveAnimation === 'function') {
      console.log('[MoodRecordModal] 触发日历保存动效，日期:', this.date);
      this.calendarInstance.triggerSaveAnimation(this.date);
    } else {
      console.warn('[MoodRecordModal] 无法触发保存动效：calendarInstance 未提供或方法不存在');
    }
    
    // 关闭对话框 (Requirement 5.5)
    this.hide();
  }

  /**
   * 生成心情记录数据对象
   * Requirements: 1.3, 5.1, 5.3 - 生成符合 moods.json 格式的数据
   * @returns {Object} 心情记录数据对象
   */
  generateMoodData() {
    const moodType = this.moodTypes[this.selectedMood];
    const color = moodType ? moodType.color : '#6b7280';
    
    return {
      date: this.date,
      mood: this.selectedMood,
      note: this.note.trim(),
      color: color,
      timestamp: Date.now()
    };
  }

  /**
   * 格式化日期显示
   * @param {string} dateString - 日期字符串 (YYYY-MM-DD)
   * @returns {string} 格式化的日期显示
   */
  formatDateDisplay(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[date.getDay()];
    
    return `${year} 年 ${month} 月 ${day} 日 ${weekDay}`;
  }

  /**
   * 检查对话框是否可见
   * @returns {boolean} 是否可见
   */
  isModalVisible() {
    return this.isVisible;
  }

  /**
   * 清理资源
   */
  destroy() {
    // 移除键盘事件监听器
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
    
    // 隐藏对话框
    this.hide();
    
    console.log('[MoodRecordModal] 组件已销毁');
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.MoodRecordModal = MoodRecordModal;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MoodRecordModal };
}
