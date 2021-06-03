<template>
    <el-dialog
            :visible.sync="dialog.show"
            width="50%"
            top="9vh">
        <div style="display: flex;justify-content: space-between" v-loading="loading">
            <div class="box" style="width: 50%">
                <el-card style="width:100%">
                    <div slot="header">
                        <span>操作</span>
                    </div>
                    <div class="item">
                        <el-link :underline="false" type="primary" @click="export2Excel">导出聊天记录</el-link>
                    </div>
                    <div class="item" style="display: flex;justify-content: space-between">
                        <div>
                            <el-link type="primary" :underline="false" @click="translation()" v-if="translationIsClick">点我翻译</el-link>
                            <el-link type="primary" :underline="false" v-else disabled>点我翻译</el-link>
                        </div>
                        <div>
                            <el-link :underline="false" disabled>翻译语言:</el-link>
                            <el-popover
                                placement="top"
                                width="888"
                                v-model="visible"
                                trigger="click">
                                <el-form>
                                    <el-form-item label="搜索：">
                                        <el-autocomplete
                                            class="inline-input"
                                            v-model="state"
                                            :fetch-suggestions="querySearch"
                                            placeholder="请输入内容"
                                            :trigger-on-focus="false"
                                            @select="handleSelect"
                                        ></el-autocomplete>
                                    </el-form-item>
                                </el-form>
                                <div style="display:flex;flex-wrap: wrap;justify-content:flex-start;flex-direction:row ">
                                    <div :id='language.value===move?"style":""' @mouseover="mouseOver(language.value)" @mouseleave="mouseLeave()" style="margin-right: 10px;margin-bottom:10px;width: 100px" v-for="language in languageData">
                                        <span style="display: flex;justify-content:center;cursor: pointer;" @click="chooseLanguage(language)">{{language.value}}</span>
                                    </div>
                                </div>
                                <el-link slot="reference" :underline="false" v-model="form.language">{{form.languageName}}</el-link>
                            </el-popover>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="box" style="width:50%" ref="test">
                <div class="content" id="heightBottom">
                    <!-- 聊天内容 -->
                    <div v-for="v in form.chatRecord">
                        <div v-if="!Number(v.fromid)">
                            <span class="toMsgTime" style="font-size:12px;color: #ccc">{{v.created_at}}</span>
                            <div class="to">
                                <img src="@/assets/cust.jpg" alt="" class="toHeader">
                                <div v-if="v.type===1" class="toText" style="color:white" v-html="v.content"></div>
                                <div v-if="v.type===2" class="toText" style="max-width:10%;max-height:10%;padding:0;" v-viewer>
                                    <img class="sendpic" :src="config.link+v.content" :key="config.link+v.content"/>
                                </div>
                            </div>
                        </div>
                        <div v-if="Number(v.fromid)">
                            <span class="fromMsgTime" style="font-size: 12px;color: #ccc">
                                {{v.created_at}}
                                <span style="font-weight:666" v-if="v.user">{{v.user.name}}</span>
                                <span v-if="v.withdraw===1" style="color: red">(已撤回)</span>
                            </span>
                            <div class="from">
                                <img :src="v.user?config.link+v.user.avatar:config.link+avatar" alt="" class="fromHeader">
                                <div v-if="v.type===1" class="fromText" style="color:white" v-html="v.content"></div>
                                <div v-if="v.type===2" class="fromText" style="max-width: 10%;max-height:10%;padding:0;" v-viewer>
                                    <img class="sendpic" :src="config.link+v.content" :key="config.link+v.content"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </el-dialog>
