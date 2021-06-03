<template>
   <!-- title="您对本次服务满意吗？"-->
    <el-dialog

        :visible.sync="dialog.show"
        width="20%"
        top="15%"
        :close-on-click-modal="false"
        center>
        <el-form :model="form">
            <el-form-item>
                <div style="display: flex;justify-content: center">
                    <div @click="clickPic('good')" :class='form.good?"itemShow":""' style="display: flex;justify-content:center;flex-direction:column;align-items:center;cursor:pointer;width: 100px;height: 100px" :id='kulay1==="good"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('good')">
                        <div class="icon icon-biaoqing" ></div>
                        <!--<div>好评</div>-->
                    </div>
                    <div @click="clickPic('nogood')" :class='form.nogood?"itemShow":""' style="display: flex;justify-content:center;flex-direction:column;align-items:center;cursor:pointer;width: 100px;height: 100px" :id='kulay1==="nogood"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('nogood')">
                        <div class="icon icon-nanguo" ></div>
                        <!--<div>差评</div>-->
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <div style="display: flex;justify-content: center;margin-top: 10px">
                    <div style="width: 90%">
                        <!--<el-input maxlength="66" type="textarea" v-model="form.content" resize="none" placeholder="请填写评价内容(选填)"></el-input>-->
                        <el-input maxlength="66" type="textarea" v-model="form.content" resize="none"></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <div style="display: flex;justify-content: center;margin-top: 10px;margin-bottom: 10px">
                    <div style="width: 90%;">
                        <!--<el-button style="width: 100%" type="primary" @click="submit">提交</el-button>-->
                        <el-button style="width: 100%" type="primary" @click="submit"><i class="el-icon-plus"></i></el-button>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {addEvaluation} from "@/api/client";

export default {
    name: "Good",
    data(){
        return {
            form:{
                'good':0,
                'nogood':0,
                'content':'',
                'toid':null,
            },
            kulay1:'',
            clickShow:''
        }
    },
    props:{
        dialog:{
            type:Object,
            default(){
                return {}
            }
        },
        info:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    watch:{
        'dialog.show':function (v){
            if(v){
                this.form.good=0;
                this.form.nogood=0;
                this.form.content='';
                this.form.toid=this.info.toid;
            }
        }
    },
    methods:{
        submit(){
            /*if(!this.form.good&&!this.form.nogood){
                return this.$message.error('请选择评价等级');
            }*/
            this.dialog.show=false;
            addEvaluation(this.form)
            /*.then(()=>{
                this.$message.success('评价成功');
            });*/
        },
        clickPic(info){
            if(info==='good'){
                this.form.good=1;
                this.form.nogood=0;
            }else {
                this.form.good=0;
                this.form.nogood=1;
            }
            this.kulay1='';
        },
        mousebye(){
            this.kulay1=''
        },
        mousego(info){
            if(info==='good'&&!this.form.good){
                this.kulay1=info;
            }
            if(info==='nogood'&&!this.form.nogood){
                this.kulay1=info;
            }
        }
    }
}
</script>

<style scoped>
>>>.el-dialog__title {
    line-height: 24px;
    font-size: 14px;
    color: #303133;
}
.itemShow{
    background: #ccc;
}
>>>.el-form-item {
    margin-bottom:0;
}
>>>.el-dialog--center .el-dialog__body {
    text-align: initial;
    padding:0;
}
#changecolor{
    background: #F8F8F8;
}
</style>