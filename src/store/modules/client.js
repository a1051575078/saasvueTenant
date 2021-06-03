import {tell,chooseOnlineCustomerService,getCurrentInfo,joinGroup,closeClient} from '@/api/client.js';
const mutations={
};
const state={
};
const actions={
    chooseOnlineCustomerService(){
        return new Promise((resolve,reject)=>{
            chooseOnlineCustomerService()
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },


    tell({commit},tellid){
        const {toid,type,fromid,vip}=tellid;
        return new Promise((resolve,reject)=>{
            tell({type:type,toid:toid,fromid:fromid,vip:vip})
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    closeClient({commit},info){
        const {client_id,fromid,toid}=info
        return new Promise((resolve,reject)=>{
            closeClient({client_id:client_id,fromid:fromid,toid:toid})
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    joinGroup({commit},group){
        const {client_id}=group;
        return new Promise((resolve,reject)=>{
            joinGroup({client_id:client_id})
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    getCurrentInfo(){
        return new Promise((resolve,reject)=>{
            getCurrentInfo()
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
};
export default{
    namespaced:true,
    state,
    mutations,
    actions
}
