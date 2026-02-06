/**
 * Export Service
 * 将日志数据导出为 JSON 文件
 * Feature: journal-editor-enhancement
 * Requirements: 3.2, 3.3, 3.4
 */

class ExportService {
  /**
   * 导出日志为 JSON 文件
   * @param {Object} journalEntry - 日志对象
   * @returns {boolean} 是否导出成功
   */
  exportToJSON(journalEntry) {
    try {
      // 验证日志对象
      if (!journalEntry || typeof journalEntry !== 'object') {
        throw new Error('无效的日志对象');
      }

      // 转换为 JSON 字符串（格式化输出，便于阅读）
      const jsonContent = JSON.stringify(journalEntry, null, 2);
      
      // 生成文件名
      const filename = this.generateFilename();

      // 检查浏览器支持
      if (this.isBlobSupported()) {
        this.triggerDownload(jsonContent, filename);
        return true;
      } else {
        // 降级方案：在新窗口显示 JSON
        this.showJSONInNewWindow(jsonContent);
        return true;
      }
    } catch (error) {
      console.error('[ExportService] 导出失败:', error);
      return false;
    }
  }

  /**
   * 生成文件名
   * @returns {string} 格式：journal-YYYY-MM-DD-HHmmss.json
   */
  generateFilename() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `journal-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`;
  }

  /**
   * 触发浏览器下载
   * @param {string} content - JSON 字符串
   * @param {string} filename - 文件名
   */
  triggerDownload(content, filename) {
    try {
      // 创建 Blob 对象
      const blob = new Blob([content], { type: 'application/json' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      
      // 创建临时 <a> 元素并触发下载
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      
      // 延迟释放 URL 对象，确保下载完成
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('[ExportService] 触发下载失败:', error);
      throw error;
    }
  }

  /**
   * 检查浏览器是否支持 Blob API
   * @returns {boolean}
   */
  isBlobSupported() {
    try {
      return !!(window.Blob && window.URL && window.URL.createObjectURL);
    } catch (error) {
      return false;
    }
  }

  /**
   * 在新窗口显示 JSON（降级方案）
   * @param {string} content - JSON 字符串
   */
  showJSONInNewWindow(content) {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>日志导出 - 请手动复制</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
              background: #050505;
              color: #fff;
            }
            pre {
              background: #1a1a1a;
              padding: 20px;
              border-radius: 8px;
              overflow: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .hint {
              color: #888;
              margin-bottom: 10px;
            }
            button {
              background: linear-gradient(to right, #6366f1, #a855f7);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              margin-bottom: 20px;
            }
            button:hover {
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <p class="hint">您的浏览器不支持自动下载，请手动复制以下内容保存：</p>
          <button onclick="copyToClipboard()">复制到剪贴板</button>
          <pre id="json-content">${content}</pre>
          <script>
            function copyToClipboard() {
              const content = document.getElementById('json-content').textContent;
              navigator.clipboard.writeText(content).then(() => {
                alert('已复制到剪贴板！');
              }).catch(err => {
                console.error('复制失败:', err);
              });
            }
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert('无法打开新窗口，请检查浏览器弹窗设置');
    }
  }

  /**
   * 验证 JSON 往返一致性（用于测试）
   * @param {Object} original - 原始对象
   * @returns {boolean} 是否一致
   */
  validateRoundTrip(original) {
    try {
      const json = JSON.stringify(original);
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed) === json;
    } catch (error) {
      return false;
    }
  }
}

// 导出到全局作用域（浏览器环境）
if (typeof window !== 'undefined') {
  window.ExportService = ExportService;
  window.exportService = new ExportService();
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExportService };
}
