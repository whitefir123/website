/**
 * DataLoader - 数据加载工具类
 * 提供带缓存和错误处理的 JSON 数据加载功能
 * 
 * Feature: personal-website-redesign
 * Requirements: 12.3, 12.4, 12.5
 */

class DataLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * 从 URL 加载 JSON 数据
   * @param {string} url - 数据文件的 URL
   * @param {boolean} useCache - 是否使用缓存（默认为 true）
   * @returns {Promise<Object>} 解析后的 JSON 数据
   */
  async fetchJSON(url, useCache = true) {
    // 检查缓存
    if (useCache && this.cache.has(url)) {
      console.log(`[DataLoader] 从缓存加载: ${url}`);
      return this.cache.get(url);
    }

    try {
      console.log(`[DataLoader] 正在获取: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // 缓存结果
      if (useCache) {
        this.cache.set(url, data);
        console.log(`[DataLoader] 已缓存: ${url}`);
      }
      
      return data;
    } catch (error) {
      console.error(`[DataLoader] 加载失败 ${url}:`, error);
      
      // 显示用户友好的错误消息
      this.showErrorMessage(`无法加载内容。请稍后重试。`);
      
      // 返回默认空数据结构以防止崩溃
      return this.getDefaultData(url);
    }
  }

  /**
   * 根据 URL 返回默认的空数据结构
   * @param {string} url - 数据文件的 URL
   * @returns {Object} 默认数据结构
   */
  getDefaultData(url) {
    if (url.includes('projects')) {
      return { projects: [] };
    }
    if (url.includes('moods')) {
      return { moods: [], moodTypes: {} };
    }
    if (url.includes('journal')) {
      return { entries: [] };
    }
    return {};
  }

  /**
   * 显示错误提示消息
   * @param {string} message - 错误消息内容
   */
  showErrorMessage(message) {
    // 创建错误提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast fixed top-20 right-4 z-50 glass-card border-red-500/50 p-4 rounded-xl max-w-sm';
    errorDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fas fa-exclamation-circle text-red-400 text-xl"></i>
        <p class="text-sm text-white">${message}</p>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // 5秒后自动移除
    setTimeout(() => {
      errorDiv.style.opacity = '0';
      errorDiv.style.transition = 'opacity 300ms ease-in-out';
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }

  /**
   * 清除所有缓存数据
   */
  clearCache() {
    this.cache.clear();
    console.log('[DataLoader] 缓存已清除');
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 导出单例实例
const dataLoader = new DataLoader();

// 如果在浏览器环境中，将其添加到 window 对象
if (typeof window !== 'undefined') {
  window.DataLoader = DataLoader;
  window.dataLoader = dataLoader;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DataLoader, dataLoader };
}
