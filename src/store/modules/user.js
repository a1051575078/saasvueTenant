import { login, logout, logout1,getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import {filterAsyncRouter} from "@/store/modules/permission";
import getters from "@/store/getters";

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    content:``,
    introduction: '',
    roles:'',
    id:0,
    is_server:0,
    jumplink:'',
    title:'',
    music:'',
    num:0,
    menus:[],
    islogout:'',
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_ID: (state, id) => {
        state.id = id
    },
    SET_CONTENT: (state, content) => {
        state.content = content
    },
    SET_MENUS: (state, menus) => {
        state.menus = menus
    },
    SET_SERVER: (state, is_server) => {
        state.is_server = is_server
    },
    SET_ROUTENUMBER: (state, routenumber) => {
        state.routenumber = routenumber
    },
    SET_JUMPLINK: (state, jumplink) => {
        state.jumplink = jumplink
    },
    SET_TITLE: (state, title) => {
        state.title = title
    },
    SET_MUSIC:(state, music) => {
        state.music = music
    },
    SET_NUM:(state, num) => {
        state.num = num
    },
    SET_ISLOGOUT:(state,islogout)=>{
        state.islogout=islogout
    },
}

const actions = {
    // user login
    login({commit},userInfo){
        const {username,password}=userInfo;
        return new Promise((resolve, reject)=>{
            login({username:username.trim(),password:password})
            .then(response=>{
                const {data}=response;
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve();
            }).catch(error=>{
                reject(error);
            })
        })
    },
    updateavatar({commit},data){
        return new Promise((resolve,reject)=>{
            commit('SET_AVATAR',data.path);
            commit('SET_MUSIC',data.music)
            commit('SET_NUM',data.num)
            resolve();
        })
    },
    updatemenus({ commit }, menus) {
        return new Promise((resolve,reject) => {
            commit('SET_MENUS',menus);
            resolve();
        })
    },
    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
            .then(response => {
                const {data} = response;
                /*if (!data) {
                    reject('验证失败，请重新登录');
                }*/
                //const { roles, name, avatar, introduction } = data;
                const { id,music,deleteday,jumplink,title,roles,name,avatar,content,menus,is_server} = data;
                const routenumber=0;
                if(sessionStorage.getItem('routetag')!=1){
                    sessionStorage.setItem('routetag',0); // 存入一个值
                }
                let num=undefined;
                if(deleteday!==null){
                    num=deleteday;
                }
                commit('SET_ID', id);
                commit('SET_NAME', name);
                commit('SET_ROLES', roles);
                commit('SET_AVATAR',avatar);
                commit('SET_CONTENT',content);
                commit('SET_MENUS', menus)
                commit('SET_SERVER', is_server)
                commit('SET_ROUTENUMBER', routenumber)
                commit('SET_JUMPLINK', jumplink)
                commit('SET_TITLE', title)
                commit('SET_MUSIC', music)
                commit('SET_NUM', num)
                commit('SET_ISLOGOUT','1')
                sessionStorage.setItem('islogout','按钮退出是要清空,然后不触发wss连接');
                //commit('SET_INTRODUCTION', introduction);
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        })
    },
    // user logout
    logout({commit,state,dispatch},client_id){
        return new Promise((resolve,reject) => {
            logout({client_id:client_id}).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', '')
                commit('SET_ISLOGOUT','')
                commit('SET_NAME','')
                commit('SET_MENUS',[])
                commit('SET_ROUTENUMBER',0)
                removeToken();
                resetRouter();
                sessionStorage.removeItem('routetag');
                sessionStorage.removeItem('cantgoclient');
                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delVisitedAll', null, { root: true });
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
    },
    logout1({ commit, state, dispatch },client_id) {
        return new Promise((resolve, reject) => {
            logout1({client_id:client_id}).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', '');
                commit('SET_MENUS',[]);
                commit('SET_ROUTENUMBER',0);
                commit('SET_ISLOGOUT','');
                commit('SET_NAME','')
                removeToken();
                resetRouter();
                sessionStorage.removeItem('routetag');
                sessionStorage.removeItem('cantgoclient');
                dispatch('tagsView/delAllViews', null, { root: true });
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
    },
    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },
    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)
        const { roles } = await dispatch('getInfo')
        resetRouter()
        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
