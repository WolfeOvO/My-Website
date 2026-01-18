// 支持的颜色列表
const SUPPORTED_COLORS = [
  'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink', 'gray',
  'sunset', 'ocean', 'forest', 'fire', 'sky', 'rose', 'mint'
];

// 默认标题（中文）
const DEFAULT_TITLES = {
  tip: '注意',
  info: '信息',
  warning: '警告',
  danger: '危险',
  details: '详情'
};

// 容器类型
const CONTAINER_TYPES = ['tip', 'info', 'warning', 'danger', 'details'];

/**
 * 解析容器信息
 */
function parseContainerInfo(info, type) {
  const trimmed = info.trim();
  const parts = trimmed.split(/\s+/);
  
  let color = null;
  let titleStart = 1;
  
  if (parts.length > 1 && SUPPORTED_COLORS.includes(parts[1])) {
    color = parts[1];
    titleStart = 2;
  }
  
  const customTitle = parts.slice(titleStart).join(' ');
  const title = customTitle || DEFAULT_TITLES[type] || type;
  
  return { color, title };
}

/**
 * 自定义容器颜色插件
 */
export function customContainerColorPlugin(md) {
  CONTAINER_TYPES.forEach(type => {
    const openKey = `container_${type}_open`;
    const closeKey = `container_${type}_close`;
    
    md.renderer.rules[openKey] = function(tokens, idx) {
      const token = tokens[idx];
      const info = token.info || '';
      const { color, title } = parseContainerInfo(info, type);
      
      const colorAttr = color ? ` data-color="${color}"` : '';
      
      if (type === 'details') {
        return `<details class="custom-block details"${colorAttr}>\n<summary>${title}</summary>\n<div class="details-content"><div class="details-inner"><div>\n`;
      } else {
        return `<div class="custom-block ${type}"${colorAttr}>\n<p class="custom-block-title">${title}</p>\n`;
      }
    };
    
    md.renderer.rules[closeKey] = function() {
      if (type === 'details') {
        return '</div></div></div></details>\n';
      } else {
        return '</div>\n';
      }
    };
  });
}

export default customContainerColorPlugin;