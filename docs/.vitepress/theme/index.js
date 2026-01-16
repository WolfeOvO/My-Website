import './style.css'
import DefaultTheme from 'vitepress/theme'
import SidebarList from '../components/SidebarList.vue'
import Spoiler from '../components/Spoiler.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SidebarList', SidebarList),
    app.component('Spoiler', Spoiler)
  }
}