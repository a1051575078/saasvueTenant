import { asyncRoutes, constantRoutes } from '@/router'
import Layout from "@/layout/index";
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []
    
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    
    return res
}
export // 遍历后台传来的路由字符串，转换为组件对象
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
const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes =routes
    },
}
const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            let accessedRoutes
            if (roles.includes('admin')) {
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    },
    menus({ commit }, menus) {
        return new Promise(resolve => {
            menus = filterAsyncRouter(menus)
            commit('SET_ROUTES', menus)
            resolve(menus)
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
