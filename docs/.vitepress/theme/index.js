import DefaultTheme from 'vitepress/theme'
import SidebarList from '../components/SidebarList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SidebarList', SidebarList)
  }
}