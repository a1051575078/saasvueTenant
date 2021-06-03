<template>
    <el-dialog
            :title="dialog.title"
            :visible.sync="dialog.show"
            width="30%"
            :before-close="handleClose">
        <el-form ref="form" label-position="top" label-width="80px" :model="form" :rules="formRules">
            <el-form-item label="选择层级:">
                <el-select v-model="form.father_id" placeholder="请选择" :disabled="dialog.title==='编辑常用回复'&&form.father_id===0?true:false">
                    <el-option
                        v-for="item in data"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="content" v-if="form.father_id">
                <el-input
                        type="textarea"
                        :rows="2"
                        v-model="form.content">
                </el-input>
            </el-form-item>
            <el-form-item label="优先级：" prop="sort">
                <el-input v-model="form.sort"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import {addShortcut,updateShortcut} from '@/api/shortcut';
    export default {
        props:{
            dialog:{
                type:Object,
                default(){
                    return {};
                }
            },
            tabledata:{
                type:Array,
                default(){
                    return [];
                }
            },
            form:{
                type:Object,
                default(){
                    return {
                        sort:999,
                        title:'',
                        content:'',
                        id:0,
                        father_id:0,
                    };
                }
            },
        },
        data() {
            var title=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('标题不能为空'));
                }
                if(this.form.title.trim()===''){
                    this.form.title='';
                }
                callback();
            };
            var content=(rule,value,callback)=>{
                if(value===''){
                    callback(new Error('内容不能为空'));
                }
                if(this.form.content.trim()===''){
                    this.form.content='';
                }
                callback();
            };
            var sort=(rule,value,callback)=>{
                var reg=/^[1-9]\d*$|^0$/;
                if(value==''){
                    callback(new Error('优先级不能为空'));
                    setTimeout(this.setTimeAmount,'1000');
                }else if(reg.test(value)!==true){
                    callback(new Error('优先级只能为整数'));
                    setTimeout(this.setTimeAmount,'1000');
                }
                callback();
            };
            return {
                data:[],
                dialogVisible: true,
                formRules:{
                    title:[{required:true,validator:title,trigger:'change'}],
                    content:[{required:true,validator:content,trigger:'change'}],
                    sort:[{required:true,validator:sort,trigger:'change'}]
                }
            };
        },
        methods: {
            onSubmit(form){
                this.$refs[form].validate(valid=>{
                    if(valid){
                        this.dialog.show=false;
                        if(this.dialog.title==='编辑常用回复'){
                            updateShortcut(this.form,this.form.id)
                            .then(()=>{
                                this.$emit('update',this.form);
                                this.$message({
                                    message:'修改成功',
                                    type:'success'
                                });
                            })
                        }else{
                            addShortcut(this.form)
                                .then(response=>{
                                    this.form.id=response.data.id;
                                    this.$emit('add',this.form);
                                    this.$message({
                                        message:'保存成功',
                                        type:'success'
                                    });
                                });
                        }

                    }
                });
            },
            setTimeAmount(){
                this.form.sort=999
                /*this.$refs['form'].resetFields();*/
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            }
        },
        watch:{
            'dialog.title':function (v){
                if(v==='编辑常用回复'){
                    this.data=[];
                    for(var a=0;a<this.tabledata.length;a++){
                        this.data.unshift(this.tabledata[a]);
                    }
                    this.data.unshift({id:0,title:'顶级类目'});
                }
            },
            form:function(){
                if(this.$refs['form']!==undefined){
                    this.$refs['form'].resetFields();
                }
                this.data=[];
                for(var a=0;a<this.tabledata.length;a++){
                    this.data.unshift(this.tabledata[a]);
                }
                this.data.unshift({id:0,title:'顶级类目'});
            }
        },
    };
</script>