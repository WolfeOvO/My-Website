let gid = 0

export function tabbed(md) {
  // 1. 预处理：把 tab 语法转换成特殊标记（不是 HTML！）
  const origParse = md.parse.bind(md)
  md.parse = (src, env) => {
    gid = 0
    return origParse(preprocess(src), env)
  }

  // 2. 添加自定义 token 规则
  md.block.ruler.before('html_block', 'vp_tabs', vpTabsRule, {
    alt: ['paragraph', 'reference', 'blockquote']
  })

  // 3. 渲染器
  md.renderer.rules.vp_tabs_open = (tokens, idx) => {
    const token = tokens[idx]
    return `<div class="vp-tabs" data-id="${token.meta.id}">\n` +
           `<div class="vp-tabs-nav">\n` +
           token.meta.labels.map((label, i) => 
             `<button class="vp-tabs-tab${i === 0 ? ' active' : ''}" data-i="${i}">${esc(label)}</button>`
           ).join('\n') + '\n' +
           `</div>\n`
  }

  md.renderer.rules.vp_tabs_close = () => `</div>\n`

  md.renderer.rules.vp_tab_open = (tokens, idx) => {
    const token = tokens[idx]
    return `<div class="vp-tabs-panel${token.meta.index === 0 ? ' active' : ''}" data-i="${token.meta.index}">\n`
  }

  md.renderer.rules.vp_tab_close = () => `</div>\n`
}

// 特殊标记的正则
const TABS_OPEN_RE = /^:::vp-tabs\s+id="([^"]+)"\s+labels="([^"]+)"$/
const TABS_CLOSE_RE = /^:::\/vp-tabs$/
const TAB_OPEN_RE = /^:::vp-tab\s+index="(\d+)"$/
const TAB_CLOSE_RE = /^:::\/vp-tab$/

function vpTabsRule(state, startLine, endLine, silent) {
  const startPos = state.bMarks[startLine] + state.tShift[startLine]
  const maxPos = state.eMarks[startLine]
  const lineText = state.src.slice(startPos, maxPos)

  // 检查 tabs 开始
  let match = lineText.match(TABS_OPEN_RE)
  if (match) {
    if (silent) return true
    const token = state.push('vp_tabs_open', 'div', 1)
    token.meta = { id: match[1], labels: match[2].split('|') }
    token.map = [startLine, startLine + 1]
    token.block = true
    state.line = startLine + 1
    return true
  }

  // 检查 tabs 结束
  if (TABS_CLOSE_RE.test(lineText)) {
    if (silent) return true
    const token = state.push('vp_tabs_close', 'div', -1)
    token.block = true
    state.line = startLine + 1
    return true
  }

  // 检查 tab 开始
  match = lineText.match(TAB_OPEN_RE)
  if (match) {
    if (silent) return true
    const token = state.push('vp_tab_open', 'div', 1)
    token.meta = { index: parseInt(match[1]) }
    token.map = [startLine, startLine + 1]
    token.block = true
    state.line = startLine + 1
    return true
  }

  // 检查 tab 结束
  if (TAB_CLOSE_RE.test(lineText)) {
    if (silent) return true
    const token = state.push('vp_tab_close', 'div', -1)
    token.block = true
    state.line = startLine + 1
    return true
  }

  return false
}

function preprocess(src) {
  const lines = src.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    if (lines[i].trim() === '<!-- tabs:start -->') {
      i++
      
      // 收集 tabs 信息
      const items = []
      let currentItem = null
      
      while (i < lines.length && lines[i].trim() !== '<!-- tabs:end -->') {
        const tabMatch = lines[i].match(/^=== "([^"]+)"(?: @(\d+))?\s*$/)
        
        if (tabMatch) {
          if (currentItem) {
            cleanLines(currentItem.contentLines)
            items.push(currentItem)
          }
          currentItem = {
            label: tabMatch[1],
            level: parseInt(tabMatch[2] || '1'),
            contentLines: []
          }
        } else if (currentItem) {
          currentItem.contentLines.push(lines[i])
        }
        i++
      }
      
      if (currentItem) {
        cleanLines(currentItem.contentLines)
        items.push(currentItem)
      }
      
      // 跳过 <!-- tabs:end -->
      if (i < lines.length && lines[i].trim() === '<!-- tabs:end -->') {
        i++
      }
      
      // 生成特殊标记（不是 HTML！）
      if (items.length > 0) {
        out.push(...buildNestedMarkers(items, 0, items.length, 1))
      }
    } else {
      out.push(lines[i])
      i++
    }
  }
  
  return out.join('\n')
}

