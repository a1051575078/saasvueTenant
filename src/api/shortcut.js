import request from '@/utils/request';
export function delManyShortcut(data){
    return request({
        url:'/del-many-shortcut',
        method:'post',
        data
    });
}
export function uploadXsl(data){
    return request({
        url:'/upload-xsl',
        method:'post',
        data
    });
}
export function delShortcut(id){
    return request({
        url:`/shortcut/${id}`,
        method:'delete'
    });
}
export function updateShortcut(data,id){
    return request({
        url:`/shortcut/${id}`,
        method:'put',
        data
    });
}
export function addShortcut(data){
    return request({
        url:'/shortcut',
        method:'post',
        data
    });
}
export function getShortcut(){
    return request({
        url:'/shortcut',
        method:'get'
    });
}