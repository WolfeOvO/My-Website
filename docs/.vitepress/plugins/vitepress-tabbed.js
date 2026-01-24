let gid = 0

export function tabbed(md) {
  const orig = md.parse.bind(md)
  md.parse = (src, env) => {
    gid = 0
    return orig(preprocess(src), env)
  }
}

function preprocess(src) {
  const lines = src.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    // 检测 tabs 开始
    if (lines[i].trim() === '<!-- tabs:start -->') {
      i++
      
      // 收集这组 tabs 的所有标记和内容
      const items = []  // { label, level, contentLines }
      let currentItem = null
      
      while (i < lines.length && lines[i].trim() !== '<!-- tabs:end -->') {
        const tabMatch = lines[i].match(/^=== "([^"]+)"(?: @(\d+))?\s*$/)
        
        if (tabMatch) {
          // 保存之前的 item
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
      
      // 保存最后一个 item
      if (currentItem) {
        cleanLines(currentItem.contentLines)
        items.push(currentItem)
      }
      
      // 跳过 <!-- tabs:end -->
      if (i < lines.length && lines[i].trim() === '<!-- tabs:end -->') {
        i++
      }
      
      // 构建嵌套结构并渲染
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

function buildNestedTabs(items, start, end, targetLevel) {
  const tabs = []
  let i = start
  
  while (i < end) {
    if (items[i].level === targetLevel) {
      const tab = {
        label: items[i].label,
        contentBefore: [],  // 子 tabs 之前的内容
        contentAfter: [],   // 子 tabs 之后的内容（一般没有）
        childrenHtml: ''
      }
      
      // 找这个 tab 下的嵌套 tabs 范围
      let childStart = i + 1
      let childEnd = childStart
      while (childEnd < end && items[childEnd].level > targetLevel) {
        childEnd++
      }
      
      if (childEnd > childStart) {
        // 有嵌套的 tabs
        // 找到第一个子 tab 的位置，它之前的内容属于父 tab
        let firstChildIdx = childStart
        while (firstChildIdx < childEnd && items[firstChildIdx].level !== targetLevel + 1) {
          firstChildIdx++
        }
        
        // 当前 tab 自己的内容（在子 tabs 之前）
        tab.contentBefore = items[i].contentLines.slice()
        
        // 递归构建子 tabs
        tab.childrenHtml = buildNestedTabs(items, childStart, childEnd, targetLevel + 1)
      } else {
        // 没有嵌套，所有内容都是当前 tab 的
        tab.contentBefore = items[i].contentLines.slice()
      }
      
      tabs.push(tab)
      i = childEnd
    } else {
      i++
    }
  }
  
  if (tabs.length === 0) return ''
  
  // 渲染这一层
  let html = `<div class="vp-tabs" data-id="t${gid++}">\n`
  html += `<div class="vp-tabs-nav">\n`
  tabs.forEach((t, j) => {
    html += `<button class="vp-tabs-tab${j ? '' : ' active'}" data-i="${j}">${esc(t.label)}</button>\n`
  })
  html += `</div>\n`
  tabs.forEach((t, j) => {
    // ✅ 关键修改：只用一个换行，不要空行
    html += `<div class="vp-tabs-panel${j ? '' : ' active'}" data-i="${j}">\n`
    // 先渲染内容（在子 tabs 之前）
    const beforeContent = t.contentBefore.join('\n').trim()
    if (beforeContent) {
      html += beforeContent + '\n'
    }
    // 再渲染子 tabs
    if (t.childrenHtml) {
      html += t.childrenHtml + '\n'
    }
    html += `</div>\n`
  })
  html += `</div>\n`
  
  return html
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ══════════════════════════════════════════════════════════════
// 客户端
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