function cleanLines(arr) {
  while (arr.length && !arr[0].trim()) arr.shift()
  while (arr.length && !arr.at(-1)?.trim()) arr.pop()
}

function buildNestedMarkers(items, start, end, targetLevel) {
  const tabs = []
  let i = start
  
  while (i < end) {
    if (items[i].level === targetLevel) {
      const tab = {
        label: items[i].label,
        contentLines: items[i].contentLines.slice(),
        childMarkers: []
      }
      
      // 找嵌套范围
      let childStart = i + 1
      let childEnd = childStart
      while (childEnd < end && items[childEnd].level > targetLevel) {
        childEnd++
      }
      
      if (childEnd > childStart) {
        tab.childMarkers = buildNestedMarkers(items, childStart, childEnd, targetLevel + 1)
      }
      
      tabs.push(tab)
      i = childEnd
    } else {
      i++
    }
  }
  
  if (tabs.length === 0) return []
  
  const id = `t${gid++}`
  const labels = tabs.map(t => t.label).join('|')
  const result = []
  
  // 输出特殊标记（这些会被 vpTabsRule 识别）
  result.push(`:::vp-tabs id="${id}" labels="${labels}"`)
  
  tabs.forEach((tab, index) => {
    result.push(`:::vp-tab index="${index}"`)
    
    // 内容（不在开头加空行，避免生成空段落）
    if (tab.contentLines.length > 0) {
      result.push(...tab.contentLines)
    }
    
    // 嵌套的 tabs
    if (tab.childMarkers.length > 0) {
      result.push(...tab.childMarkers)
    }
    
    result.push(`:::/vp-tab`)
  })
  
  result.push(`:::/vp-tabs`)
  
  return result
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ══════════════════════════════════════════════════════════════
// 客户端（保持不变）
// ══════════════════════════════════════════════════════════════
export function injectTabs() {
  if (typeof window === 'undefined' || window.__VPT__) return
  window.__VPT__ = true

  document.head.insertAdjacentHTML('beforeend', `<style>
.vp-tabs { margin: 16px 0; }
.vp-tabs-nav { display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--vp-c-divider); }
.vp-tabs-tab { position: relative; padding: 8px 12px; font-size: 14px; font-weight: 500; line-height: 24px; color: var(--vp-c-text-2); background: transparent; border: none; cursor: pointer; transition: color 0.25s; }
.vp-tabs-tab:hover { color: var(--vp-c-text-1); }
.vp-tabs-tab.active { color: var(--vp-c-brand-1); }
.vp-tabs-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 8px; right: 8px; height: 2px; background: var(--vp-c-brand-1); }
.vp-tabs-panel { display: none; padding: 16px 0 0; }
.vp-tabs-panel.active { display: block; }
.vp-tabs-panel > *:first-child { margin-top: 0 !important; }
.vp-tabs-panel > *:last-child { margin-bottom: 0 !important; }
.vp-tabs .vp-tabs { margin: 16px 0 0; }
</style>`)

  function getKey(tabs) {
    return 'vp-tabs-' + Array.from(tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab'))
      .map(b => b.textContent).join('|')
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.vp-tabs-tab')
    if (!btn) return
    const tabs = btn.closest('.vp-tabs')
    const idx = btn.dataset.i
    const label = btn.textContent
    const key = getKey(tabs)

    tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => b.classList.toggle('active', b.dataset.i === idx))
    tabs.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => p.classList.toggle('active', p.dataset.i === idx))
    sessionStorage.setItem(key, label)

    // 同步页面中其他相同key的tab组
    document.querySelectorAll('.vp-tabs').forEach(t => {
      if (t === tabs || getKey(t) !== key) return
      t.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => b.classList.toggle('active', b.textContent === label))
      t.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => {
        const m = t.querySelector(`:scope > .vp-tabs-nav > .vp-tabs-tab[data-i="${p.dataset.i}"]`)
        p.classList.toggle('active', m?.textContent === label)
      })
    })
  })

  function restore() {
    document.querySelectorAll('.vp-tabs').forEach(tabs => {
      const saved = sessionStorage.getItem(getKey(tabs))
      if (!saved) return
      tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => b.classList.toggle('active', b.textContent === saved))
      tabs.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => {
        const m = tabs.querySelector(`:scope > .vp-tabs-nav > .vp-tabs-tab[data-i="${p.dataset.i}"]`)
        p.classList.toggle('active', m?.textContent === saved)
      })
    })
  }
  restore()
  new MutationObserver(restore).observe(document.body, { childList: true, subtree: true })
}

export default tabbed