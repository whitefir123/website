/**
 * JournalEditor - 日志编辑器组件
 * 负责日志的创建、编辑和实时预览
 * 
 * Feature: mood-journal-enhancement, journal-editor-enhancement
 * Requirements: 2.1-2.10, 5.2, 5.4, 5.5, 1.1-1.5
 */

class JournalEditor {
  /**
   * 构造函数
   * @param {string} containerId - 容器元素的 ID
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.moodTypes = {};
    this.availableTags = [
      'web-development',
      'game-development',
      'design',
      'personal',
      'unity',
      'lessons-learned',
      'ui-ux',
      'animation',
      'performance',
      'indie-game',
      'productivity',
      '技术',
      '生活',
      '思考'
    ];
    this.selectedTags = [];
    this.formData = {
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      mood: ''
    };
    
    // 初始化 MarkdownParser 实例
    this.markdownParser = new MarkdownParser();
    
    // 初始化 DraftService 实例
    this.draftService = window.draftService;
    
    // 初始化 ExportService 实例
    this.exportService = window.exportService;
    
    if (!this.container) {
      console.error(`[JournalEditor] 找不到容器元素: ${containerId}`);
    }
  }

  /**
   * 初始化编辑器
   * Requirements: 2.1, 2.4, 2.2, 2.3
   */
  async init() {
    try {
      console.log('[JournalEditor] 正在初始化编辑器...');
      
      // 加载心情类型数据
      await this.loadMoodTypes();
      
      // 验证颜色对比度（开发模式）
      this.validateColorContrast();
      
      // 渲染编辑器界面
      this.render();
      
      // 添加事件监听器
      this.attachEventListeners();
      
      // 检查并恢复草稿
      await this.checkAndRestoreDraft();
      
      console.log('[JournalEditor] 编辑器初始化完成');
    } catch (error) {
      console.error('[JournalEditor] 初始化失败:', error);
      this.showError('编辑器初始化失败，请刷新页面重试。');
    }
  }

  /**
   * 加载心情类型数据
   * Requirement 2.4
   */
  async loadMoodTypes() {
    try {
      const moodData = await dataLoader.fetchJSON('/data/moods.json');
      this.moodTypes = moodData.moodTypes || {};
      console.log('[JournalEditor] 心情类型数据加载成功');
    } catch (error) {
      console.warn('[JournalEditor] 无法加载心情类型数据:', error);
      this.moodTypes = {};
    }
  }

  /**
   * 检查并恢复草稿
   * Requirements: 2.2, 2.3, 2.4
   */
  async checkAndRestoreDraft() {
    try {
      const draft = this.draftService.loadDraft();
      
      if (!draft) {
        console.log('[JournalEditor] 没有发现草稿');
        return;
      }
      
      // 检查草稿是否过期
      const isExpired = this.draftService.isDraftExpired(draft);
      const draftAge = this.draftService.getDraftAge(draft);
      
      let message = '检测到未完成的草稿，是否恢复？';
      if (isExpired) {
        message = `检测到 ${draftAge} 天前的草稿，是否恢复？`;
      }
      
      // 显示恢复对话框
      const shouldRestore = await this.showRestoreDialog(message, draft);
      
      if (shouldRestore) {
        this.restoreDraft(draft);
        this.showNotification('草稿已恢复', 'success');
        console.log('[JournalEditor] 草稿已恢复');
      } else {
        this.draftService.clearDraft();
        console.log('[JournalEditor] 用户选择不恢复草稿，已清除');
      }
    } catch (error) {
      console.error('[JournalEditor] 检查草稿失败:', error);
    }
  }

