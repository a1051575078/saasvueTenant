import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from "@/layout"
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    if(to.path==='/chat'){
        if(sessionStorage.getItem('cantgoclient')){
            return next('/home');
        }
        sessionStorage.setItem('client','user');
        return next();
    }
    if(sessionStorage.getItem('client')){
        return next('/chat');
    }
    // start progress bar
    NProgress.start();
    // set page title
    document.title = getPageTitle(to.meta.title)
    //determine whether the user has logged in
    const hasToken = getToken();
    if (hasToken) {
        if (to.path === '/login'){
            // if is logged in, redirect to the home page
            next({ path:'/'});
            NProgress.done(); //hack:https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasGetUserInfo = store.getters.name;
            if (hasGetUserInfo){
                if(sessionStorage.getItem('routetag')==0){
                    sessionStorage.setItem('routetag',1);
                    next(store.getters.menus[0].redirect);
                }else{
                    next();
                }
            } else {
                try {
                    await store.dispatch('user/getInfo')
                    .then(res=>{
                        //const menus=store.getters.menus;
                        if (res.menus.length < 1) {
                            global.antRouter = []
                            next();
                        }
                        sessionStorage.setItem('routetag',0);
                        let obj={};
                        obj.path='*';
                        obj.redirect='/404';
                        obj.hidden=true;
                        res.menus.push(obj)
                        //const menus = filterAsyncRouter(res.menus)
                        store.dispatch('permission/menus',res.menus)
                        .then(res=>{
                            store.dispatch('user/updatemenus',res);
                            router.addRoutes(res);
                            global.antRouter=res;
                            next({ ...to,replace:true});
                        });
                    })
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    /*const { roles }=await store.dispatch('user/getInfo');
                    // generate accessible routes map based on roles
                    const accessRoutes = await store.dispatch('permission/generateRoutes',roles);
                    // dynamically add accessible routes
                    router.addRoutes(accessRoutes);
                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({ ...to, replace: true });*/
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done();
                }
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
})
router.afterEach(() => {
    // finish progress bar
    NProgress.done();
})
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component){
            if (route.component==='Layout') {
                route.component=Layout
            } else {
                route.component = _import(route.component) // 导入组件
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true;
    })
    return accessedRouters;
}