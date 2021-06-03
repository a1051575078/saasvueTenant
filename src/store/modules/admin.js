import {online} from '@/api/admin.js';
const mutations={
};
const state={
};
const actions={
    online({commit},info){
        return new Promise((resolve,reject)=>{
            online(info)
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    }
};
export default{
    namespaced:true,
    state,
    mutations,
    actions
}
