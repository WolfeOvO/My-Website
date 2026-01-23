// ==================== AI 声明配置 ====================

// AI 参与类型
const AI_TYPES = {
  generated: { label: 'AI 生成', icon: 'sparkles', desc: '内容由 AI 生成' },
  assisted: { label: 'AI 辅助', icon: 'wand', desc: '内容由 AI 辅助创作' },
  edited: { label: 'AI 编辑', icon: 'pen', desc: '内容经 AI 编辑处理' },
  translated: { label: 'AI 翻译', icon: 'languages', desc: '内容由 AI 翻译' },
  enhanced: { label: 'AI 增强', icon: 'zap', desc: '内容经 AI 增强处理' },
  reviewed: { label: 'AI 审核', icon: 'check', desc: '内容经 AI 审核' },
  summarized: { label: 'AI 摘要', icon: 'file-text', desc: '内容由 AI 生成摘要' },
  transcribed: { label: 'AI 转录', icon: 'mic', desc: '内容由 AI 转录生成' }
};

// 媒体类型
const MEDIA_TYPES = {
  text: { label: '文本', icon: 'text' },
  article: { label: '文章', icon: 'file-text' },
  image: { label: '图片', icon: 'image' },
  audio: { label: '音频', icon: 'headphones' },
  video: { label: '视频', icon: 'video' },
  code: { label: '代码', icon: 'code' },
  music: { label: '音乐', icon: 'music' },
  voice: { label: '语音', icon: 'mic' },
  '3d': { label: '3D 模型', icon: 'box' },
  data: { label: '数据', icon: 'database' }
};

// 常见 AI 模型预设（可选，用户也可以自由填写）
const AI_MODELS_PRESET = {
  // OpenAI
  'gpt-4': { name: 'GPT-4', company: 'OpenAI' },
  'gpt-4o': { name: 'GPT-4o', company: 'OpenAI' },
  'gpt-3.5': { name: 'GPT-3.5', company: 'OpenAI' },
  'dall-e': { name: 'DALL·E', company: 'OpenAI' },
  'dall-e-3': { name: 'DALL·E 3', company: 'OpenAI' },
  'whisper': { name: 'Whisper', company: 'OpenAI' },
  'sora': { name: 'Sora', company: 'OpenAI' },
  // Anthropic
  'claude': { name: 'Claude', company: 'Anthropic' },
  'claude-3': { name: 'Claude 3', company: 'Anthropic' },
  'claude-3.5': { name: 'Claude 3.5', company: 'Anthropic' },
  'claude-4': { name: 'Claude 4', company: 'Anthropic' },
  // Google
  'gemini': { name: 'Gemini', company: 'Google' },
  'gemini-pro': { name: 'Gemini Pro', company: 'Google' },
  'bard': { name: 'Bard', company: 'Google' },
  'imagen': { name: 'Imagen', company: 'Google' },
  // Meta
  'llama': { name: 'LLaMA', company: 'Meta' },
  'llama-3': { name: 'LLaMA 3', company: 'Meta' },
  // 图像生成
  'midjourney': { name: 'Midjourney', company: 'Midjourney' },
  'stable-diffusion': { name: 'Stable Diffusion', company: 'Stability AI' },
  'sdxl': { name: 'SDXL', company: 'Stability AI' },
  'flux': { name: 'Flux', company: 'Black Forest Labs' },
  // 音频
  'elevenlabs': { name: 'ElevenLabs', company: 'ElevenLabs' },
  'suno': { name: 'Suno', company: 'Suno' },
  'udio': { name: 'Udio', company: 'Udio' },
  // 视频
  'runway': { name: 'Runway', company: 'Runway' },
  'pika': { name: 'Pika', company: 'Pika Labs' },
  'kling': { name: 'Kling', company: 'Kuaishou' },
  // 中国
  'qwen': { name: '通义千问', company: 'Alibaba' },
  'ernie': { name: '文心一言', company: 'Baidu' },
  'doubao': { name: '豆包', company: 'ByteDance' },
  'deepseek': { name: 'DeepSeek', company: 'DeepSeek' },
  'kimi': { name: 'Kimi', company: 'Moonshot AI' }
};

