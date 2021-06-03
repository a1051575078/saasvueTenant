import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import config from "@/config";
import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css';
import i18n from "./i18n/i18n";

Vue.use(Viewer);
Viewer.setDefaults({
    Options: {
        'inline':true,// 启用 inline 模式
        'button':true,// 显示右上角关闭按钮
        'navbar':true,// 显示缩略图导航
        'title':true,// 显示当前图片的标题
        'toolbar':true,// 显示工具栏
        'tooltip':true,// 显示缩放百分比
        'movable':true,// 图片是否可移动
        'zoomable':true,// 图片是否可缩放
        'rotatable':true,// 图片是否可旋转
        'scalable':true,// 图片是否可翻转
        'transition':true,// 使用 CSS3 过度
        'fullscreen':true,// 播放时是否全屏
        'keyboard':true,// 是否支持键盘
        'url':'data-source'//设置大图片的 url
    }
})
import * as filters from './filters' // global filters
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/*if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}*/
import VueCookies from 'vue-cookies'; //cookie
Vue.use(VueCookies); //注册到全局
Vue.prototype.config=config;
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})
