import './style.css'
import DefaultTheme from 'vitepress/theme'
import Spoiler from '../components/Spoiler.vue'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import GitHubRelease from '../components/GitHubRelease.vue'
import SubSidebar from '../components/SubSidebar.vue'
import { Tabs, Tab, IconTabs, IconTab, Alert, Button } from '../components/vitepress-tabs'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Spoiler', Spoiler),
    enhanceAppWithTabs(app),
    app.component('GitHubRelease', GitHubRelease),
    app.component('SubSidebar', SubSidebar),app.component('Tabs', Tabs),
    app.component('Tab', Tab),
    app.component('IconTabs', IconTabs),
    app.component('IconTab', IconTab),
    app.component('Alert', Alert),
    app.component('VPButton', Button)
  }
}