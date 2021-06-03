import defaultSettings from '@/settings'

const title = defaultSettings.title || '客服聊天'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
