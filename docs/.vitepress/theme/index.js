import './style.css'
import DefaultTheme from 'vitepress/theme'
import Spoiler from '../components/Spoiler.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import GitHubRelease from '../components/GitHubRelease.vue'
import SubSidebar from '../components/SubSidebar.vue'
import { injectTabs } from '../plugins/vitepress-tabbed.js'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    // 注册组件
    app.component('Spoiler', Spoiler)
    enhanceAppWithTabs(app)
    app.component('GitHubRelease', GitHubRelease)
    app.component('SubSidebar', SubSidebar)
    injectTabs()
    
    // 脚注功能
    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        initFootnotes()
      }
    }
  }
}

// 脚注初始化函数
function initFootnotes() {
  const footnoteLinks = document.querySelectorAll('.footnote-link')
  
  footnoteLinks.forEach(link => {
    const footnoteNum = link.getAttribute('data-footnote')
    const footnoteId = link.getAttribute('href').substring(1)
    const footnoteContent = document.getElementById(footnoteId)
    
    if (!footnoteContent) return
    
    const text = footnoteContent.querySelector('p')?.innerText || ''
    
    // 创建 tooltip
    const tooltip = document.createElement('div')
    tooltip.className = 'footnote-tooltip'
    tooltip.innerHTML = text
    
    // 桌面端：悬停显示
    link.addEventListener('mouseenter', (e) => {
      if (window.innerWidth > 768) {
        document.body.appendChild(tooltip)
        const rect = link.getBoundingClientRect()
        tooltip.style.left = rect.left + 'px'
        tooltip.style.top = (rect.bottom + 5) + 'px'
        tooltip.classList.add('visible')
      }
    })
    
    link.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible')
      setTimeout(() => tooltip.remove(), 200)
    })
    
    // 移动端：点击显示
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        document.body.appendChild(tooltip)
        const rect = link.getBoundingClientRect()
        tooltip.style.left = '10px'
        tooltip.style.right = '10px'
        tooltip.style.top = (rect.bottom + 5) + 'px'
        tooltip.classList.add('visible')
        
        // 点击其他地方关闭
        setTimeout(() => {
          document.addEventListener('click', function closeTooltip(e) {
            if (!tooltip.contains(e.target) && e.target !== link) {
              tooltip.classList.remove('visible')
              setTimeout(() => tooltip.remove(), 200)
              document.removeEventListener('click', closeTooltip)
            }
          })
        }, 100)
      }
    })
  })
}