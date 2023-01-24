export type Theme = 'dark' | 'light'

export type NavMode = 'inline' | 'horizontal'

export interface Setting {
  siteTitle: string
  siteTokenKey: string
  tokenKey: string
  noAuthUrl: string[]
  headFixed: boolean
  theme: Theme
  leftSidebar: boolean
  tabNavEnable: boolean
  tabNavHomePath: string
  navMode: NavMode
}
