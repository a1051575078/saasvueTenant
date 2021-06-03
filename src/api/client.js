import request from '@/utils/request';

export function addEvaluation(data){
    return request({
        url:'/add-evaluation',
        method:'post',
        data
    });
}
export function updateAccess(data){
    return request({
        url:'/update-access',
        method:'post',
        data
    });
}
export function chooseOnlineCustomerService(){
    return request({
        url:'/choose-online-customer-service',
        method:'get'
    });
}
export function infiniteScroll(data){
    return request({
        url:'/client-scroll',
        method:'post',
        data
    });
}


export function tell(data){
    return request({
        url:'/tell',
        method:'post',
        data
    });
}
export function closeClient(data){
    return request({
        url:'/close-client',
        method:'post',
        data
    });
}

export function joinGroup(data) {
    return request({
        url:'/join-group',
        method:'post',
        data
    })
}
export function getCurrentInfo() {
    return request({
        url:'/get-current-info',
        method:'post'
    })
}

export function sendMsg(data){
    return request({
        url:'/send',
        method:'post',
        data
    })
}
export function getChatRecord(data){
    return request({
        url:'/chatrecord',
        method:'post',
        data
    })
}
