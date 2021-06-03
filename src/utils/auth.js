import Cookies from 'js-cookie'

let TokenKey = 'Admin-Token'

export function getToken() {
    const getTokenKey=sessionStorage.getItem('token');
    if(!getTokenKey){
        TokenKey='Admin-Token'
    }else{
        TokenKey=getTokenKey;
    }
    return Cookies.get(TokenKey)
}

export function setToken(token){
    TokenKey=new Date().getTime()+'';
    sessionStorage.setItem('token',TokenKey);
    return Cookies.set(TokenKey,token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