</template>
<script>
   import {getRecord} from "@/api/contact";
   import {resumecss} from '@/assets/template';
   import {translationRecord} from "@/api/admin";
   const defaultForm={
       languageName:'中文',//翻译语言的名字
       language:'zh',//翻译后的目标语言
       chatRecord:[]
   }
   export default {
       props:{
           dialog:{
               type:Object,
               default(){
                   return {};
               }
           },
           info:{
               type:Object,
               default(){
                   return {};
               }
           }
       },
       data(){
           return {
               translationIsClick:true,//是否可以点翻译
               form:Object.assign({},defaultForm),
               move:'',//动态样式,如果等于某个值,就更改背景颜色
               state: '',//跟翻译挂钩的。ui必须绑定他.并没什么卵用
               visible:false,//选择翻译语言是否显示
               dialogTableVisible:true,
               loading:true,
               avatar:'',
               currentHeight:0,
               lastHeight:0,
               languageData:[
                 {
                   name:'zh',
                   value:'中文'
                 },{
                   name:'en',
                   value:'英语'
                 },{
                   name:'ru',
                   value:'俄罗斯'
                 },{
                   name:'hrv',//hr
                   value:'克罗地亚语'
                 },{
                   name:'hmn',
                   value:'苗语'
                 },{
                   name:'gd',
                   value:'苏格兰盖尔语'
                 },{
                   name:'hu',
                   value:'匈牙利语'
                 },{
                   name:'alb',//sq
                   value:'阿尔巴尼亚语'
                 },{
                   name:'fra',//fr
                   value:'法语'
                 },{
                   name:'kur',//kur
                   value:'库尔德语'
                 },{
                   name:'xh',
                   value:'南非科萨语'
                 },{
                   name:'ceb',
                   value:'宿务语'
                 },{
                   name:'sna',//sn
                   value:'修纳语'
                 },{
                   name:'ara',//ar
                   value:'阿拉伯语'
                 },{
                   name:'fil',//tl
                   value:'菲律宾语'
                 },{
                   name:'lat',//la
                   value:'拉丁语'
                 },{
                   name:'zu',
                   value:'南非祖鲁语'
                 },{
                   name:'arm',//hy
                   value:'亚美尼亚语'
                 },{
                   name:'som',//so
                   value:'索马里语'
                 },{
                   name:'amh',//am
                   value:'阿姆哈拉语'
                 },{
                   name:'fin',//fi
                   value:'芬兰语'
                 },{
                   name:'lav',//lv
                   value:'拉脱维亚语'
                 },{
                   name:'ne',
                   value:'尼泊尔语'
                 },{
                   name:'tg',
                   value:'塔吉克语'
                 },{
                   name:'ig',
                   value:'伊博语'
                 },{
                   name:'az',
                   value:'阿塞拜疆语'
                 },{
                   name:'fy',
                   value:'弗里西语'
                 },{
                   name:'lo',
                   value:'老挝语'
                 },{
                   name:'no',
                   value:'挪威语'
                 },{
                   name:'te',
                   value:'泰卢固语'
                 },{
                   name:'it',
                   value:'意大利语'
                 },{
                   name:'ga',
                   value:'爱尔兰语'
                 },{
                   name:'km',
                   value:'高棉语'
                 },{
                   name:'lt',
                   value:'立陶宛语'
                 },{
                   name:'pa',
                   value:'旁遮普语'
                 },{
                   name:'ta',
                   value:'泰米尔语'
                 },{
                   name:'yi',
                   value:'意第绪语'
                 },{
                   name:'est',//et
                   value:'爱莎尼亚语'
                 },{
                   name:'ka',
                   value:'格鲁吉亚语'
                 },{
                   name:'lb',
                   value:'卢森堡语'
                 },{
                   name:'pt',
                   value:'葡萄牙语'
                 },{
                   name:'th',
                   value:'泰语'
                 },{
                   name:'hi',
                   value:'印地语'
                 },{
                   name:'ori',//ori
                   value:'奥里亚语'
                 },{
                   name:'gu',
                   value:'古吉拉特语'
                 },{
                   name:'rw',
                   value:'卢旺达语'
                 },{
                   name:'ps',
                   value:'普什图语'
                 },{
                   name:'tr',
                   value:'土耳其语'
                 },{
                   name:'su',
                   value:'印尼巽他语'
                 },{
                   name:'eu',
                   value:'巴斯克语'
                 },{
                   name:'kk',
                   value:'哈萨克语'
                 },{
                   name:'rom',//ro
                   value:'罗马尼亚语'
                 },{
                   name:'ny',
                   value:'齐切瓦语'
                 },{
                   name:'tk',
                   value:'土库曼语'
                 },{
                   name:'id',
                   value:'印尼语'
                 },{
                   name:'be',
                   value:'白俄罗斯语'
                 },{
                   name:'ht',
                   value:'海地克里奥尔语'
                 },{
                   name:'mg',
                   value:'马尔加什语'
                 },{
                   name:'mg',
                   value:'马尔加什语'
                 },{
                   name:'jp',//ja
                   value:'日本'
                 },{
                   name:'cy',
                   value:'威尔士语'
                 },{
                   name:'jw',
                   value:'印尼爪哇语'
                 },{
                   name:'bul',//bg
                   value:'保加利亚语'
                 },{
                   name:'kor',//ko
                   value:'韩语'
                 },{
                   name:'mt',
                   value:'马耳他语'
                 },{
                   name:'swe',//sv
                   value:'瑞典语'
                 },{
                   name:'ug',
                   value:'维吾尔语'
                 },{
                   name:'is',
                   value:'冰岛语'
                 },{
                   name:'ha',
                   value:'豪萨语'
                 },{
                   name:'mr',
                   value:'马拉地语'
                 },{
                   name:'sm',
                   value:'萨摩亚语'
                 },{
                   name:'ur',
                   value:'乌尔都语'
                 },{
                   name:'yo',
                   value:'约鲁巴语'
                 },{
                   name:'pl',
                   value:'波兰语'
                 },{
                   name:'nl',
                   value:'荷兰语'
                 },{
                   name:'ml',
                   value:'马拉雅拉姆语'
                 },{
                   name:'sr',
                   value:'塞尔维亚语'
                 },{
                   name:'uk',
                   value:'乌克兰语'
                 },{
                   name:'vie',//vi
                   value:'越南语'
                 },{
                   name:'bs',
                   value:'波斯尼亚语'
                 },{
                   name:'ky',
                   value:'吉尔吉斯语'
                 },{
                   name:'ms',
                   value:'马来语'
                 },{
                   name:'st',
                   value:'塞索托语'
                 },{
                   name:'uz',
                   value:'乌兹别克语'
                 },{
                   name:'fa',
                   value:'波斯语'
                 },{
                   name:'gl',
                   value:'加利西亚语'
                 },{
                   name:'mk',
                   value:'马其顿语'
                 },{
                   name:'si',
                   value:'僧伽罗语'
                 },{
                   name:'spa',//es
                   value:'西班牙语'
                 },{
                   name:'af',
                   value:'布尔语'
                 },{
                   name:'ca',
                   value:'加泰罗尼亚语'
                 },{
                   name:'mi',
                   value:'毛利语'
                 },{
                   name:'eo',
                   value:'世界语'
                 },{
                   name:'iw',
                   value:'希伯来语'
                 },{
                   name:'tt',
                   value:'鞑靼语'
                 },{
                   name:'cs',
                   value:'捷克语'
                 },{
                   name:'mn',
                   value:'蒙古语'
                 },{
                   name:'sk',
                   value:'斯洛伐克语'
                 },{
                   name:'el',
                   value:'希腊语'
                 },{
                   name:'dan',//da
                   value:'丹麦语'
                 },{
                   name:'kn',
                   value:'卡纳达语'
                 },{
                   name:'bn',
                   value:'孟加拉语'
                 },{
                   name:'slo',//sl
                   value:'斯洛文尼亚语'
                 },{
                   name:'haw',
                   value:'夏威夷语'
                 },{
                   name:'de',
                   value:'德语'
                 },{
                   name:'co',
                   value:'科西嘉语'
                 },{
                   name:'my',
                   value:'缅甸语'
                 },{
                   name:'sw',
                   value:'斯瓦西里语'
                 },{
                   name:'sd',
                   value:'信德语'
                 }],//所有语言的名字及英语的简写
           }
       },
       watch:{
           'info.fromid':function () {
               this.getRecord(this.info);
           }
       },
       methods:{
           //点击翻译
           translation(){
               this.translationIsClick=false;
               translationRecord(this.form)
               .then((res)=>{
                   this.form.chatRecord=res.data;
                   this.translationIsClick=true;
               })
           },
           //得到当前的时间
           getTime(){
               var myDate=new Date();
               var year=myDate.getFullYear();
               var month=myDate.getMonth()+1;
               if(month<10){
                   month='0'+month;
               }
               var day= myDate.getDate();
               if(day<10){
                   day='0'+day;
               }
               return year+''+month+''+day;
           },
           export2Excel() {
               var a = document.createElement("a");
               var url = window.URL.createObjectURL(
                   new Blob([this.gethtml()], {
                       type: ""
                   })
               );
               a.href = url;
               a.download =this.info.name+'和'+this.info.fromid+'-'+this.getTime()+".html";
               a.click();
               window.URL.revokeObjectURL(url);
           },
           gethtml() {
               const template = this.$refs.test.innerHTML;
               let html = `<!DOCTYPE html>
                  <html>
                      <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width,initial-scale=1.0">
                          <title>${this.info.name}和${this.info.fromid}聊天记录</title>
                          <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"/>
                          <style>
                          ${resumecss}
                          </style>
                      </head>
                  <body>
                      <div style="margin: 0 auto;width:800px">
                          ${template}
                      </div>
                  </body>
                  </html>`;
               return html;
           },
           //移入菜单样式
           mouseOver: function(v){
               this.move=v;
           },
           //移出菜单样式
           mouseLeave: function () {
               this.move ='';
           },
           //中间聊天类
           handleSelect(item) {
               for(var a=0;a<this.languageData.length;a++){
                   if(this.languageData[a].name===item.name){
                       this.form.language=item.name;
                       this.form.languageName=item.value;
                       this.visible=false;
                       break;
                   }
               }
           },
           //下面两个是翻译搜索弹出来的下拉框
           querySearch(queryString, cb) {
               let languageDatas=this.form.languageData;
               var results = queryString ? languageDatas.filter(this.createFilter(queryString)) : languageDatas;
               // 调用 callback 返回建议列表的数据
               cb(results);
           },
           createFilter(queryString){
               return (restaurant)=>{
                   return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())===0);
               };
           },
           //选择语言
           chooseLanguage(info){
               this.form.language=info.name;
               this.form.languageName=info.value;
               this.visible=false;
           },
           //让聊天框到达上一次的位置->无等待时间
           chatBottom1(){
               this.$nextTick(function(){
                   var div = document.getElementById('heightBottom');
                   //第一次是1000 第二次是2000 第三次是3000
                   this.currentHeight=div.scrollHeight-this.lastHeight;
                   this.lastHeight=div.scrollHeight;
                   div.scrollTop = this.currentHeight;
               })
           },
           getRecord(info){
               this.form=Object.assign({},defaultForm);
               this.loading=true;
               getRecord(info.id)
               .then(res=>{
                   this.avatar=res.data.avatar;
                   this.form.chatRecord=res.data.record;
                   this.loading=false;
                   this.translationIsClick=true;
               })
           },
           handleScroll (e) { //改变元素#searchBar的top值
               if(this.lastHeight===0){
                   var div = document.getElementById('heightBottom');
                   this.lastHeight=div.scrollHeight;
               }
               if(e.currentTarget.scrollTop===0){
                   if(this.nohavemany===''){
                       this.$store.dispatch('websock/infiniteScroll',this.info)
                           .then(res=>{
                               if(res.data.length===0){
                               }
                               this.info.tableId=res.data[0].id;
                               var length=res.data.length;
                               for(var i=length-1;i>=0;i--){
                                   let obj={};
                                   obj.fromid=res.data[i].fromid;
                                   obj.toid=res.data[i].toid;
                                   obj.withdraw=res.data[i].withdraw;
                                   obj.type=res.data[i].type;
                                   obj.content=res.data[i].content;
                                   obj.created_at=res.data[i].created_at;
                                   this.form.chatRecord.unshift(obj);
                               }
                               this.chatBottom1();
                           })
                   }
               }
           },
           //让聊天框到达最底部
           chatBottom(){
               this.$nextTick(function(){
                   setTimeout(function (){
                       var div = document.getElementById('heightBottom');
                       div.scrollTop = div.scrollHeight;
                   }, 300);
               })
           },
       }
   }
