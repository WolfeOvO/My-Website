let gid = 0

// ══════════════════════════════════════════════════════════════
// Markdown-it 插件
// ══════════════════════════════════════════════════════════════
export function tabbed(md) {
  const orig = md.parse.bind(md)
  md.parse = (src, env) => {
    gid = 0
    return orig(preprocess(src), env)
  }
}

function preprocess(src) {
  const lines = src.split('\n'), out = []
  let i = 0

  while (i < lines.length) {
    const m = lines[i].match(/^(\s*)=== "([^"]+)"\s*$/)
    if (m) {
      const base = m[1].length, tabs = []

      while (i < lines.length) {
        const tm = lines[i].match(/^(\s*)=== "([^"]+)"\s*$/)
        if (tm && tm[1].length === base) {
          const label = tm[2], content = []
          i++
          while (i < lines.length) {
            const nm = lines[i].match(/^(\s*)=== "[^"]+"\s*$/)
            if (nm && nm[1].length <= base) break
            let line = lines[i]
            const indent = base + 4
            if (line.length >= indent && line.slice(0, indent).trim() === '') line = line.slice(indent)
            else if (!line.trim()) line = ''
            content.push(line)
            i++
          }
          while (content.length && !content[0].trim()) content.shift()
          while (content.length && !content.at(-1).trim()) content.pop()
          tabs.push({ label, content: content.join('\n') })
        } else break
      }

      if (tabs.length) {
        out.push(`<div class="vp-tabs" data-id="t${gid++}">`)
        out.push(`<div class="vp-tabs-nav">`)
        tabs.forEach((t, j) => out.push(`<button class="vp-tabs-tab${j ? '' : ' active'}" data-i="${j}">${esc(t.label)}</button>`))
        out.push(`</div>`)
        tabs.forEach((t, j) => out.push(`<div class="vp-tabs-panel${j ? '' : ' active'}" data-i="${j}">`, '', preprocess(t.content), '', `</div>`))
        out.push(`</div>`, '')
      }
    } else { out.push(lines[i]); i++ }
  }
  return out.join('\n')
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

// ══════════════════════════════════════════════════════════════
// 客户端注入（样式 + 交互）
// ══════════════════════════════════════════════════════════════
export function injectTabs() {
  if (typeof window === 'undefined' || window.__VPT__) return
  window.__VPT__ = true

  // 样式 - 仿 vitepress-plugin-tabs
  const css = `
.vp-tabs {
  margin: 16px 0;
}
.vp-tabs-nav {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  border-bottom: 1px solid var(--vp-c-divider);
}
.vp-tabs-tab {
  position: relative;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.25s;
}
.vp-tabs-tab:hover {
  color: var(--vp-c-text-1);
}
.vp-tabs-tab.active {
  color: var(--vp-c-brand-1);
}
.vp-tabs-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 8px;
  right: 8px;
  height: 2px;
  background: var(--vp-c-brand-1);
}
.vp-tabs-panel {
  display: none;
  padding: 16px 0 0;
}
.vp-tabs-panel.active {
  display: block;
}
.vp-tabs-panel > *:first-child {
  margin-top: 0 !important;
}
.vp-tabs-panel > *:last-child {
  margin-bottom: 0 !important;
}
/* 嵌套样式 */
.vp-tabs .vp-tabs {
  margin: 16px 0 0;
}
`
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)

  // 交互
  document.addEventListener('click', e => {
    const btn = e.target.closest('.vp-tabs-tab')
    if (!btn) return
    
    const tabs = btn.closest('.vp-tabs')
    const idx = btn.dataset.i
    const label = btn.textContent

    // 切换当前组
    tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => b.classList.toggle('active', b.dataset.i === idx))
    tabs.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => p.classList.toggle('active', p.dataset.i === idx))

    // 联动：页面内所有相同 label 的 tabs 同步切换
    localStorage.setItem('vp-tabs-' + label, '1')
    document.querySelectorAll('.vp-tabs').forEach(t => {
      if (t === tabs) return
      t.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => {
        if (b.textContent === label) {
          t.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(x => x.classList.toggle('active', x === b))
          t.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => p.classList.toggle('active', p.dataset.i === b.dataset.i))
        }
      })
    })
  })

  // 恢复之前选择的 tab
  function restore() {
    document.querySelectorAll('.vp-tabs').forEach(tabs => {
      tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(btn => {
        if (localStorage.getItem('vp-tabs-' + btn.textContent)) {
          tabs.querySelectorAll(':scope > .vp-tabs-nav > .vp-tabs-tab').forEach(b => b.classList.toggle('active', b === btn))
          tabs.querySelectorAll(':scope > .vp-tabs-panel').forEach(p => p.classList.toggle('active', p.dataset.i === btn.dataset.i))
        }
      })
    })
  }
  
  restore()
  // VitePress SPA 切换后重新恢复
  new MutationObserver(restore).observe(document.body, { childList: true, subtree: true })
}

export default tabbed