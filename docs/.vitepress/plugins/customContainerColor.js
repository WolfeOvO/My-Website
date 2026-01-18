// 支持的颜色列表
const SUPPORTED_COLORS = [
  // 纯色
  'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink', 'gray',
  // 渐变色
  'sunset', 'ocean', 'forest', 'fire', 'sky', 'rose', 'mint'
];

// 容器类型
const CONTAINER_TYPES = ['tip', 'info', 'warning', 'danger', 'details'];

/**
 * 解析容器信息
 * @param {string} info - 容器信息字符串，如 "tip red 自定义标题"
 * @returns {Object} - { type, color, title }
 */
function parseContainerInfo(info) {
  const trimmed = info.trim();
  const parts = trimmed.split(/\s+/);
  
  const type = parts[0] || '';
  let color = null;
  let titleStart = 1;
  
  // 检查第二部分是否是颜色
  if (parts.length > 1 && SUPPORTED_COLORS.includes(parts[1])) {
    color = parts[1];
    titleStart = 2;
  }
  
  const title = parts.slice(titleStart).join(' ');
  
  return { type, color, title };
}

/**
 * 自定义容器颜色插件
 * @param {MarkdownIt} md - markdown-it 实例
 */
export function customContainerColorPlugin(md) {
  // 保存原始渲染函数
  const originalRenders = {};
  
  CONTAINER_TYPES.forEach(type => {
    const openKey = `container_${type}_open`;
    const closeKey = `container_${type}_close`;
    
    // 保存原始渲染器
    originalRenders[openKey] = md.renderer.rules[openKey];
    originalRenders[closeKey] = md.renderer.rules[closeKey];
    
    // 重写开始标签渲染器
    md.renderer.rules[openKey] = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      const info = token.info || '';
      const { color, title } = parseContainerInfo(info);
      
      // 构建属性
      const colorAttr = color ? ` data-color="${color}"` : '';
      
      if (type === 'details') {
        // Details 特殊处理 - 带动画包裹结构
        const summaryTitle = title || 'Details';
        return `<details class="custom-block details"${colorAttr}>\n<summary>${summaryTitle}</summary>\n<div class="details-content"><div class="details-inner"><div>\n`;
      } else {
        // tip/info/warning/danger
        const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
        return `<div class="custom-block ${type}"${colorAttr}>\n<p class="custom-block-title">${displayTitle}</p>\n`;
      }
    };
    
    // 重写结束标签渲染器
    md.renderer.rules[closeKey] = function(tokens, idx, options, env, self) {
      if (type === 'details') {
        return '</div></div></div></details>\n';
      } else {
        return '</div>\n';
      }
    };
  });
}

export default customContainerColorPlugin;