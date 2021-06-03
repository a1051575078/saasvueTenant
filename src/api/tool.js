import request from '@/utils/request';
export function toolHang(data){
    return request({
        url:'/tool-hang',
        method:'post',
        data
    });
}