import './style.css'
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// 组件
import Spoiler from '../components/Spoiler.vue'
import GitHubRelease from '../components/GitHubRelease.vue'
import NotionTags from '../components/NotionTags.vue'
import LinkCard from '../components/LinkCard.vue'
import Sidebar from '../components/SidebarDirectory.vue'

// 插件
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import { injectTabs } from '../plugins/vitepress-tabbed.js'
import { setupDetailsAnimation } from '../plugins/detailsAnimation.js'

export default {
  extends: DefaultTheme,
  
  enhanceApp({ app }) {
    // 注册插件
    injectTabs()
    enhanceAppWithTabs(app)
    
    // 注册组件
    app.component('sp', Spoiler)
    app.component('gtl', GitHubRelease)
    app.component('ntags', NotionTags)
    app.component('lc', LinkCard)
    app.component('sidebar', Sidebar)
  },
  
  setup() {
    const route = useRoute()
    
    onMounted(() => {
      // 初始化 details 动画
      setupDetailsAnimation()
      
      // 初始化脚注
      initFootnotes()
    })
    
    // 路由变化时重新初始化脚注
    watch(() => route.path, () => {
      // 等待 DOM 更新
      setTimeout(initFootnotes, 100)
    })
  }
}

// 脚注初始化函数
function initFootnotes() {
  const footnoteLinks = document.querySelectorAll('.footnote-link')
  
  footnoteLinks.forEach(link => {
    // 避免重复绑定
    if (link.dataset.footnoteInit) return
    link.dataset.footnoteInit = 'true'
    
    const footnoteId = link.getAttribute('href')?.substring(1)
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