/**
 * Markdown Parser Service
 * 将 Markdown 语法转换为 HTML，支持标题、加粗和列表
 * Feature: journal-editor-enhancement
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

class MarkdownParser {
  /**
   * 解析 Markdown 文本为 HTML
   * @param {string} markdown - 原始 Markdown 文本
   * @returns {string} 格式化的 HTML 字符串
   */
  parse(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return '';
    }

    try {
      const lines = markdown.split('\n');
      const result = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        
        try {
          // 检查是否是列表项
          if (this.isListItem(line)) {
            const listItems = [];
            while (i < lines.length && this.isListItem(lines[i])) {
              listItems.push(lines[i]);
              i++;
            }
            result.push(this.parseList(listItems));
            continue;
          }

          // 检查是否是标题
          const heading = this.parseHeading(line);
          if (heading !== line) {
            result.push(heading);
            i++;
            continue;
          }

          // 处理普通文本（可能包含加粗）
          const parsed = this.parseBold(line);
          if (parsed.trim()) {
            result.push(`<p class="leading-relaxed text-white/80">${parsed}</p>`);
          } else {
            result.push('<br>');
          }
        } catch (lineError) {
          // 单行解析失败时，按原文显示该行
          if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            console.warn('[MarkdownParser] 行解析警告 (第 ' + (i + 1) + ' 行):', lineError.message);
          }
          result.push(`<p class="leading-relaxed text-white/80">${this.escapeHtml(line)}</p>`);
        }
        i++;
      }

      return result.join('\n');
    } catch (error) {
      // 整体解析失败时，返回原文本
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.warn('[MarkdownParser] 解析错误:', error);
      }
      return this.escapeHtml(markdown); // 容错：返回转义后的原文本
    }
  }

  /**
   * 转义 HTML 特殊字符
   * @param {string} text - 原始文本
   * @returns {string} 转义后的文本
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 检查是否是列表项
   * @param {string} line - 单行文本
   * @returns {boolean}
   */
  isListItem(line) {
    return /^[\s]*[-*]\s+.+/.test(line);
  }

  /**
   * 解析标题语法 (# ## ###)
   * @param {string} line - 单行文本
   * @returns {string} HTML 标题标签或原文本
   */
  parseHeading(line) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) {
      return line;
    }

    const level = match[1].length;
    const text = this.parseBold(match[2]);
    
    // 根据标题级别应用不同的 Tailwind 样式
    const styles = {
      1: 'text-3xl font-bold tracking-tighter text-white mb-4',
      2: 'text-2xl font-bold tracking-tighter text-white mb-3',
      3: 'text-xl font-semibold tracking-tight text-white mb-2',
      4: 'text-lg font-semibold text-white mb-2',
      5: 'text-base font-semibold text-white mb-1',
      6: 'text-sm font-semibold text-white/90 mb-1'
    };

    return `<h${level} class="${styles[level]}">${text}</h${level}>`;
  }

  /**
   * 解析加粗语法 (**text** 或 __text__)
   * @param {string} text - 文本内容
   * @returns {string} 包含 <strong> 标签的 HTML
   */
  parseBold(text) {
    // 处理 **text** 语法
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // 处理 __text__ 语法
    text = text.replace(/__(.+?)__/g, '<strong class="font-bold text-white">$1</strong>');
    return text;
  }

  /**
   * 解析列表语法 (- 或 *)
   * @param {string[]} lines - 文本行数组
   * @returns {string} HTML 列表标签
   */
  parseList(lines) {
    const items = lines.map(line => {
      const match = line.match(/^[\s]*[-*]\s+(.+)$/);
      if (match) {
        const content = this.parseBold(match[1]);
        return `<li class="text-white/80 leading-relaxed">${content}</li>`;
      }
      return '';
    }).filter(item => item);

    return `<ul class="list-disc list-inside space-y-1 mb-4">${items.join('\n')}</ul>`;
  }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
  window.MarkdownParser = MarkdownParser;
}

// 如果在 Node.js 环境中（用于测试），导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarkdownParser };
}
