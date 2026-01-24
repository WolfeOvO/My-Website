let gid = 0
let pendingContents = new Map() // 存储待渲染的内容

export function tabbed(md) {
  // Hook parse：预处理阶段收集 tabs，生成占位符
  const origParse = md.parse.bind(md)
  md.parse = (src, env) => {
    gid = 0
    pendingContents.clear()
    const processed = preprocess(src)
    return origParse(processed, env)
  }

  // Hook render：渲染后替换占位符
  const origRender = md.render.bind(md)
  md.render = (src, env) => {
    const html = origRender(src, env)
    // 替换所有占位符
    return html.replace(/<!--TAB_CONTENT_(\w+)-->/g, (_, id) => {
      const content = pendingContents.get(id)
      if (!content) return ''
      // 用新的 parse+render 处理 tab 内容（此时 pendingContents 已清空该项，避免递归）
      pendingContents.delete(id)
      const tokens = origParse(content, env || {})
      return md.renderer.render(tokens, md.options, env || {})
    })
  }
}

function preprocess(src) {
  const lines = src.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    if (lines[i].trim() === '<!-- tabs:start -->') {
      i++
      
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
      
      if (i < lines.length && lines[i].trim() === '<!-- tabs:end -->') {
        i++
      }
      
      if (items.length > 0) {
        out.push(buildNestedTabs(items, 0, items.length, 1))
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

function generateId() {
  return 'c' + Math.random().toString(36).slice(2, 10)
}

function buildNestedTabs(items, start, end, targetLevel) {
  const tabs = []
  let i = start
  
  while (i < end) {
    if (items[i].level === targetLevel) {
      const tab = {
        label: items[i].label,
        contentLines: items[i].contentLines.slice(),
        childItems: []
      }
      
      let childStart = i + 1
      let childEnd = childStart
      while (childEnd < end && items[childEnd].level > targetLevel) {
        childEnd++
      }
      
      if (childEnd > childStart) {
        for (let j = childStart; j < childEnd; j++) {
          tab.childItems.push(items[j])
        }
      }
      
      tabs.push(tab)
      i = childEnd
    } else {
      i++
    }
  }
  
  if (tabs.length === 0) return ''
  
  const tabId = gid++
  
  let html = `<div class="vp-tabs" data-id="t${tabId}">\n`
  html += `<div class="vp-tabs-nav">\n`
  tabs.forEach((t, j) => {
    html += `<button class="vp-tabs-tab${j ? '' : ' active'}" data-i="${j}">${esc(t.label)}</button>\n`
  })
  html += `</div>\n`
  
  tabs.forEach((t, j) => {
    html += `<div class="vp-tabs-panel${j ? '' : ' active'}" data-i="${j}">\n`
    
    // 使用占位符，内容稍后渲染
    const contentMd = t.contentLines.join('\n').trim()
    if (contentMd) {
      const contentId = generateId()
      pendingContents.set(contentId, contentMd)
      html += `<!--TAB_CONTENT_${contentId}-->\n`
    }
    
    // 递归处理子 tabs
    if (t.childItems.length > 0) {
      const childHtml = buildNestedTabs(t.childItems, 0, t.childItems.length, targetLevel + 1)
      html += childHtml + '\n'
    }
    
    html += `</div>\n`
  })
  html += `</div>\n`
  
  return html
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ═══════════════════════════════════════════════════════════════
// 客户端
// ═══════════════════════════════════════════════════════════════
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
.vp-tabs-panel > *:first-child { margin-top: 0 !important; border-top: none !important; padding-top: 0 !important; }
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