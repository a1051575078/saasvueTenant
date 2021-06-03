<template>
    <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            :width="dialog.width">
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
            <el-form-item label="昵称：" prop="name" style="width: 90%">
                <el-input v-model="form.name" type="text" autocomplete="off" placeholder="昵称"/>
            </el-form-item>
            <el-form-item label="密码：" prop="password" style="width: 90%">
                <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item style="display: flex;justify-content: flex-end">
                <el-button type="primary" @click="save('form')">保存</el-button>
                <el-button type="primary" @click="dialog.show=false">返回</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
    import {addUser} from "@/api/user";
    export default {
        name:'AddDialog',
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
            form:{
                type:Object,
                default(){
                    return {
                        name:'',
                        password:''
                    };
                }
            }
        },
        data(){
            var name=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('请输入用户名'));
                }else{
                    if(value.length<2){
                        callback(new Error('请输入至少2个字符'));
                    }else{
                        if(value.length>12){
                            callback(new Error('长度不能大于12个字符'));
                        }
                    }
                    callback();
                }
            };
            var password=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('密码不能为空'));
                }
                if(value.length<6){
                    callback(new Error('密码不能少于6位数字'));
                }
                if(value.length>12){
                    callback(new Error('密码不能大于12位数字'));
                }
                callback()
            };
            return {
                info:[],
                rules:{
                    name:[
                        {required:true,validator:name,trigger:'blur'}
                    ],
                    password:[
                        {required:true,validator:password,trigger:'blur'}
                    ]
                },
                addUserInfo:{
                    id:'',
                    name:''
                }
            }
        },
        watch:{
            form:function(){
                if(this.$refs['form']!==undefined){
                    this.$refs['form'].resetFields();
                }
            }
        },
        methods:{
            save(form){
                this.$refs[form].validate(valid=>{
                    if(valid){
                        this.dialog.show=false;
                        this.$emit('notyet');
                        addUser(this.form)
                        .then(()=>{
                            this.$message.success('添加客服成功');
                            this.$emit('add');
                        })
                    }
                });
            }
        }
    }
</script>
<style scoped>
    >>>.el-checkbox {
        margin-right:0;
    }
</style>
