import request from '@/utils/request';

export function getEvaluation(){
    return request({
        url:'/evaluation',
        method:'get'
    });
}
export function getBlack(){
    return request({
        url:'/black',
        method:'get'
    });
}
export function getVisitorData(){
    return request({
        url:'/visitor',
        method:'get'
    });
}
export function detailed(){
    return request({
        url:'/detailed',
        method:'get'
    });
}
export function getAllStatistics(){
    return request({
        url:'/statistics',
        method:'get'
    });
}