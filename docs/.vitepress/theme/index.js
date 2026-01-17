import './style.css'
import DefaultTheme from 'vitepress/theme'
import Spoiler from '../components/Spoiler.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import GitHubRelease from '../components/GitHubRelease.vue'
import SubSidebar from '../components/SubSidebar.vue'
import { injectTabs } from '../plugins/vitepress-tabbed.js'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Spoiler', Spoiler)
    enhanceAppWithTabs(app)
    app.component('GitHubRelease', GitHubRelease)
    app.component('SubSidebar', SubSidebar)
    injectTabs()
  }
}