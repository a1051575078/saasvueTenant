import request from '@/utils/request';
export function infiniteScroll(data) {
    return request({
        url:'/infinite-scroll',
        method:'post',
        data
    });
}
export function sendPic(data) {
    return request({
        url:'/sendPic',
        method:'post',
        data
    });
}
export function disconnect(data){
    return request({
        url:'/disconnect',
        method:'post',
        data
    })
}
export function tell(data){
    return request({
        url:'/tell',
        method:'post',
        data
    });
}
export function sendMsg(data){
    return request({
        url:'/send-msg',
        method:'post',
        data
    })
}
export function bind(data){
    return request({
        url:'/bind',
        method:'post',
        data
    });
}