// ==================== CC 许可配置 ====================

const CC_LICENSES = {
  // 主要许可证
  'by': {
    name: 'CC BY 4.0',
    fullName: '署名 4.0 国际',
    description: '允许他人分发、混编、调整和基于您的作品创作，包括商业用途，只要署名您为原作者',
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution'],
    url: 'https://creativecommons.org/licenses/by/4.0/',
    badges: ['by']
  },
  'by-sa': {
    name: 'CC BY-SA 4.0',
    fullName: '署名-相同方式共享 4.0 国际',
    description: '允许他人混编、调整和基于您的作品创作，包括商业用途，只要署名并以相同条款许可新作品',
    permissions: ['share', 'adapt', 'commercial'],
    conditions: ['attribution', 'sharealike'],
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    badges: ['by', 'sa']
  },
  'by-nc': {
    name: 'CC BY-NC 4.0',
    fullName: '署名-非商业性使用 4.0 国际',
    description: '允许他人混编、调整和基于您的作品创作非商业用途，新作品需署名但不必以相同条款许可',
    permissions: ['share', 'adapt'],
    conditions: ['attribution', 'noncommercial'],
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    badges: ['by', 'nc']
  },
  'by-nc-sa': {
    name: 'CC BY-NC-SA 4.0',
    fullName: '署名-非商业性使用-相同方式共享 4.0 国际',
    description: '允许他人混编、调整和基于您的作品创作非商业用途，新作品需署名并以相同条款许可',
    permissions: ['share', 'adapt'],
    conditions: ['attribution', 'noncommercial', 'sharealike'],
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    badges: ['by', 'nc', 'sa']
  },
  'by-nd': {
    name: 'CC BY-ND 4.0',
    fullName: '署名-禁止演绎 4.0 国际',
    description: '允许重新分发，包括商业和非商业用途，只要完整传递作品并署名',
    permissions: ['share', 'commercial'],
    conditions: ['attribution', 'noderivatives'],
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    badges: ['by', 'nd']
  },
  'by-nc-nd': {
    name: 'CC BY-NC-ND 4.0',
    fullName: '署名-非商业性使用-禁止演绎 4.0 国际',
    description: '最严格的 CC 许可证，仅允许下载并与他人分享您的作品，需署名且不能改变或用于商业用途',
    permissions: ['share'],
    conditions: ['attribution', 'noncommercial', 'noderivatives'],
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    badges: ['by', 'nc', 'nd']
  },
  // 公共领域工具
  'cc0': {
    name: 'CC0 1.0',
    fullName: '公共领域贡献',
    description: '放弃所有版权和相关权利，作品进入公共领域',
    permissions: ['share', 'adapt', 'commercial'],
    conditions: [],
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    badges: ['zero']
  },
  'pd': {
    name: '公共领域',
    fullName: '公共领域标记',
    description: '此作品已确认属于公共领域，没有已知的版权限制',
    permissions: ['share', 'adapt', 'commercial'],
    conditions: [],
    url: 'https://creativecommons.org/publicdomain/mark/1.0/',
    badges: ['pd']
  }
};

// CC 徽章描述
const CC_BADGES = {
  by: { title: '署名', desc: '必须注明原作者' },
  sa: { title: '相同方式共享', desc: '修改后需以相同许可证发布' },
  nc: { title: '非商业性使用', desc: '不得用于商业目的' },
  nd: { title: '禁止演绎', desc: '不得修改原作品' },
  zero: { title: 'CC0', desc: '放弃所有权利' },
  pd: { title: '公共领域', desc: '无版权限制' }
};

// ==================== SVG 图标 ====================

