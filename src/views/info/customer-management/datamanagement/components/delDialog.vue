<template>
    <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :width="dialog.width">
        <el-form>
            <el-form-item>
                <el-checkbox-group v-model="info" style="display: flex;flex-direction: column;align-items: center;height: calc(100vh - 700px);overflow-y: scroll;">
                    <el-checkbox v-for="item in customerinfo" :label="item.id" :key="item.id" :disabled="item.id===$store.getters.id" style="width: 100px">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end">
                <el-button type="danger" @click="deluser">删除</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
    import {delUser} from "@/api/user";
    export default {
        name:'DelDialog',
        props:{
            dialog:{
                type:Object,
                default(){
                    return {};
                }
            },
            customerinfo:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        data(){
            return {
                info:[],
            }
        },
        methods:{
            deluser(){
                if(this.info.length===0){
                    this.$message.error('请选择删除客服');
                }else{
                    this.dialog.show=false;
                    delUser(this.info)
                    .then(()=>{
                        this.$message.success('删除成功');
                        this.$emit('addSeat',this.info.length);
                        for(var i=0;i<this.info.length;i++){
                            for(var j=0;j<this.customerinfo.length;j++){
                                if(this.info[i]===this.customerinfo[j].id){
                                    this.customerinfo.splice(j,1);
                                }
                            }
                        }
                        this.info=[];
                    })
                }
            }
        }
    }
</script>
<style scoped>
    >>>.el-checkbox {
        margin-right:0;
    }
</style>