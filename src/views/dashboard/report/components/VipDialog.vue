<template>
    <el-dialog
        title="添加客户"
        :visible.sync="vip.show"
        width="30%"
        :close-on-click-modal="false"
        top="5%"
        center>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="IP" prop="ip" :rules="[{ required: true,message:'不能为空'}]">
                <el-input v-model="form.ip"></el-input>
            </el-form-item>
            <el-form-item label="名字">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio v-model="form.radio" label="1">男</el-radio>
                <el-radio v-model="form.radio" label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="电话号码">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input-number :min="1" :max="100" v-model="form.age"></el-input-number>
            </el-form-item>
            <el-form-item label="联系方式">
                <div style="display: flex;flex-direction: column">
                    <div style="margin-bottom: 10px;width:50%;display: flex;justify-content: space-between">
                        <div>
                            QQ:
                        </div>
                        <div>
                            <el-input v-model="form.qq"></el-input>
                        </div>
                    </div>
                    <div style="width:50%;display: flex;justify-content: space-between">
                        <div>
                            微信:
                        </div>
                        <div>
                            <el-input v-model="form.wechat"></el-input>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remarks" placeholder="例如：游戏账号：XXX……" maxlength="66"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="float: right" type="primary" @click="onSubmit('form')">立即创建</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {addVip} from "@/api/admin";
const defaultForm={
    id:0,
    name:'',
    ip: '',
    radio:'1',
    phone: '',
    age:1,
    qq:'',
    wechat:'',
    address:'',
    remarks: ''
}
export default {
    name: "VipDialog",
    data(){
        return {
            form:Object.assign({},defaultForm)
        }
    },
    watch:{
        'vip.show':function(v){
            this.form=Object.assign({},defaultForm);
            this.form.id=this.$store.getters.id;
            if(v){
                if(this.$refs['form']!==undefined){
                    this.$refs['form'].resetFields();
                }
            }
        }
    },
    methods:{
        onSubmit(form) {
            this.$refs[form].validate(valid => {
                if(valid) {
                    this.vip.show=false;
                    addVip(this.form)
                    .then(()=>{
                        this.$message.success('添加成功');
                        this.$emit('refresh');
                    });
                }
            })
        }
    },
    props:{
        vip:{
            type:Object,
            default(){
                return {}
            }
        }
    }
}
</script>

<style scoped>

</style>