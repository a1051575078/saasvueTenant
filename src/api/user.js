import request from '@/utils/request'

export function reset(data){
    return request({
        url:'/reset-pwd',
        method:'post',
        data
    });
}
export function getUser(){
    return request({
        url:'/get-user',
        method:'get'
    });
}
export function updateUser(data){
    return request({
        url:'/user-update',
        method:'post',
        data
    });
}
export function addUser(data){
    return request({
        url:'/user',
        method:'post',
        data
    });
}
export function delUser(data){
    return request({
        url:'/user-del-many',
        method:'post',
        data
    });
}
export function login(data) {
    return request({
        url: '/login',
        method:'post',
        data
    })
}
export function getInfo(token) {
    return request({
        url: '/user-info',
        method: 'get',
        params: { token }
    })
}
export function logout(data) {
    return request({
        url: '/logout',
        method: 'post',
        data
    })
}
export function logout1(data) {
    return request({
        url: '/logout1',
        method: 'post',
        data
    })
}
