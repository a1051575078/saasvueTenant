import {bind,sendMsg,sendPic,disconnect,infiniteScroll} from '@/api/websock.js';
const mutations={
    SET_FORMID: (state, fromid) => {
        state.fromid = fromid
    },
    SET_TOID: (state, toid) => {
        state.toid = toid
    },
    SET_CONTENT: (state, content) => {
        state.content = content
    },
    SET_CLIENTID:(state,client_id)=>{
        state.client_id=client_id
    }
};
const state={
    fromid:'',
    toid:'',
    content:'',
    client_id:'',
};
const actions={
    infiniteScroll({commit},info){
        return new Promise((resolve,reject)=>{
            infiniteScroll(info)
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    sendPic({commit},files){
        return new Promise((resolve,reject)=>{
            sendPic(files)
            .then(response=>{
                resolve(response);
            }).catch(error=>{
                reject(error);
            })
        })
    },
    disconnect({commit},info){
        const {fromid,toid}=info
        return new Promise((resolve,reject)=>{
            disconnect({fromid:fromid,toid:toid})
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    sendMsg({commit},sendMsgInfo){
        return new Promise((resolve,reject)=>{
            sendMsg(sendMsgInfo)
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },
    bind({commit},info){
        const {fromid,client_id}=info;
        return new Promise((resolve,reject)=>{
            bind({fromid:fromid,client_id:client_id})
                .then(response=>{
                    commit('SET_CLIENTID', client_id);
                    resolve(response);
                }).catch(error=>{
                reject(error);
            });
        })
    },







    getCustList(){
        return new Promise((resolve,reject)=>{
            getCustList()
                .then(response=>{
                    resolve(response);
                }).catch(error=>{
                reject(error);
            })
        })
    },

    getChatRecord({commit},id){
        const {fromid,toid}=id;
        return new Promise((resolve,reject)=>{
            getChatRecord({fromid:fromid,toid:toid})
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
