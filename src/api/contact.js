import request from '@/utils/request';
export function getContact(){
    return request({
        url:'/contact',
        method:'get'
    });
}
export function getRecord(id) {
    return request({
        url:`/contact/${id}`,
        method:'get'
    })
}
export function getAllCustomerInfo(){
    return request({
        url:'/get-customer-info',
        method:'get'
    });
}
export function delOraddblack(data){
    return request({
        url:'/del-add-black',
        method:'post',
        data
    });
}
export function kgetContact(){
    return request({
        url:'/kcontact',
        method:'get'
    });
}
