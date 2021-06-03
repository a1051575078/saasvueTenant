<template>
    <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :width="dialog.width">
        <el-form>
            <el-form-item>
                <el-radio-group v-model="info" style="display: flex;flex-direction: column;align-items: center;height: calc(100vh - 700px);overflow-y: scroll;">
                    <div v-for="item in customerinfo">
                        <el-radio :disabled="item.id===$store.getters.id" :label="item.id" style="width: 100px">{{item.name}}</el-radio>
                    </div>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end">
                <el-button @click="transfer">确认转接</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
    import {transfer} from "@/api/admin";
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
            },
            userinfo:{
                type:Object,
                default(){
                    return {};
                }
            }
        },
        data(){
            return {
                info:''
            }
        },
        methods:{
            transfer(){
                if(this.info.length===0){
                    this.$message.error('请选择转接客服');
                }else{
                    this.userinfo.oldtoid=this.userinfo.toid;
                    this.userinfo.toid=this.info;
                    this.dialog.show=false;
                    transfer(this.userinfo)
                    .then(()=>{
                        this.$emit('delSidebar',this.userinfo);
                        this.$message.success('转接成功');
                    })
                }
            }
        }
    }
</script>
<style scoped>
    >>>.el-radio{
        margin-right:0;
        margin-bottom: 10px;
    }
</style>