</script>

<style scoped>

.item {
    margin-bottom: 18px;
}

    /*隐藏滚动条*/
    #style{
        background:	#F8F8F8;
    }
   .sendpic{
       width: auto;
       height: auto;
       max-width:100%;
       max-height: 100%;
   }
   >>>.el-dialog__body {
       padding: 10px 20px!important;
   }
   >>>.el-dialog__header {
        padding: 0 !important;
        padding-bottom:0 !important;
   }
   .toText{
       padding: 10px;
       background:#B0C4DE;
       margin: 0 15px;
       display: flex;
       justify-content: center;
       align-items: center;
       position: relative;
       display: -webkit-box;
       display: -ms-flexbox;
       display: flex;
       -webkit-box-pack: center;
       -ms-flex-pack: center;
       -webkit-box-align: center;
       -ms-flex-align: center;
       word-break:break-all;
       word-wrap:break-word
   }
   .fromText{
       padding: 10px;
       background: #409EFF;
       margin: 0 15px;
       display: -webkit-box;
       display: -ms-flexbox;
       display: flex;
       -webkit-box-pack: center;
       -ms-flex-pack: center;
       justify-content: center;
       -webkit-box-align: center;
       -ms-flex-align: center;
       align-items: center;
       position: relative;
       /*width: 50%;*/
       word-break:break-all;
       word-wrap:break-word
   }
   .toHeader,.fromHeader{
       width: 40px;
       height: 40px;
   }
   .toMsgTime,.fromMsgTime{
       margin: 13px 15px;
       display: flex;
   }
   .fromMsgTime{
       flex-direction: row-reverse;
   }
   .to,.from{
       margin: 0 15px;
       display: flex;
       align-items: center;
       font-size: 15px;
   }
   .from{
       flex-direction: row-reverse;
   }
   .content{
       width: 100%;
       height: calc(100vh - 215px);
       /*border: 1px green solid;*/
       overflow-y: scroll;
   }
   .box{
       height: 100%;
       padding: 20px;
       color: #595B66;
       font-family: 'Microsoft Yahei', sans-serif;
   }
</style>
