/**
 * Draft Service
 * 管理草稿的保存、恢复和清除
 * Feature: journal-editor-enhancement
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

class DraftService {
  constructor() {
    this.STORAGE_KEY = 'journal_draft';
    this.MAX_AGE_DAYS = 7; // 草稿最大保存天数
  }

  /**
   * 保存草稿到 LocalStorage
   * @param {Object} draft - 草稿对象 {title, content, moodId, timestamp}
   * @returns {boolean} 是否保存成功
   */
  saveDraft(draft) {
    try {
      const draftData = {
        title: draft.title || '',
        content: draft.content || '',
        moodId: draft.moodId || null,
        timestamp: Date.now()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draftData));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('[DraftService] LocalStorage 配额超限');
        // 尝试清理旧草稿后重试
        this.clearDraft();
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
          return true;
        } catch (retryError) {
          console.error('[DraftService] 重试保存失败:', retryError);
          return false;
        }
      }
      console.error('[DraftService] 保存草稿失败:', error);
      return false;
    }
  }

  /**
   * 从 LocalStorage 加载草稿
   * @returns {Object|null} 草稿对象或 null
   */
  loadDraft() {
    try {
      const draftJson = localStorage.getItem(this.STORAGE_KEY);
      if (!draftJson) {
        return null;
      }

      const draft = JSON.parse(draftJson);
      
      // 验证草稿数据结构
      if (!this.isValidDraft(draft)) {
        console.warn('[DraftService] 草稿数据格式无效，已清理');
        this.clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('[DraftService] 加载草稿失败:', error);
      this.clearDraft(); // 清理损坏的数据
      return null;
    }
  }

  /**
   * 清除 LocalStorage 中的草稿
   */
  clearDraft() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('[DraftService] 清除草稿失败:', error);
    }
  }

  /**
   * 检查是否存在草稿
   * @returns {boolean}
   */
  hasDraft() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * 检查草稿是否过期
   * @param {Object} draft - 草稿对象
   * @returns {boolean} 是否过期（超过 MAX_AGE_DAYS 天）
   */
  isDraftExpired(draft) {
    if (!draft || !draft.timestamp) {
      return false;
    }

    const now = Date.now();
    const ageInDays = (now - draft.timestamp) / (1000 * 60 * 60 * 24);
    return ageInDays > this.MAX_AGE_DAYS;
  }

  /**
   * 验证草稿数据结构
   * @param {Object} draft - 草稿对象
   * @returns {boolean}
   */
  isValidDraft(draft) {
    return (
      draft &&
      typeof draft === 'object' &&
      typeof draft.title === 'string' &&
      typeof draft.content === 'string' &&
      typeof draft.timestamp === 'number'
    );
  }

  /**
   * 获取草稿的年龄（天数）
   * @param {Object} draft - 草稿对象
   * @returns {number} 草稿年龄（天数）
   */
  getDraftAge(draft) {
    if (!draft || !draft.timestamp) {
      return 0;
    }

    const now = Date.now();
    return Math.floor((now - draft.timestamp) / (1000 * 60 * 60 * 24));
  }
}

// 导出到全局作用域（浏览器环境）
if (typeof window !== 'undefined') {
  window.DraftService = DraftService;
  window.draftService = new DraftService();
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DraftService };
}
