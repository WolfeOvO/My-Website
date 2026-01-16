import './style.css'
import DefaultTheme from 'vitepress/theme'
import SidebarList from '../components/SidebarList.vue'
import Spoiler from '../components/Spoiler.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SidebarList', SidebarList),
    app.component('Spoiler', Spoiler),
    enhanceAppWithTabs(app)
  }
}