const ICONS = {
  // AI 相关图标
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  wand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>`,
  pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  languages: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  
  // 媒体类型图标
  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>`,
  'file-text': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  headphones: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  
  // 机器人图标
  robot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>`,
  
  // CC 相关图标
  cc: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm-1-6.5v-3c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v3c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5Zm-4 0v-3c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v3c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5Z"/></svg>`,
  
  // 外部链接
  'external-link': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`
};

// ==================== 工具函数 ====================

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 解析属性字符串
 */
function parseAttributes(attrString) {
  const attrs = {};
  if (!attrString) return attrs;
  
  // 匹配 key="value" 或 key='value' 或 key=value
  const regex = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let match;
  
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? true;
    attrs[key] = value;
  }
  
  return attrs;
}

/**
 * 获取 AI 模型显示名称
 * 支持格式：
 * - 预设快捷键: "gpt-4", "claude-3.5", "midjourney" 等
 * - 自定义名称: "MyModel"
 * - 自定义名称+公司: "MyModel|MyCompany"
 */
function getModelDisplay(modelKey) {
  if (!modelKey) return null;
  
  // 检查是否包含分隔符（支持 | 或 / ）
  if (modelKey.includes('|') || modelKey.includes('/')) {
    const separator = modelKey.includes('|') ? '|' : '/';
    const parts = modelKey.split(separator).map(s => s.trim());
    return {
      name: parts[0] || modelKey,
      company: parts[1] || ''
    };
  }
  
  // 检查预设列表
  const key = modelKey.toLowerCase();
  if (AI_MODELS_PRESET[key]) {
    return AI_MODELS_PRESET[key];
  }
  
  // 未匹配预设，直接使用输入值作为名称
  return { name: modelKey, company: '' };
}

// ==================== 渲染函数 ====================

/**
 * 渲染 AI 声明
 */
function renderAiDeclaration(attrs, md) {
  const media = attrs.media || 'text';
  const model = attrs.model;
  const type = attrs.type || 'generated';
  const text = attrs.text || '';
  
  const typeInfo = AI_TYPES[type] || AI_TYPES.generated;
  const mediaInfo = MEDIA_TYPES[media] || MEDIA_TYPES.text;
  const modelInfo = model ? getModelDisplay(model) : null;
  
  // 获取图标
  const typeIcon = ICONS[typeInfo.icon] || ICONS.sparkles;
  const mediaIcon = ICONS[mediaInfo.icon] || ICONS.text;
  
  // 构建标题
  let title = `${typeInfo.label}`;
  if (modelInfo) {
    title += ` · ${modelInfo.name}`;
  }
  
  // 构建副标题
  let subtitle = `此${mediaInfo.label}${typeInfo.desc.replace('内容', '')}`;
  
  // 渲染附加文本（支持 Markdown）
  let renderedText = '';
  if (text) {
    renderedText = md ? md.renderInline(text) : escapeHtml(text);
  }
  
  return `<div class="license-block ai-declaration" data-type="${escapeHtml(type)}" data-media="${escapeHtml(media)}">
  <div class="license-header">
    <div class="license-icon ai-icon">${ICONS.robot}</div>
    <div class="license-info">
      <div class="license-title">
        <span class="ai-type-badge">${typeIcon}<span>${typeInfo.label}</span></span>
        ${modelInfo ? `<span class="ai-model-badge">${escapeHtml(modelInfo.name)}${modelInfo.company ? `<small>${escapeHtml(modelInfo.company)}</small>` : ''}</span>` : ''}
      </div>
      <div class="license-subtitle">
        <span class="media-type">${mediaIcon}<span>${mediaInfo.label}</span></span>
        <span class="separator">·</span>
        <span>${subtitle}</span>
      </div>
    </div>
  </div>
  ${renderedText ? `<div class="license-text">${renderedText}</div>` : ''}
</div>`;
}

/**
 * 渲染 CC 许可声明
 */
function renderCcDeclaration(attrs, md) {
  const type = (attrs.type || 'by').toLowerCase();
  const text = attrs.text || '';
  
  const license = CC_LICENSES[type] || CC_LICENSES.by;
  
  // 渲染徽章
  const badges = license.badges.map(badge => {
    const info = CC_BADGES[badge];
    return `<span class="cc-badge cc-badge-${badge}" title="${info.title}: ${info.desc}">${badge.toUpperCase()}</span>`;
  }).join('');
  
  // 渲染附加文本（支持 Markdown）
  let renderedText = '';
  if (text) {
    renderedText = md ? md.renderInline(text) : escapeHtml(text);
  }
  
  // 构建许可详情
  const permissions = license.permissions.map(p => {
    const labels = { share: '共享', adapt: '演绎', commercial: '商用' };
    return `<span class="cc-perm cc-perm-yes">${labels[p]}</span>`;
  }).join('');
  
  const conditions = license.conditions.map(c => {
    const labels = {
      attribution: '署名',
      sharealike: '相同方式共享',
      noncommercial: '非商业',
      noderivatives: '禁止演绎'
    };
    return `<span class="cc-cond">${labels[c]}</span>`;
  }).join('');
  
  return `<div class="license-block cc-declaration" data-license="${escapeHtml(type)}">
  <div class="license-header">
    <div class="license-icon cc-icon">
      <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">CC</text></svg>
    </div>
    <div class="license-info">
      <div class="license-title">
        <span class="cc-name">${escapeHtml(license.name)}</span>
        <span class="cc-badges">${badges}</span>
      </div>
      <div class="license-subtitle">${escapeHtml(license.fullName)}</div>
    </div>
    <a href="${license.url}" target="_blank" rel="noopener noreferrer" class="license-link" title="查看完整许可证">
      ${ICONS['external-link']}
    </a>
  </div>
  <div class="license-body">
    <p class="cc-description">${escapeHtml(license.description)}</p>
    <div class="cc-details">
      ${permissions ? `<div class="cc-permissions"><span class="cc-label">允许:</span>${permissions}</div>` : ''}
      ${conditions ? `<div class="cc-conditions"><span class="cc-label">条件:</span>${conditions}</div>` : ''}
    </div>
  </div>
  ${renderedText ? `<div class="license-text">${renderedText}</div>` : ''}
</div>`;
}

// ==================== markdown-it 插件 ====================

/**
 * AI 和 CC 许可声明插件
 */
export function licenseDeclarationPlugin(md) {
  // 匹配自闭合标签: <ai ... /> 或 <cc ... />
  const tagRegex = /<(ai|cc)\s+([^>]*?)\/>/gi;
  
  // 保存原始的 html_block 规则
  const defaultHtmlBlock = md.renderer.rules.html_block || function(tokens, idx) {
    return tokens[idx].content;
  };
  
  // 重写 html_block 规则
  md.renderer.rules.html_block = function(tokens, idx, options, env, self) {
    const content = tokens[idx].content;
    
    // 检查是否包含我们的标签
    if (tagRegex.test(content)) {
      tagRegex.lastIndex = 0; // 重置正则
      return content.replace(tagRegex, (match, tag, attrString) => {
        const attrs = parseAttributes(attrString);
        
        if (tag.toLowerCase() === 'ai') {
          return renderAiDeclaration(attrs, md);
        } else if (tag.toLowerCase() === 'cc') {
          return renderCcDeclaration(attrs, md);
        }
        
        return match;
      });
    }
    
    return defaultHtmlBlock(tokens, idx, options, env, self);
  };
  
  // 同时处理内联 HTML
  const defaultHtmlInline = md.renderer.rules.html_inline || function(tokens, idx) {
    return tokens[idx].content;
  };
  
  md.renderer.rules.html_inline = function(tokens, idx, options, env, self) {
    const content = tokens[idx].content;
    
    if (tagRegex.test(content)) {
      tagRegex.lastIndex = 0;
      return content.replace(tagRegex, (match, tag, attrString) => {
        const attrs = parseAttributes(attrString);
        
        if (tag.toLowerCase() === 'ai') {
          return renderAiDeclaration(attrs, md);
        } else if (tag.toLowerCase() === 'cc') {
          return renderCcDeclaration(attrs, md);
        }
        
        return match;
      });
    }
    
    return defaultHtmlInline(tokens, idx, options, env, self);
  };
}

export default licenseDeclarationPlugin;

// 导出配置供外部使用
export { AI_TYPES, MEDIA_TYPES, AI_MODELS_PRESET, CC_LICENSES, CC_BADGES };