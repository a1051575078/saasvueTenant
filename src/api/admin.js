import request from '@/utils/request';
export function delAllVip(data){
    return request({
        url:'/del-all-vip',
        method:'post',
        data
    });
}
export function delVip(data){
    return request({
        url:'/del-vip',
        method:'post',
        data
    });
}
export function getVip(){
    return request({
        url:'/vip',
        method:'get'
    });
}
export function addVip(data){
    return request({
        url:'/add-vip',
        method:'post',
        data
    });
}
export function translationRecord(data){
    return request({
        url:'/translation-record1',
        method:'post',
        data
    });
}
export function isUidOnline(data){
    return request({
        url:'/is-uid-online',
        method:'post',
        data
    });
}
export function translation(data){
    return request({
        url:'/translation1',
        method:'post',
        data
    });
}
export function imclick(data){
    return request({
        url:'/imclick',
        method:'post',
        data
    });
}
export function online(data){
    return request({
        url:'/online',
        method:'post',
        data
    });
}
export function sendMeClientGiveOther(data){
    return request({
        url:'/send-me-client-give-other',
        method:'post',
        data
    });
}
export function blackEnd(data){
    return request({
        url:'/black-end',
        method:'post',
        data
    });
}
export function withdraw(data){
    return request({
        url:'/withdraw',
        method:'post',
        data
    });
}
export function transfer(data){
    return request({
        url:'/transfer',
        method:'post',
        data
    });
}
export function findOnline(){
    return request({
        url:'/find-online',
        method:'post'
    });
}