  /**
   * 显示草稿恢复对话框
   * Requirements: 2.3
   */
  showRestoreDialog(message, draft) {
    return new Promise((resolve) => {
      // 创建对话框元素
      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
      dialog.style.backdropFilter = 'blur(8px)';
      dialog.style.backgroundColor = 'hsl(240 10% 3.9% / 0.8)';
      
      dialog.innerHTML = `
        <div class="glass-card rounded-2xl p-8 max-w-md w-full animate-smart-fade-in">
          <div class="text-center mb-6">
            <i class="fas fa-file-alt text-5xl text-purple-400 mb-4"></i>
            <h3 class="text-2xl font-bold tracking-tighter mb-2">发现草稿</h3>
            <p class="text-white/70 leading-relaxed">${message}</p>
          </div>
          
          <div class="bg-white/5 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
            <div class="text-sm space-y-2">
              ${draft.title ? `<p class="text-white/90"><strong>标题：</strong>${this.escapeHtml(draft.title)}</p>` : ''}
              ${draft.content ? `<p class="text-white/70"><strong>内容预览：</strong>${this.escapeHtml(draft.content.substring(0, 100))}${draft.content.length > 100 ? '...' : ''}</p>` : ''}
            </div>
          </div>
          
          <div class="flex gap-4">
            <button id="restore-draft-btn" class="btn-primary flex-1 inline-flex items-center justify-center gap-2 px-6 py-3">
              <i class="fas fa-undo"></i>
              <span>恢复草稿</span>
            </button>
            <button id="discard-draft-btn" class="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3">
              <i class="fas fa-trash"></i>
              <span>丢弃</span>
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(dialog);
      
      // 绑定按钮事件
      const restoreBtn = dialog.querySelector('#restore-draft-btn');
      const discardBtn = dialog.querySelector('#discard-draft-btn');
      
      restoreBtn.addEventListener('click', () => {
        dialog.remove();
        resolve(true);
      });
      
      discardBtn.addEventListener('click', () => {
        dialog.remove();
        resolve(false);
      });
    });
  }

  /**
   * 恢复草稿到编辑器
   * Requirement 2.4
   */
  restoreDraft(draft) {
    // 恢复标题
    if (draft.title) {
      this.formData.title = draft.title;
      const titleInput = document.getElementById('journal-title');
      if (titleInput) {
        titleInput.value = draft.title;
        this.updateCharCount('title', draft.title.length, 100);
      }
    }
    
    // 恢复内容
    if (draft.content) {
      this.formData.content = draft.content;
      const contentInput = document.getElementById('journal-content');
      if (contentInput) {
        contentInput.value = draft.content;
        this.updateReadTime();
      }
    }
    
    // 恢复心情关联
    if (draft.moodId) {
      this.formData.mood = draft.moodId;
      const moodSelect = document.getElementById('journal-mood');
      if (moodSelect) {
        moodSelect.value = draft.moodId;
      }
    }
    
    // 更新预览
    this.updatePreview();
  }

  /**
   * 渲染编辑器界面
   * Requirements: 2.1, 2.2, 2.3, 2.9
   */
  render() {
    if (!this.container) {
      console.error('[JournalEditor] 容器不存在，无法渲染');
      return;
    }

    const editorHTML = `
      <div class="journal-editor grid lg:grid-cols-2 gap-8 animate-on-scroll">
        <!-- 左侧：编辑表单 -->
        <div class="editor-form space-y-6">
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-2xl font-bold tracking-tighter mb-6">
              <i class="fas fa-edit mr-2 text-purple-400"></i>
              编辑内容
            </h2>
            
            <!-- 标题输入框 -->
            <div class="form-group mb-6">
              <label for="journal-title" class="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                标题 <span class="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                id="journal-title" 
                class="form-input" 
                placeholder="输入日志标题（最多 100 字符）"
                maxlength="100"
                required
                aria-label="日志标题"
              />
              <div class="error-message" id="title-error"></div>
              <div class="text-xs text-white/50 mt-2">
                <span id="title-count">0</span> / 100 字符
              </div>
            </div>
            
            <!-- 摘要输入框 -->
            <div class="form-group mb-6">
              <label for="journal-excerpt" class="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                摘要 <span class="text-red-400">*</span>
              </label>
              <textarea 
                id="journal-excerpt" 
                class="form-input resize-none" 
                placeholder="输入日志摘要（最多 200 字符）"
                rows="3"
                maxlength="200"
                required
                aria-label="日志摘要"
              ></textarea>
              <div class="error-message" id="excerpt-error"></div>
              <div class="text-xs text-white/50 mt-2">
                <span id="excerpt-count">0</span> / 200 字符
              </div>
            </div>
            
            <!-- 标签多选器 -->
            <div class="form-group mb-6">
              <label class="block text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
                标签 <span class="text-red-400">*</span>
              </label>
              <div class="tag-selector" id="tag-selector">
                ${this.renderTagOptions()}
              </div>
              <div class="error-message" id="tags-error"></div>
              <div class="text-xs text-white/50 mt-2">
                已选择 <span id="tags-count">0</span> 个标签
              </div>
            </div>
            
            <!-- 心情关联下拉菜单 -->
            <div class="form-group mb-6">
              <label for="journal-mood" class="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                关联今日心情 <span class="text-white/50">(可选)</span>
              </label>
              <select 
                id="journal-mood" 
                class="form-input cursor-pointer"
                aria-label="关联心情"
              >
                <option value="">无关联心情</option>
                ${this.renderMoodOptions()}
              </select>
            </div>
            
            <!-- 正文编辑区 -->
            <div class="form-group mb-6">
              <label for="journal-content" class="block text-sm font-semibold text-white/70 mb-2 uppercase tracking-wider">
                正文 <span class="text-red-400">*</span>
              </label>
              <textarea 
                id="journal-content" 
                class="form-input resize-none" 
                placeholder="输入日志正文内容..."
                rows="15"
                required
                aria-label="日志正文"
              ></textarea>
              <div class="error-message" id="content-error"></div>
              <div class="text-xs text-white/50 mt-2">
                预估阅读时间：<span id="read-time">0</span> 分钟
              </div>
            </div>
            
            <!-- 提交按钮 -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                id="submit-journal" 
                class="btn-primary flex-1 inline-flex items-center justify-center gap-2 px-6 py-3"
                aria-label="提交日志"
              >
                <i class="fas fa-check"></i>
                <span>提交日志</span>
              </button>
              <button 
                id="save-local" 
                class="btn-gradient inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
                aria-label="保存到本地"
              >
                <i class="fas fa-download"></i>
                <span>保存到本地</span>
              </button>
              <button 
                id="reset-form" 
                class="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3"
                aria-label="重置表单"
              >
                <i class="fas fa-redo"></i>
                <span>重置</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 右侧：实时预览 -->
        <div class="preview-area">
          <div class="preview-sticky">
            <div class="glass-card rounded-2xl p-6">
              <h2 class="text-2xl font-bold tracking-tighter mb-6">
                <i class="fas fa-eye mr-2 text-purple-400"></i>
                实时预览
              </h2>
              
              <div id="preview-content" class="space-y-6">
                ${this.renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = editorHTML;
  }

  /**
   * 渲染标签选项
   * Requirement 2.2
   */
  renderTagOptions() {
    return this.availableTags.map(tag => `
      <button 
        class="tag-option" 
        data-tag="${tag}"
        aria-label="选择标签: ${tag}"
      >
        <i class="fas fa-tag mr-1"></i>
        ${tag}
      </button>
    `).join('');
  }

  /**
   * 渲染心情选项
   * Requirements: 2.4, 4.1, 4.2, 4.3, 4.4
   */
  renderMoodOptions() {
    return Object.entries(this.moodTypes).map(([key, moodType]) => {
      // 将 hex 颜色转换为 RGB 以便使用透明度
      const rgb = this.hexToRgb(moodType.color);
      return `
        <option 
          value="${key}" 
          data-mood-color="${moodType.color}"
          style="background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1); color: white; padding: 0.5rem;"
        >
          ${moodType.icon} ${moodType.label}
        </option>
      `;
    }).join('');
  }

  /**
   * 将 Hex 颜色转换为 RGB
   * 用于支持透明度设置
   */
  hexToRgb(hex) {
    // 移除 # 符号
    hex = hex.replace('#', '');
    
    // 解析 RGB 值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }

  /**
   * 计算颜色的相对亮度（用于 WCAG 对比度计算）
   * Requirements: 4.3
   */
  getRelativeLuminance(r, g, b) {
    // 将 RGB 值转换为 0-1 范围
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    // 应用 sRGB 转换
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    // 计算相对亮度
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * 计算两个颜色之间的对比度
   * Requirements: 4.3
   */
  getContrastRatio(color1, color2) {
    const l1 = this.getRelativeLuminance(color1.r, color1.g, color1.b);
    const l2 = this.getRelativeLuminance(color2.r, color2.g, color2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 验证颜色对比度是否符合 WCAG AA 标准（至少 4.5:1）
   * Requirements: 4.3
   */
  validateColorContrast() {
    // 白色文字的 RGB 值
    const whiteText = { r: 255, g: 255, b: 255 };
    
    // 检查每个心情颜色与白色文字的对比度
    Object.entries(this.moodTypes).forEach(([key, moodType]) => {
      const bgColor = this.hexToRgb(moodType.color);
      
      // 由于背景是 10% 透明度，实际背景是混合了黑色背景
      // 计算混合后的颜色（10% 心情色 + 90% 黑色背景 #050505）
      const mixedBg = {
        r: Math.round(bgColor.r * 0.1 + 5 * 0.9),
        g: Math.round(bgColor.g * 0.1 + 5 * 0.9),
        b: Math.round(bgColor.b * 0.1 + 5 * 0.9)
      };
      
      const contrastRatio = this.getContrastRatio(whiteText, mixedBg);
      
      // WCAG AA 标准要求至少 4.5:1
      if (contrastRatio < 4.5) {
        console.warn(`[JournalEditor] 心情 "${moodType.label}" 的对比度 ${contrastRatio.toFixed(2)}:1 低于 WCAG AA 标准 (4.5:1)`);
      } else {
        console.log(`[JournalEditor] 心情 "${moodType.label}" 的对比度 ${contrastRatio.toFixed(2)}:1 符合 WCAG AA 标准`);
      }
    });
  }

  /**
   * 渲染实时预览
   * Requirements: 2.3, 2.5, 1.1, 1.2, 1.3, 1.4, 1.5
   */
  renderPreview() {
    const { title, excerpt, content, tags, mood } = this.formData;
    
    // 如果没有任何内容，显示空状态
    if (!title && !excerpt && !content && tags.length === 0) {
      return `
        <div class="empty-state text-center py-12">
          <div class="empty-state-icon mx-auto">
            <i class="fas fa-file-alt"></i>
          </div>
          <h3 class="empty-state-title">开始撰写你的日志</h3>
          <p class="empty-state-description">
            在左侧填写内容，这里将实时显示预览效果
          </p>
        </div>
      `;
    }
    
    // 获取心情颜色
    const moodColor = mood && this.moodTypes[mood] 
      ? this.moodTypes[mood].color 
      : '#6b7280';
    
    // 计算阅读时间
    const readTime = this.calculateReadTime(content);
    
    // 格式化日期
    const today = new Date();
    const formattedDate = `${today.getFullYear()} 年 ${String(today.getMonth() + 1).padStart(2, '0')} 月 ${String(today.getDate()).padStart(2, '0')} 日`;
    
    // 使用 MarkdownParser 解析正文内容
    const parsedContent = content ? this.markdownParser.parse(content) : '';
    
    return `
      <article class="journal-entry-card border-b border-white/5 pb-6 relative pl-6"
               style="border-left: 2px solid ${moodColor};">
        
        <!-- 心情色标发光效果 -->
        <div class="absolute left-0 top-0 bottom-0 w-0.5"
             style="background: ${moodColor}; box-shadow: 0 0 8px ${moodColor}40;"></div>
        
        <!-- 标题 -->
        <h2 class="text-2xl font-bold tracking-tighter mb-3 ${title ? '' : 'text-white/30'}">
          ${title || '未命名日志'}
        </h2>
        
        <!-- 日期和阅读时间 -->
        <div class="flex items-center gap-4 mb-4 text-xs uppercase tracking-wider text-white/50">
          <time datetime="${today.toISOString().split('T')[0]}">
            ${formattedDate}
          </time>
          <span>${readTime} min read</span>
          ${mood && this.moodTypes[mood] ? `
            <span class="flex items-center gap-1">
              <span>${this.moodTypes[mood].icon}</span>
              <span>${this.moodTypes[mood].label}</span>
            </span>
          ` : ''}
        </div>
        
        <!-- 摘要 -->
        <p class="text-white/70 leading-relaxed mb-4 ${excerpt ? '' : 'text-white/30'}">
          ${excerpt || '暂无摘要'}
        </p>
        
        <!-- 正文预览（使用 Markdown 解析） -->
        ${parsedContent ? `
          <div class="prose prose-invert max-w-none mb-4 markdown-preview">
            ${parsedContent}
          </div>
        ` : ''}
        
        <!-- 标签 -->
        ${tags.length > 0 ? `
          <div class="flex flex-wrap gap-2">
            ${tags.map(tag => `
              <span class="journal-tag px-3 py-1 rounded-full bg-transparent border border-white/20 text-sm text-white/70">
                ${tag}
              </span>
            `).join('')}
          </div>
        ` : ''}
      </article>
    `;
  }

  /**
   * 添加事件监听器
   * Requirements: 2.5, 2.8
   */
  attachEventListeners() {
    if (!this.container) return;

    // 标题输入
    const titleInput = document.getElementById('journal-title');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this.formData.title = e.target.value;
        this.updateCharCount('title', e.target.value.length, 100);
        this.updatePreview();
        this.clearError('title');
        // 自动保存草稿
        this.saveDraftDebounced();
      });
    }

    // 摘要输入
    const excerptInput = document.getElementById('journal-excerpt');
    if (excerptInput) {
      excerptInput.addEventListener('input', (e) => {
        this.formData.excerpt = e.target.value;
        this.updateCharCount('excerpt', e.target.value.length, 200);
        this.updatePreview();
        this.clearError('excerpt');
      });
    }

    // 正文输入
    const contentInput = document.getElementById('journal-content');
    if (contentInput) {
      contentInput.addEventListener('input', (e) => {
        this.formData.content = e.target.value;
        this.updateReadTime();
        this.updatePreview();
        this.clearError('content');
        // 自动保存草稿
        this.saveDraftDebounced();
      });
    }

    // 标签选择
    const tagButtons = this.container.querySelectorAll('.tag-option');
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        this.toggleTag(tag, btn);
      });
    });

    // 心情选择
    const moodSelect = document.getElementById('journal-mood');
    if (moodSelect) {
      moodSelect.addEventListener('change', (e) => {
        this.formData.mood = e.target.value;
        this.updatePreview();
      });
    }

    // 提交按钮
    const submitBtn = document.getElementById('submit-journal');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.handleSubmit();
      });
    }

    // 保存到本地按钮
    const saveLocalBtn = document.getElementById('save-local');
    if (saveLocalBtn) {
      saveLocalBtn.addEventListener('click', () => {
        this.handleExportToLocal();
      });
    }

    // 重置按钮
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetForm();
      });
    }

    console.log('[JournalEditor] 事件监听器已添加');
  }

  /**
   * 切换标签选择状态
   * Requirement 2.2
   */
  toggleTag(tag, button) {
    const index = this.selectedTags.indexOf(tag);
    
    if (index > -1) {
      // 取消选择
      this.selectedTags.splice(index, 1);
      button.classList.remove('selected');
    } else {
      // 选择标签
      this.selectedTags.push(tag);
      button.classList.add('selected');
    }
    
    this.formData.tags = this.selectedTags;
    this.updateTagCount();
    this.updatePreview();
    this.clearError('tags');
  }

  /**
   * 保存草稿（带防抖）
   * Requirement 2.1
   */
  saveDraftDebounced() {
    // 清除之前的定时器
    if (this.draftSaveTimer) {
      clearTimeout(this.draftSaveTimer);
    }
    
    // 设置新的定时器，500ms 后保存
    this.draftSaveTimer = setTimeout(() => {
      this.saveDraft();
    }, 500);
  }

  /**
   * 保存草稿到 LocalStorage
   * Requirement 2.1, 15.2
   */
  saveDraft() {
    try {
      // 只有在有内容时才保存
      if (!this.formData.title && !this.formData.content) {
        return;
      }
      
      const draft = {
        title: this.formData.title,
        content: this.formData.content,
        moodId: this.formData.mood || null,
        timestamp: Date.now()
      };
      
      const success = this.draftService.saveDraft(draft);
      
      if (success) {
        console.log('[JournalEditor] 草稿已自动保存');
      } else {
        console.warn('[JournalEditor] 草稿保存失败');
        // 显示友好提示（配额超限处理）
        this.showNotification('草稿内容过大，无法自动保存。建议：1) 分段保存内容 2) 使用"保存到本地"按钮导出备份', 'error');
      }
    } catch (error) {
      console.error('[JournalEditor] 保存草稿时出错:', error);
      // 捕获其他可能的错误
      if (error.name === 'QuotaExceededError') {
        this.showNotification('浏览器存储空间已满，请清理旧数据或使用"保存到本地"功能', 'error');
      }
    }
  }

  /**
   * 更新字符计数
   */
  updateCharCount(field, count, max) {
    const countElement = document.getElementById(`${field}-count`);
    if (countElement) {
      countElement.textContent = count;
      
      // 接近上限时改变颜色
      if (count > max * 0.9) {
        countElement.style.color = '#f59e0b';
      } else if (count === max) {
        countElement.style.color = '#ef4444';
      } else {
        countElement.style.color = '';
      }
    }
  }

  /**
   * 更新标签计数
   */
  updateTagCount() {
    const countElement = document.getElementById('tags-count');
    if (countElement) {
      countElement.textContent = this.selectedTags.length;
    }
  }

  /**
   * 更新阅读时间
   */
  updateReadTime() {
    const readTime = this.calculateReadTime(this.formData.content);
    const readTimeElement = document.getElementById('read-time');
    if (readTimeElement) {
      readTimeElement.textContent = readTime;
    }
  }

  /**
   * 计算阅读时间（基于字数）
   * Requirement 5.2
   */
  calculateReadTime(content) {
    if (!content) return 0;
    
    // 中文：每分钟约 300 字
    // 英文：每分钟约 200 词
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = content.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length;
    
    const readTime = Math.ceil((chineseChars / 300) + (englishWords / 200));
    return Math.max(1, readTime); // 至少 1 分钟
  }

  /**
   * 更新实时预览
   * Requirement 2.5
   */
  updatePreview() {
    const previewContent = document.getElementById('preview-content');
    if (previewContent) {
      previewContent.innerHTML = this.renderPreview();
    }
  }

  /**
   * 验证表单数据
   * Requirements: 2.10
   */
  validateForm() {
    let isValid = true;
    
    // 验证标题
    if (!this.formData.title || this.formData.title.trim() === '') {
      this.showError('title', '标题不能为空');
      isValid = false;
    } else if (this.formData.title.length > 100) {
      this.showError('title', '标题不能超过 100 字符');
      isValid = false;
    }
    
    // 验证摘要
    if (!this.formData.excerpt || this.formData.excerpt.trim() === '') {
      this.showError('excerpt', '摘要不能为空');
      isValid = false;
    } else if (this.formData.excerpt.length > 200) {
      this.showError('excerpt', '摘要不能超过 200 字符');
      isValid = false;
    }
    
    // 验证正文
    if (!this.formData.content || this.formData.content.trim() === '') {
      this.showError('content', '正文不能为空');
      isValid = false;
    }
    
    // 验证标签
    if (this.selectedTags.length === 0) {
      this.showError('tags', '请至少选择一个标签');
      isValid = false;
    }
    
    return isValid;
  }

  /**
   * 显示错误提示
   * Requirement 2.11
   */
  showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(`journal-${field}`);
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
    
    if (inputElement) {
      inputElement.classList.add('error');
    }
    
    // 如果是标签错误，高亮标签选择器
    if (field === 'tags') {
      const tagSelector = document.getElementById('tag-selector');
      if (tagSelector) {
        tagSelector.style.border = '1px solid rgba(239, 68, 68, 0.5)';
        tagSelector.style.borderRadius = '0.75rem';
        tagSelector.style.padding = '0.5rem';
      }
    }
  }

  /**
   * 清除错误提示
   */
  clearError(field) {
    const errorElement = document.getElementById(`${field}-error`);
    const inputElement = document.getElementById(`journal-${field}`);
    
    if (errorElement) {
      errorElement.classList.remove('show');
    }
    
    if (inputElement) {
      inputElement.classList.remove('error');
    }
    
    // 如果是标签错误，移除高亮
    if (field === 'tags') {
      const tagSelector = document.getElementById('tag-selector');
      if (tagSelector) {
        tagSelector.style.border = '';
        tagSelector.style.borderRadius = '';
        tagSelector.style.padding = '';
      }
    }
  }

  /**
   * 生成日志条目数据
   * Requirements: 2.7, 5.2, 5.4, 5.5
   */
  generateJournalEntry() {
    const now = new Date();
    const timestamp = now.getTime();
    const dateString = now.toISOString().split('T')[0];
    
    // 生成唯一 ID
    const id = `journal-${timestamp}`;
    
    // 计算阅读时间
    const readTime = this.calculateReadTime(this.formData.content);
    
    // 转换正文为 HTML 格式（简单的段落处理）
    const contentHtml = this.formData.content
      .split('\n\n')
      .map(para => `<p>${this.escapeHtml(para)}</p>`)
      .join('');
    
    // 生成日志条目对象
    const journalEntry = {
      id: id,
      title: this.formData.title.trim(),
      date: dateString,
      excerpt: this.formData.excerpt.trim(),
      content: contentHtml,
      tags: this.selectedTags,
      mood: this.formData.mood || undefined,
      readTime: readTime,
      detailPage: `#`, // 暂时为 #
      timestamp: timestamp
    };
    
    return journalEntry;
  }

  /**
   * 处理提交操作
   * Requirements: 2.8, 2.13, 2.5
   */
  handleSubmit() {
    console.log('[JournalEditor] 开始提交日志...');
    
    // 验证表单
    if (!this.validateForm()) {
      console.warn('[JournalEditor] 表单验证失败');
      this.showNotification('请填写所有必填字段', 'error');
      return;
    }
    
    // 生成日志条目数据
    const journalEntry = this.generateJournalEntry();
    
    // 输出到控制台
    console.log('[JournalEditor] 生成的日志条目数据:');
    console.log(JSON.stringify(journalEntry, null, 2));
    
    // 清除草稿（提交成功后）
    this.draftService.clearDraft();
    console.log('[JournalEditor] 草稿已清除');
    
    // 显示成功提示
    this.showNotification('日志已生成！请查看控制台输出。', 'success');
    
    // 可选：重置表单
    setTimeout(() => {
      if (confirm('日志已生成。是否重置表单以创建新日志？')) {
        this.resetForm();
      }
    }, 1000);
  }

  /**
   * 处理导出到本地操作
   * Requirements: 3.2, 3.3, 3.4, 3.5
   */
  handleExportToLocal() {
    console.log('[JournalEditor] 开始导出日志到本地...');
    
    // 验证表单
    if (!this.validateForm()) {
      console.warn('[JournalEditor] 表单验证失败');
      this.showNotification('请填写所有必填字段后再导出', 'error');
      return;
    }
    
    // 生成日志条目数据
    const journalEntry = this.generateJournalEntry();
    
    // 调用 ExportService 导出
    const success = this.exportService.exportToJSON(journalEntry);
    
    if (success) {
      console.log('[JournalEditor] 日志导出成功');
      this.showNotification('日志已成功保存到本地！', 'success');
    } else {
      console.error('[JournalEditor] 日志导出失败');
      this.showNotification('导出失败，请重试', 'error');
    }
  }

  /**
   * 重置表单
   */
  resetForm() {
    // 重置表单数据
    this.formData = {
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      mood: ''
    };
    this.selectedTags = [];
    
    // 重置输入框
    const titleInput = document.getElementById('journal-title');
    const excerptInput = document.getElementById('journal-excerpt');
    const contentInput = document.getElementById('journal-content');
    const moodSelect = document.getElementById('journal-mood');
    
    if (titleInput) titleInput.value = '';
    if (excerptInput) excerptInput.value = '';
    if (contentInput) contentInput.value = '';
    if (moodSelect) moodSelect.value = '';
    
    // 重置标签选择
    const tagButtons = this.container.querySelectorAll('.tag-option');
    tagButtons.forEach(btn => btn.classList.remove('selected'));
    
    // 重置计数器
    this.updateCharCount('title', 0, 100);
    this.updateCharCount('excerpt', 0, 200);
    this.updateTagCount();
    this.updateReadTime();
    
    // 更新预览
    this.updatePreview();
    
    // 清除所有错误
    ['title', 'excerpt', 'content', 'tags'].forEach(field => {
      this.clearError(field);
    });
    
    console.log('[JournalEditor] 表单已重置');
  }

  /**
   * 显示通知消息
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-50 glass-card rounded-xl p-4 max-w-sm animate-smart-fade-in ${
      type === 'error' ? 'border-red-500/50' : 'border-green-500/50'
    }`;
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-${type === 'error' ? 'exclamation-circle text-red-400' : 'check-circle text-green-400'} text-xl"></i>
        <p class="text-sm text-white">${message}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // 5秒后自动移除
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 300ms ease-in-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * HTML 转义
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.JournalEditor = JournalEditor;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JournalEditor };
}
