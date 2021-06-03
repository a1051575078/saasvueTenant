<template>
    <el-container :style="{height:height+'px'}">
        <audio controls="controls" hidden :src="config.link+$store.getters.music" ref="audio"></audio>
        <el-aside class="box" width="350px">
            <div v-for="item in chatRecord">
                <div @contextmenu.prevent="openmenu(item,$event)" :class='item.ip!==clickShow?"item":"itemShow"' :id='item.ip===move?"style":""' @mouseover="mouseOver(item.ip)" @mouseleave="mouseLeave()" @click="clickList(item)">
                    <div class="aside">
                        <span>IP：{{item.ip}}
                            <span v-if="JSON.stringify(item.vip)!=='{}'&&JSON.stringify(item.vip)!=='[]'" style="color: red">(VIP)</span>
                        </span>
                        <span>地区：{{item.add|address}}</span>
                    </div>
                    <div class="right">
                        <span v-if="item.isonline" style="color: red">离线</span>
                        <span>{{item.model}}</span>
                        <el-badge :value="item.isread" :hidden="(item.isread!==0)?false:true" :max="10" :key="item.ip" class="mark"></el-badge>
                        <el-button v-if="!item.isonline" type="primary" size="mini" @click.stop="transfer(item)">转接</el-button>
                    </div>
                </div>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item :name="items.fromid" v-for="items in otherChatRecord" :key="items.fromid">
                    <template slot="title">
                        {{ items.name }} <i v-if="items.is_server" style="font-size: 24px" class="el-icon-unlock"></i><i v-if="!items.is_server" style="font-size: 24px;color: red" class="el-icon-lock"></i>
                    </template>
                    <div v-for="item in items.info">
                        <div :class='item.ip!==clickShow?"item":"itemShow"' :id='item.ip===move?"style":""' @mouseover="mouseOver(item.ip)" @mouseleave="mouseLeave()" @click="clickList(item)">
                            <div class="aside">
                                <span>IP：{{item.ip}}
                                    <span v-if="JSON.stringify(item.vip)!=='{}'&&JSON.stringify(item.vip)!=='[]'" style="color: red">(VIP)</span>
                                </span>
                                <span>地区：{{item.add|address}}</span>
                            </div>
                            <div class="right">
                                <span>{{item.model}}</span>
                                <el-badge :value="item.isread" :hidden="(item.isread!==0)?false:true" :max="10" :key="item.ip" class="mark">
                                </el-badge>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-aside>
        <el-main class="box-1" style="flex-grow: 2;">
            <div v-if="isShow">
                <header>
                    <el-divider>与 {{info.name}} 聊天</el-divider>
                </header>
                <div class="content" id="heightBottom" @scroll="handleScroll($event)">
                    <div v-loading="loadingTop" element-loading-spinner="el-icon-loading"></div>
                    <div v-if="nohavemany" style="text-align: center;font-size: 12px">暂无更多</div>
                    <div v-for="items in record">
                        <div v-if="!Number(items.fromid)">
                            <span class="toMsgTime" style="font-size: 12px;color: #ccc">{{items.created_at}}</span>
                            <div class="to">
                                <img src="@/assets/cust.jpg" class="toHeader">
                                <div v-if="items.type===1" @contextmenu.prevent="translation(items,$event)" class="toText" style="color:white;border-radius: 10px" v-html="items.content"></div>
                                <span v-if="items.type===1&&items.loading" v-loading="true" element-loading-spinner="el-icon-loading"></span>
                                <div v-if="items.type===2" class="toText" style="max-width:10%;max-height:10%;padding:0;" v-viewer>
                                    <img class="sendpic" :src="config.link+items.content" :key="config.link+items.content"/>
                                </div>
                            </div>
                        </div>
                        <div v-if="Number(items.fromid)">
                            <span class="fromMsgTime" style="font-size: 12px;color: #ccc">
                                {{items.created_at}}
                                <span style="font-weight:666" v-if="items.user">{{items.user.name}}</span>
                                <span v-if="items.withdraw" style="color: red">(已撤回)</span></span>
                            <div class="from">
                                <img :src="items.user?config.link+items.user.avatar:config.link+$store.getters.avatar" class="fromHeader">
                                <div @contextmenu.prevent="withdraw(items,$event)" v-if="items.type===1&&$store.getters.id+''===items.fromid" class="fromText" style="color:white;border-radius: 10px" v-html="items.content"></div>
                                <div v-if="items.type===1&&$store.getters.id+''!==items.fromid" class="fromText" style="color:white;border-radius: 10px" v-html="items.content"></div>
                                <div @contextmenu.prevent="withdraw(items,$event)" v-if="items.type===2&&$store.getters.id+''===items.fromid||items.type===4&&$store.getters.id+''===items.fromid" class="fromText" style="max-width:10%;max-height:10%;padding:0;" v-viewer>
                                    <img v-if="items.type===2" class="sendpic" :src="config.link+items.content" :key="config.link+items.content"/>
                                    <img v-if="items.type===4" class="sendpic" :src="items.content" :key="config.link+items.content"/>
                                </div>
                                <div v-if="items.type===2&&$store.getters.id+''!==items.fromid||items.type===4&&$store.getters.id+''!==items.fromid" class="fromText" style="max-width:10%;max-height:10%;padding:0;" v-viewer>
                                    <img v-if="items.type===2" class="sendpic" :src="config.link+items.content" :key="config.link+items.content"/>
                                    <img v-if="items.type===4" class="sendpic" :src="items.content" :key="config.link+items.content"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="ui">
                    <el-popover
                        placement="top"
                        trigger="click">
                        <div>
                            <Picker
                                :include="['people']"
                                :showSearch="false"
                                :showPreview="false"
                                :showCategories="false"
                                @select="addEmoji"/>
                        </div>
                        <span slot="reference" class="icon icon-kaixin" style="cursor:pointer;margin: 0 10px;" :id='kulay==="expression"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('expression')"></span>
                    </el-popover>
                    <span class="icon icon-tupiantianjia hiddenupload" style="cursor:pointer;margin: 0 10px;" :id='kulay==="pic"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('pic')">
                          <input type="file" ref="pathClear" accept="image/*" @change="sendPic">
                    </span>
                </div>
                <footer>
                    <!--<div ref="paste"
                         type="text"
                         contenteditable="true"
                        >
                        &lt;!&ndash;@paste.stop.prevent="pasteImg($event)">&ndash;&gt;
                    </div>-->
                    <div v-if="blurryType" :style="{top:(this.style.top-30)+'px',left:(this.style.left+20)+'px',bottom:this.style.bottom+'px'}" style="position:fixed;z-index: 999">
                        <el-table
                            :row-style="{height:'20px'}"
                            :cell-style="{padding:'0px'}"
                            :data="blurryData"
                            style="width:666px;font-size: 10px;"
                            max-height="100px">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div style="cursor: pointer" @click="putText(scope.row)"><i @click.stop="()=>sendShortcut(scope.row)" class="el-icon-chat-dot-square"></i>{{scope.row.content}}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <textarea @click="getWidth()" ref="contentArea" class="msg-area" style="height:100px;" v-model="content" @keyup="keyup($event)" @paste="pasteImg($event)"></textarea>
                    <div style="width: 100%;display:flex;flex-direction: row-reverse;justify-content: space-between;align-items: center">
                        <div>
                            <el-button @click="send">发送</el-button>
                        </div>
                        <div>
                            <el-button size="mini" round @click="translationContent">{{translationText}}</el-button>
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
                                <el-link :underline="false" v-model="language" slot="reference">👉{{languageName}}</el-link>
                            </el-popover>
                        </div>
                    </div>
                </footer>
            </div>
        </el-main>
        <el-aside class="box-2" width="450px">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="快捷语" name="shortcut">
                    <div style="display: flex;justify-content: space-between">
                        <div style="margin: 10px;display: flex;justify-items: self-start;align-items:center">
                            <div class="replyTool" :id='"add"===move?"style":""' @mouseover="mouseOver('add')" @mouseleave="mouseLeave()" @click="addShortcut">
                                <i class="el-icon-circle-plus" style="font-size:24px"></i><span style="font-size: 12px">添加</span>
                            </div>
                            <div class="replyTool" style="margin-left: 10px" :id='"upload"===move?"style":""' @mouseover="mouseOver('upload')" @mouseleave="mouseLeave()" @click="handleUpload">
                                <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClickXls">
                                <i class="el-icon-upload2" style="font-size:24px"></i><span style="font-size: 12px">导入</span>
                            </div>
                            <div class="replyTool" style="margin-left: 10px" :id='"share"===move?"style":""' @mouseover="mouseOver('share')" @mouseleave="mouseLeave()" @click="isFollow=!isFollow">
                                <i class="el-icon-share" style="font-size:24px"></i><span style="font-size: 12px">{{ isFollow?'关闭':'开启' }}聊天跟随</span>
                            </div>
                            <el-link :underline="false" :href="config.link+'images/快捷回复批量导入格式.xls'" style="margin-left:5px;font-size:12px" type="primary">模板下载</el-link>
                        </div>
                        <div style="margin: 10px;display: flex;justify-items: self-start;align-items:center">
                            <el-button-group>
                                <el-button size="mini" :type="showTile?'':'primary'" @click="changeTitle('title')">标题</el-button>
                                <el-button size="mini" :type="!showTile?'':'primary'" @click="changeTitle('content')">内容</el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <div>
                        <el-input
                            placeholder="关键词查询"
                            v-model="input"
                            clearable>
                        </el-input>
                    </div>
                    <div class="fixed tree">
                        <el-tree
                            :data="fast"
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }" style="border-bottom:1px solid #ccc" @click="copy(data)">
                                <span v-if="!showTile">{{data.title}}</span>
                                <span v-if="showTile">{{data.content}}</span>
                                <span style="font-size: 16px;float:right">
                                    <span style="margin-right: 10px" v-if="data.father_id" type="text" @click.stop="()=>sendShortcut(data)"><i class="el-icon-chat-dot-square"></i></span>
                                    <span style="margin-right: 10px" type="text" @click="()=>updateShortcut(data)"><i class="el-icon-edit"></i></span>
                                    <span style="margin-right: 10px" type="text" @click="()=>remove(node,data)"><i class="el-icon-delete"></i></span>
                                </span>
                                <!--<span>
                                    <el-button v-if="data.father_id" type="text" @click="()=>sendShortcut(data)"><i class="el-icon-chat-dot-square"></i></el-button>
                                    <el-button type="text" @click="()=>updateShortcut(data)"><i class="el-icon-edit"></i></el-button>
                                    <el-button type="text" @click="()=>remove(node,data)"><i class="el-icon-delete"></i></el-button>
                                </span>-->
                            </span>
                        </el-tree>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="客户" name="vipuser">
                    <div style="margin: 10px;display: flex;flex-direction: column">
                        <div>{{ info.toid?info.address:''}}</div>
                        <div @click="vip.show=true">
                            <el-button size="mini"><i class="el-icon-plus"></i>添加标签</el-button>
                        </div>
                        <el-divider content-position="right">vip信息</el-divider>
                        <div style="display: flex;justify-content: center">
                            <div>
                                姓名
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.name:''}}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                性别
                                <span style="font-size: 14px" v-if="info.toid&&vipData.sex">男</span>
                                <span style="font-size: 14px" v-if="info.toid&&!vipData.sex">女</span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                电话
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.phone:''}}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                年龄
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.age:''}}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                QQ
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.qq:''}}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                微信
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.wechat:'' }}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                IP
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.ip:'' }}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                地址
                                <span style="font-size: 14px">
                                    {{ info.toid?vipData.address:'' }}
                                </span>
                            </div>
                        </div>
                        <div style="display: flex;justify-content: center">
                            <div>
                                备注
                                <span style="font-size:14px">
                                    {{ info.toid?vipData.remarks:'' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="聊天记录" name="record">
                    <div style="margin-top: 10px">
                        <el-input
                            placeholder="聊天记录查询"
                            v-model="input1"
                            clearable>
                        </el-input>
                    </div>
                    <el-table
                        class="fixed"
                        :data="tableData"
                        style="width: 100%">
                        <el-table-column
                            prop="created_at"
                            align="center"
                            min-width="30%">
                            <template slot-scope="scope">
                                {{scope.row.created_at|date}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ip"
                            align="center"
                            min-width="30%">
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            align="center"
                            min-width="30%">
                        </el-table-column>
                        <el-table-column min-width="20%" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="lookRecord(scope.$index, scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-aside>
        <Dialog :dialog="dialog" :form="form" :tabledata="fast" @add="getShortcut()" @update="getShortcut()"></Dialog>
        <VipDialog :vip="vip" :info="info" @vipuser="vipuser"></VipDialog>
        <online-dialog :dialog="online" :userinfo="userTransfer" :customerinfo="onlinenow" @delSidebar="delSidebar($event)"></online-dialog>
        <vue-context ref="menu">
            <li>
                <el-link :underline="false" @click.prevent="onClick">加入黑名单</el-link>
            </li>
        </vue-context>
        <vue-context ref="withdraw">
            <li>
                <el-link :underline="false" @click.prevent="clickWithdraw">撤回消息</el-link>
            </li>
        </vue-context>
        <vue-context ref="translation">
            <li>
                <el-link :underline="false" @click.prevent="clickTranslation">翻译</el-link>
            </li>
        </vue-context>
        <RecordDialog :dialog="recordDialog" :info="recordData"></RecordDialog>
    </el-container>
</template>
<script>
import {getShortcut,delShortcut,uploadXsl,delManyShortcut} from "@/api/shortcut";
import Dialog from "@/views/home/components/Dialog";
import {imclick, blackEnd, findOnline, withdraw, sendMeClientGiveOther, translation, isUidOnline} from "@/api/admin";
import {toolHang} from "@/api/tool";
import { Picker } from 'emoji-mart-vue';
import { VueContext } from 'vue-context';
import XLSX from "xlsx";
import AES from "@/utils/AES";
import onlineDialog from "@/views/home/components/onlineDialog";
import {logout} from "@/api/user";
import VipDialog from "./components/VipDialog";
import {kgetContact} from "@/api/contact";
import RecordDialog from "./components/RecordDialog.vue";
const defaultForm={
    sort:999,
    title:'',
    content:'',
    id:0,
    father_id:0
};
let id = 1000;
export default {
    name: 'HomeIndex',
    components:{Picker,Dialog,VueContext,onlineDialog,VipDialog,RecordDialog},
    data() {
        return {
            input1:'',
            recordData1:[],
            recordData2:[],
            recordData:{
                toid:'',
                fromid:'',
                id:0,
                name:''
            },
            recordDialog:{
                show:false
            },
            tableData: [],
            blurryType:false,//在输入框输入的时候是否可以展示
            blurryData:[],
            isClick:'',//是否点击网页任意界面,才能执行声音操作
            height:'',//整体界面的动态高度
            //菜单类
            activeName: 'shortcut',//菜单切换的名字
            move:'',//动态样式,如果等于某个值,就更改背景颜色
            form:Object.assign({},defaultForm),//form表单
            excelData: {
                header: null,
                results: null
            },//上传的exceldata
            //vip的dialog信息
            vip:{
                show:false
            },
            //新增的dialog,和修改的dialog公用
            dialog:{
                show:false,
                title:''
            },
            showTile:'',//显示标题或者内容,为空则是显示标题
            input: '',//搜索快捷键
            fast:[],//快捷键的数据
            fuzzySearch:[],//用于搜索时,暂存快捷键的数据
            //聊天的面板
            isShow:'',//是否显示中间的聊天面板
            nohavemany:'',//暂无更多
            record:[],//当前聊天记录的数据.类似于用户的聊天记录数据->chatRecord
            withdrawData:{},//当前聊天的某一条数据
            content:'',//文本域文加密的内容显示
            kulay:'',//菜单栏的背景色
            translationText:'翻译文本内容',//翻译按钮的动态显示文字
            language:'en',//翻译后的目标语言
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
            visible:false,//选择翻译语言是否显示
            languageName:'英语',//翻译语言的名字
            state: '',//跟翻译挂钩的。ui必须绑定他.并没什么卵用
            loadingTop:false,//向上加载的动画
            translationData:{},//翻译存储的某种语言的简写和语言名字
            //左侧聊天侧边栏
            websock: null,//连接websock的实例
            currentHeight:0,//当前的聊天高度
            lastHeight:0,//上一次记录的聊天高度
            clickShow:'',//点击后的背景颜色
            activeNames: [],//其他客服的折叠面板["2","3","4"]
            addBlackEnd:{},//那一条用户加入黑名单
            userTransfer: {},//当前转接用户的信息
            onlinenow:[],//当前在线的客服
            online:{
                show:false,
                title:'',
                width:'',
            },//寻找在线客服的dialog
            chatRecord:[],//当前客服的信息
            otherChatRecord:[],//其他客服的信息
            rand:'',//登录后有值。如果当前客服在其他地方登录,就会被强制下线
            pings:'',//客户端给服务端ping的定时器
            //客户端给服务端ping
            givePingData:{
                type:'ping'
            },
            //绑定的信息
            info:{
                fromid:'',//客服的fromid
                toid:'',//和用户聊天的id
                client_id:'',//当前页面绑定的唯一client_id
                content:'',//加密后的内容
                name:'',//用户的ip
                type:'text',//默认类型
                isread:0,//是否阅读.未做
                tableId:0,//最后的一条消息的id,向上加载需要使用到
                webgroup:'',//在哪个租户的网站聊天的分组
                rand:'',//发送消息和发送图片所产生的随机数,因为发送出去后,如果没有指定的值,无法撤回指定消息,如果等待ID,会有延迟
                sendid:'',//发送消息和发送图片的一个id,
                is_server:1,//当前客服是否处于挂起状态
                address:'',//为了能看到用户的地址
                user:{
                    name:'',//客服的名字,
                    avatar:''//客服的头像
                }
            },
            vipData:{},
            temporary:[],//临时存放快捷语
            reconnect:'',//重新连接的时间
            style:{},
            isWidth:'',//判断是否点击当前用户得到宽度
            allWidth:0,//加上文本域组件的本身宽度
            isFollow:true,//是否开启跟随
        }
    },
    mounted() {
        this.$nextTick(function(){
            document.addEventListener("click",e=>{
                this.isClick="鼠标已经点击";
                this.blurryType=false;
            });
        });
    },
    filters:{
        date(v){
            if(v){
                return v.slice(0,10);
            }else{
                return v;
            }
        },
        sex(v){
            if(v){
                return '男';
            }else{
                return '女';
            }
        },
        address(v){
            if(v){
                return v;
            }else{
                return '未知地区';
            }
        },
        omit(v){
            if (v.length >15) {
                return v.slice(0,15) + '...';
            }
            return v;
        }
    },
    beforeDestroy() {
        clearInterval(this.pings);
    },
    created(){
        sessionStorage.setItem('cantgoclient','cant');
        //获取到body里面内容页的高度,减去navbar的高度
        this.height=document.body.clientHeight-84;
        this.initWebSocket();
        this.getShortcut();
        this.kgetContact();
        this.info.user.name=this.$store.getters.name;
        this.info.user.avatar=this.$store.getters.avatar;
        /*this.pings=setInterval(this.givePing,50000);*/
    },
    watch:{
        'input':function(){
            this.searchFor();
        },
        'input1':function(){
            this.searchFor1();
        }
    },
    methods:{
        //查看聊天记录
        lookRecord(index,row){
            this.recordDialog.show=true;
            //是從前端的角度傳過來。所以fromid是前端的fromid，需要改爲toid
            this.recordData.toid=row.fromid;
            this.recordData.fromid='访客'+row.ip;
            this.recordData.id=row.id;
            this.recordData.name=row.name;
        },
        //获取聊天记录
        kgetContact(){
            kgetContact()
                .then(res=>{
                    this.tableData=res.data;
                    this.recordData1=res.data;
                    this.recordData2=res.data;
                })
        },
        //获取文本域对于网页的宽度
        getWidth(){
            if(!this.isWidth){
                const textarea=this.$refs.contentArea;
                this.isWidth=this.getInputPositon(textarea).left;
                this.allWidth=this.isWidth+textarea.clientWidth;
            }
        },
        //按键监听
        keyup(event){
            if(event.key==='Enter'){
                this.send();
            }else{
                this.blurry();
            }
        },
        putText(row){
            this.content=row.content;
            this.$refs.contentArea.focus();
        },
        getInputPositon(elem){
            if(document.selection){//IE Support
                elem.focus();
                var Sel = document.selection.createRange();
                return{
                    left: Sel.boundingLeft,
                    top: Sel.boundingTop,
                    bottom: Sel.boundingTop + Sel.boundingHeight
                };
            }else{
                var cloneDiv = '{$clone_div}',cloneLeft= '{$cloneLeft}', cloneFocus = '{$cloneFocus}', cloneRight = '{$cloneRight}';
                var none = '<span style="white-space:pre-wrap;"> </span>';
                var div = elem[cloneDiv] || document.createElement('div'), focus = elem[cloneFocus] || document.createElement('span');
                var text = elem[cloneLeft] || document.createElement('span');
                var offset = this.offset(elem), index = this.getFocus(elem), focusOffset = { left: 0, top: 0 };
                if (!elem[cloneDiv]) {
                    elem[cloneDiv] = div, elem[cloneFocus] = focus;
                    elem[cloneLeft] = text;
                    div.appendChild(text);
                    div.appendChild(focus);
                    document.body.appendChild(div);
                    focus.innerHTML = '|';
                    focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                    div.className = this.cloneStyle(elem);
                    div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
                }
                div.style.left = this.offset(elem).left + "px";
                div.style.top = this.offset(elem).top + "px";
                var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
                text.innerHTML = strTmp;
                focus.style.display = 'inline-block';
                try {
                    focusOffset = this.offset(focus);
                }catch(e){

                }
                focus.style.display = 'none';
                return {
                    left: focusOffset.left,
                    top: focusOffset.top,
                    bottom: focusOffset.bottom
                };
            }
        },
        // 克隆元素样式并返回类
        cloneStyle(elem, cache) {
            if (!cache && elem['${cloneName}']) return elem['${cloneName}'];
            var className, name, rstyle = /^(number|string)$/;
            var rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth
            var cssText = [], sStyle = elem.style;
            /*for (name in sStyle) {
                if (!rname.test(name)) {
                    val = 'getComputedStyle' in window ? function (elem, name) {
                        return getComputedStyle(elem, null)[name];
                    } : function (elem, name) {
                        return elem.currentStyle[name];
                    };
                    if (val !== '' && rstyle.test(typeof val)) { // Firefox 4
                        name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                        cssText.push(name);
                        cssText.push(':');
                        cssText.push(val);
                        cssText.push(';');
                    }
                }
            }*/
            cssText = cssText.join('');
            elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
            return className;
        },
        // 获取光标在文本框的位置
        getFocus: function (elem) {
            var index = 0;
            if (document.selection) {// IE Support
                elem.focus();
                var Sel = document.selection.createRange();
                if (elem.nodeName === 'TEXTAREA') {//textarea
                    var Sel2 = Sel.duplicate();
                    Sel2.moveToElementText(elem);
                    var index = -1;
                    while (Sel2.inRange(Sel)) {
                        Sel2.moveStart('character');
                        index++;
                    }
                }
                else if (elem.nodeName === 'INPUT') {// input
                    Sel.moveStart('character', -elem.value.length);
                    index = Sel.text.length;
                }
            }
            else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox support
                index = elem.selectionStart;
            }
            return (index);
        },
        // 获取元素在页面中位置
        offset(elem) {
            var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;
            var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
            var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
            return {
                left: left,
                top: top,
                right: left + box.width,
                bottom: top + box.height
            };
        },
        //输入框输入的内容会展现在后面
        blurry(){
            if(this.isFollow){
                this.blurryType=false;
                const textarea=this.$refs.contentArea;
                this.style=this.getInputPositon(textarea);
                if(this.style.left>this.allWidth){
                    this.style.left=this.style.left-this.allWidth+this.isWidth+20;
                }
                if(this.content){
                    // filter()方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                    // 注意：filter()不会对空数组进行检测。
                    // 注意：filter()不会改变原始数组。
                    this.blurryData=this.fuzzySearch.filter(data=>{
                        // some() 方法用于检测数组中的元素是否满足指定条件;
                        // some() 方法会依次执行数组的每个元素：
                        // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                        // 如果没有满足条件的元素，则返回false。
                        // 注意： some() 不会对空数组进行检测。
                        // 注意： some() 不会改变原始数组。
                        return Object.keys(data).some(key=>{
                            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                            return String(data[key]).toLowerCase().indexOf(this.content)>-1
                        });
                    });
                    if(this.blurryData.length){
                        this.blurryType=true;
                    }
                }
            }
        },
        //窗口通知
        notifyMe(title,options) {
            // 先检查浏览器是否支持
            if(window.Notification){
                // 检查用户曾经是否同意接受通知
                /*let options = {
                    dir: "auto", // 文字方向
                    body: "通知：OBKoro1评论了你的朋友圈", // 通知主体
                    requireInteraction: true, // 不自动关闭通知
                };*/
                if(Notification.permission==='granted'){
                    var notification=new Notification(title,options);//显示通知
                }else if(Notification.permission==='default'){
                    //用户还未选择，可以询问用户是否同意发送通知
                    Notification.requestPermission().then(permission=>{
                        if(permission==='granted'){
                            var notification=new Notification(title,options);//显示通知
                        }
                    });
                }
            }
        },
        copy(data){
            if(this.info.toid){
                this.content=data.content;
                this.$refs.contentArea.focus();
            }
        },
        //如果添加的是当前的toid
        vipuser(info){
            this.vipData=info;
        },
        //左侧侧边栏
        websockclose(e){
            //狀態為3就是掉綫了
            if(e.currentTarget.readyState===3&&sessionStorage.getItem('islogout')){
                if(!this.reconnect){
                    this.$message.error('您的網絡有波動,正在无线重连中。');
                    this.chatRecord=[];
                    this.info.toid='';
                    this.otherChatRecord=[];
                    this.isShow='';
                    this.clickShow='';
                    this.content='';
                    this.rand='';//为了重新链接的时候不用重新被挤掉
                    this.reconnect='无限重连';
                    clearInterval(this.pings);
                }
                this.initWebSocket();
            }
        },
        //当客服接收到服务器发送过来的消息
        websocketonmessage(e){ //数据接收
            const message = JSON.parse(e.data);
            //console.log(message);
            switch (message.type) {
                case 'text': case 'img':
                    //用户发给我的
                    /*avatar: "images/avatar.gif"
                    client: "1"
                    client_id: "7f00000107d5000000f6"
                    content: "O3xdBqX7vxwnHyjj5AI+qw=="
                    fromid: "访客134.159.226.46"
                    isread: 0
                    jumplink: "http://www.baidu.com"
                    name: "小米1"
                    rand: "13qbc9dd2kn2020-09-21 15:18:05"
                    tableId: 0
                    title: "标题"
                    toid: "3"
                    type: "text"
                    webgroup: "api.waa.bfwgly.tw"*/

                    //客服发给用户的
                    /*client_id: "7f00000107d0000000f8"
                    content: "H6sOyC0daeWVHD4PC4U4yg=="
                    fromid: "3"
                    is_server: 1
                    isread: 0
                    name: "134.159.226.46"
                    rand: "aq010ji0cos2020-09-21 15:18:34"
                    sendid: 2
                    tableId: 602
                    toid: "访客134.159.226.46"
                    type: "text"
                    webgroup: "api.waa.bfwgly.tw"*/
                    //如果是用户发过来的,并且我点击了当前的用户正在进行聊天,所有客服都同时push这条数据
                    if(message.fromid===this.info.toid){
                        let obj={};
                        obj.fromid=message.fromid;
                        obj.toid=message.toid;
                        obj.rand=message.rand;
                        obj.loading='';
                        obj.created_at=this.getTime();
                        if(message.type==='text'){
                            obj.type=1;
                            obj.content=AES.decrypt(message.content);
                        }else{
                            obj.type=2;
                            obj.content=message.content;
                        }
                        this.record.push(obj);
                        if(this.isClick){
                            //this.$refs.audio.currentTime = 0.1;
                            this.$refs.audio.play(); //播放
                        }
                        //如果用户不在这个页面发送过来消息  就不会报错
                        if(this.$route.path==='/home/index'){
                            this.chatBottom();
                        }
                    }else{
                        var fromid='';
                        var toid='';
                        if(!message.client){
                            //客服发送的
                            fromid=message.fromid+'';
                            toid=message.toid;
                            let obj={};
                            obj.toid=toid;
                            obj.fromid=fromid;
                            obj.rand=message.rand;
                            obj.loading='';
                            if(message.type==='text'){
                                obj.type=1;
                                obj.content=AES.decrypt(message.content);
                            }else{
                                obj.type=2;
                                obj.content=message.content;
                            }
                            obj.withdraw='';
                            obj.created_at=this.getTime();
                            obj.user=message.user;
                            //因为sendid已经显示了发送的消息。所以只有在没有显示的其他客服里面进行显示
                            //这是其他客服帮助其他客服发送的
                                //我不等于用户分配的客服                       我不等于发送者的id
                            if(this.$store.getters.id+''!==fromid&&this.$store.getters.id+''!==message.sendid+''){
                                for (var ae=0;ae<this.otherChatRecord.length;ae++){
                                    if(this.otherChatRecord[ae].fromid+''===fromid){
                                        for(var af=0;af<this.otherChatRecord[ae].info.length;af++){
                                            if(this.otherChatRecord[ae].info[af].fromid===toid){
                                                this.otherChatRecord[ae].info[af].record.push(obj);
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            //用户分配的我这个客服，但是是其他客服帮助我发送的。
                            if(this.$store.getters.id+''===fromid&&this.$store.getters.id+''!==message.sendid+''){
                                for(var ag=0;ag<this.chatRecord.length;a++){
                                    if(this.chatRecord[ag].fromid===toid){
                                        this.chatRecord[ag].record.push(obj);
                                        break;
                                    }
                                }
                            }
                        }else{
                            //用户发送的,fromid是客服,toid是用户
                            fromid=message.toid+'';
                            toid=message.fromid;
                            let obj={};
                            obj.fromid=message.fromid;
                            obj.toid=message.toid;
                            obj.rand=message.rand;
                            obj.loading='';
                            obj.created_at=this.getTime();
                            if(message.type==='text'){
                                obj.type=1;
                                obj.content=AES.decrypt(message.content);
                                this.notifyMe(toid,{body:obj.content})
                            }else{
                                obj.type=2;
                                obj.content=message.content;
                                this.notifyMe(toid,{image:obj.content})
                            }
                            //如果是我不是用户分配过来的客服,那么我就在其他客服里面添加消息
                            if(this.$store.getters.id+''!==fromid){
                                for(var a=0;a<this.otherChatRecord.length;a++){
                                    if(this.otherChatRecord[a].fromid+''===fromid){
                                        for(var b=0;b<this.otherChatRecord[a].info.length;b++){
                                            if(this.otherChatRecord[a].info[b].fromid===toid){
                                                this.otherChatRecord[a].info[b].isread++;
                                                this.otherChatRecord[a].info[b].record.push(obj);
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }else{
                                //本尊在自己的聊天记录里面添加消息
                                for(var i=0;this.chatRecord.length;i++){
                                    if(message.fromid===this.chatRecord[i].fromid){
                                        this.chatRecord[i].isread++;
                                        this.chatRecord[i].record.push(obj);
                                        break;
                                    }
                                }
                            }
                            if(this.isClick){
                                //this.$refs.audio.currentTime = 0.1;
                                this.$refs.audio.play(); //播放
                            }
                        }
                    }
                    break;
                case 'transfer':
                    /*add: "菲律宾"
                    fromid: "访客134.159.226.46"
                    ip: "134.159.226.46"
                    isread: 0
                    model: "iPhone"
                    name: "小米1"
                    oldtoid: "2"
                    record: (15) [{…}, {…},{…},{…},{…},{…},{…},{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, __ob__: Observer]
                    toid: 3
                    type: "transfer"*/
                    //删除转接前的客服的对话列表的当前用户
                    for(var y=0;y<this.otherChatRecord.length;y++){
                        if(this.otherChatRecord[y].fromid+''===message.oldtoid+''){
                            for(var z=0;z<this.otherChatRecord[y].info.length;z++){
                                if(this.otherChatRecord[y].info[z].fromid===message.fromid){
                                    this.otherChatRecord[y].info.splice(z,1);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    //被转接的用户
                    if(message.toid+''===this.$store.getters.id+''){
                        this.$message.success('转接用户'+message.fromid);
                        let obj={};
                        obj.fromid=message.fromid;
                        obj.toid=message.toid;
                        obj.add=message.add;
                        obj.ip=message.ip;
                        obj.isread=message.isread;
                        obj.model=message.model;
                        obj.record=message.record;
                        obj.vip=message.vip;
                        obj.isonline='';
                        for(var aa=0;aa<this.chatRecord.length;aa++){
                            if(this.chatRecord[aa].fromid===message.fromid){
                                //如果数组里面有这个值。则直接返回。不需要push了
                                return ;
                            }
                        }
                        this.chatRecord.push(obj);
                    }else{
                        //其他的客服在转接后的客服里面添加信息
                        for(var ab=0;ab<this.otherChatRecord.length;ab++){
                            if(this.otherChatRecord[ab].fromid+''===message.toid+''){
                                var ac=1;
                                for(var ad=0;ad<this.otherChatRecord[ab].info.length;ad++){
                                    if(this.otherChatRecord[ab].info[ad].fromid===message.fromid){
                                        ac=0;
                                        break;
                                    }
                                }
                                if(ac){
                                    this.otherChatRecord[ab].info.unshift(message);
                                    break;
                                }
                            }
                        }
                    }
                    if(message.fromid===this.info.toid){
                        this.info.toid='';
                        this.clickShow='';
                        this.isShow='';
                        this.content='';
                    }
                    break;
                case 'close':
                    /*fromid: "3"
                    toid: ""
                    type: "close"
                    webgroup: "api.waa.bfwgly.tw"*/
                    /*fromid: "访客134.159.226.46"
                    toid: 2
                    type: "close"
                    webgroup: "api.waa.bfwgly.tw"*/
                    //用户匹配的客服,用户掉线掉线
                    if(this.$store.getters.id+''===message.toid+''){
                        for(var w=0;w<this.chatRecord.length;w++){
                            if(message.fromid===this.chatRecord[w].fromid){
                                //this.chatRecord.splice(w, 1);
                                /*if(this.info.toid===message.fromid){
                                    this.isShow='';
                                    this.clickShow='';
                                    this.info.toid='';
                                    this.content='';
                                }*/
                                this.chatRecord[w].isonline=new Date(this.getTime()).getTime()+60000;
                            }
                        }
                    }else{
                        //客服下线,toid是空
                        if(!message.toid){
                            //查询当前UID是否在线
                            /*isUidOnline(message)
                                .then(res=>{
                                    if(res.data===0){
                                        for(var j=0;j<this.otherChatRecord.length;j++){
                                            if(this.otherChatRecord[j].fromid+''===message.fromid+''){
                                                for(var b=0;b<this.otherChatRecord[j].info.length;b++){
                                                    if(this.otherChatRecord[j].info[b].fromid===this.info.toid){
                                                        this.info.toid='';
                                                        this.clickShow='';
                                                        this.content='';
                                                        this.isShow='';
                                                        break;
                                                    }
                                                }
                                                this.otherChatRecord.splice(j,1);
                                                break;
                                            }
                                        }
                                    }
                                });*/
                            for(var j=0;j<this.otherChatRecord.length;j++){
                                if(this.otherChatRecord[j].fromid+''===message.fromid+''){
                                    for(var b=0;b<this.otherChatRecord[j].info.length;b++){
                                        if(this.otherChatRecord[j].info[b].fromid===this.info.toid){
                                            this.info.toid='';
                                            this.clickShow='';
                                            this.content='';
                                            this.isShow='';
                                            break;
                                        }
                                    }
                                    this.otherChatRecord.splice(j,1);
                                    break;
                                }
                            }
                        }else{
                            //用户下线
                            for(var x=0;x<this.otherChatRecord.length;x++){
                                if(this.otherChatRecord[x].fromid+''===message.toid+''){
                                    for(var k=0;k<this.otherChatRecord[x].info.length;k++){
                                        if(this.otherChatRecord[x].info[k].fromid===message.fromid){
                                            this.otherChatRecord[x].info.splice(k,1);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            if(message.fromid===this.info.toid){
                                this.isShow='';
                                this.info.toid='';
                                this.clickShow='';
                            }
                        }
                    }
                    break;
                //客服点击任意客服后求得的操作
                case 'click':
                    /*add: "福建泉州"
                    fromid: "访客117.28.243.160"
                    ip: "117.28.243.160"
                    isread: 0
                    model: "其他设备"
                    record: (16) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                    toid: "2"
                    type: "click"*/
                    //用户和哪个客服在聊天,如果在和toid为2的客服聊天
                    if(this.$store.getters.id+''!==message.toid+''){
                        for(var t=0;t<this.otherChatRecord.length;t++){
                            if(this.otherChatRecord[t].fromid===message.toid){
                                for(var u=0;u<this.otherChatRecord[t].info.length;u++){
                                    if(this.otherChatRecord[t].info[u].fromid===message.fromid){
                                        this.otherChatRecord[t].info[u].isread=0;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }else{
                        //在和属于当前客服的用户聊
                        for(var v=0;v<this.chatRecord.length;v++){
                            if(this.chatRecord[v].fromid===message.fromid){
                                this.chatRecord[v].isread=0;
                                break;
                            }
                        }
                    }
                    break;
                //其他客服把用户加入黑名单
                case 'black':
                    /*fromid: "访客134.159.226.46"
                    toid: "3"
                    type: "black"*/
                    if(this.$store.getters.id+''!==message.toid+''){
                        for(var r=0;r<this.otherChatRecord.length;r++){
                            if(this.otherChatRecord[r].fromid+''===message.toid+''){
                                for(var s=0;s<this.otherChatRecord[r].info.length;s++){
                                    if(this.otherChatRecord[r].info[s].fromid===message.fromid){
                                        this.otherChatRecord[r].info.splice(j,1);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        if(this.info.toid===message.fromid){
                            this.isShow='';
                            this.info.toid='';
                            this.content='';
                        }
                    }
                    break;
                //客服点击挂起后更改其他人状态
                case 'hang':
                    /*fromid: 2
                    is_server: 0
                    type: "hang"*/
                    if(this.$store.getters.id+''!==message.fromid+''){
                        for (var q=0;q<this.otherChatRecord.length;q++){
                            if(this.otherChatRecord[q].fromid+''===message.fromid+''){
                                this.otherChatRecord[q].is_server=message.is_server;
                                break;
                            }
                        }
                    }
                    break;
                //收到其他用户撤回的消息
                case 'withdraw':
                    /*fromid: "2"
                    rand: "2ipcsod1gp02020-09-21 13:05:06"
                    toid: "访客134.159.226.46"
                    type: "withdraw"*/
                    //先循环其他客服的面板.循环到了再循环这个客服手里对话的客服人数.再循环他们的聊天记录
                    if(this.$store.getters.id+''!==message.fromid+''){
                        for(var o=0;o<this.otherChatRecord.length;o++){
                            if(this.otherChatRecord[o].fromid+''===message.fromid+''){
                                for(var p=0;p<this.otherChatRecord[o].info.length;p++){
                                    if(this.otherChatRecord[o].info[p].fromid===message.toid){
                                        for(var c=0;c<this.otherChatRecord[o].info[p].record.length;c++){
                                            if(this.otherChatRecord[o].info[p].record[c].rand===message.rand){
                                                this.otherChatRecord[o].info[p].record[c].withdraw='已经撤回消息';
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                //当我上线后。其他客服会给我他的信息
                case 'givemeinfo':
                    /*fromid: "3"
                    info: [__ob__: Observer]
                    is_server: 1
                    name: "小米1"
                    type: "givemeinfo"*/
                    //其他的客服上线才给当前客服 得到他们的信息
                    if(this.$store.getters.id+''!==message.fromid+''){
                        var m=1;
                        for(var n=0;n<this.otherChatRecord.length;n++){
                            if(this.otherChatRecord[n].fromid+''===message.fromid+''){
                                m=0;
                                break;
                            }
                        }
                        if(m){
                            let obj={};
                            obj.fromid=message.fromid+'';
                            obj.info=message.info;
                            obj.is_server=message.is_server;
                            obj.name=message.name;
                            this.otherChatRecord.unshift(obj);
                            this.activeNames.unshift(message.fromid);//其他客服的折叠面板数组
                        }
                    }
                    break;
                case 'online':
                    /*avatar: "storage/449dbd0ab8b64a898940085a0b485baf/avatar/202009181849572861.png"
                    content: "<p>欢迎语</p>"
                    fromid: "2"
                    is_server: 1
                    name: "小米"
                    type: "online"*/
                    //其他客服上线
                    if(this.$store.getters.id+''!==message.fromid+''){
                        var tag=1;
                        //如果有其他客服上线。我会把我自己的聊天信息全部给他，并且给这个用户生成一个信息
                        for(var l=0;l<this.otherChatRecord.length;l++){
                            if(this.otherChatRecord[l].fromid+''===message.fromid+''){
                                tag=0;
                                break;
                            }
                        }
                        if(tag){
                            let obj={};
                            obj.fromid=message.fromid+'';
                            obj.is_server=message.is_server;
                            obj.name=message.name;
                            obj.info=[];
                            this.otherChatRecord.unshift(obj);
                        }
                        let send={};
                        send.fromid=this.$store.getters.id+'';
                        send.is_server=this.info.is_server;
                        send.name=this.$store.getters.name;
                        send.info=this.chatRecord;
                        send.type='givemeinfo';
                        sendMeClientGiveOther(send);
                    }else{
                        if(this.rand){
                            this.logout();
                        }else{
                            this.rand='如果这个值为真,那么就被挤下去';
                        }
                    }
                    break;
                //用戶告訴我，他上綫了
                case 'tell':
                    /*add: "菲律宾"
                    fromid: "访客134.159.226.46"
                    ip: "134.159.226.46"
                    isread: 0
                    model: "其他设备"
                    record: (15) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, __ob__: Observer]
                    toid: "2"
                    type: "tell"*/
                    //如果是用户匹配到当前客服
                    if(message.toid+''===this.$store.getters.id+''){
                        let obj={};
                        obj.fromid=message.fromid;
                        obj.toid=message.toid;
                        obj.add=message.add;
                        obj.ip=message.ip;
                        obj.isread=message.isread;
                        obj.model=message.model;
                        obj.record=message.record;
                        obj.vip=message.vip;
                        obj.isonline='';
                        for(var d=0;d<this.chatRecord.length;d++){
                            if(this.chatRecord[d].fromid===message.fromid){
                                this.chatRecord[d].isonline='';
                                //如果数组里面有这个值。则直接返回。不需要push了
                                return ;
                            }
                        }
                        this.chatRecord.unshift(obj);
                    }else{
                        for(var f=0;f<this.otherChatRecord.length;f++){
                            if(this.otherChatRecord[f].fromid+''===message.toid+''){
                                var g=1;
                                for(var h=0;h<this.otherChatRecord[f].info.length;h++){
                                    if(this.otherChatRecord[f].info[h].fromid===message.fromid){
                                        g=0;
                                        break;
                                    }
                                }
                                if(g){
                                    this.otherChatRecord[f].info.unshift(message);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                //message={type: "bind", client_id: "7f00000108ff0000001f"}
                case 'bind':
                    this.info.fromid=this.$store.getters.id+'';
                    this.info.client_id=message.client_id;
                    this.info.webgroup='api.'+this.config.url;
                    this.$store.dispatch('websock/bind',this.info)
                        .then(()=>{
                            this.websocketsend(JSON.stringify(this.info));
                            this.imOnline();
                            this.pings=setInterval(this.givePing,50000);
                            this.$message.success('连接成功');
                            this.reconnect='';
                        });
                    break;
            }
        },
        //给服务端发送心跳
        givePing(){
            if(this.websock.readyState===1){
                this.websock.send(JSON.stringify(this.givePingData));
            }
            this.isOnlineDel();
        },
        //循环一遍是否有离线的老表
        isOnlineDel(){
            let newTime=new Date(this.getTime()).getTime();
            for(var i=0;i<this.chatRecord.length;i++){
                if(this.chatRecord[i].isonline){
                    if(newTime>this.chatRecord[i].isonline){
                        if(this.info.toid===this.chatRecord[i].fromid){
                            this.isShow='';
                            this.clickShow='';
                            this.info.toid='';
                            this.content='';
                        }
                        this.chatRecord.splice(i,1);
                    }
                }
            }
        },
        //改变元素的top值
        async handleScroll (e) {
            if(this.lastHeight===0){
                var div = document.getElementById('heightBottom');
                this.lastHeight=div.scrollHeight;
            }
            if(e.currentTarget.scrollTop===0){
                if(this.nohavemany===''){
                    this.loadingTop=true;
                    this.$store.dispatch('websock/infiniteScroll',this.info)
                        .then(res=>{
                            if(res.data.length===0){
                                this.nohavemany='暂无更多';
                                return this.loadingTop=false;
                            }
                            this.info.tableId=res.data[0].id;
                            var length=res.data.length;
                            for(var i=length-1;i>=0;i--){
                                let obj={};
                                obj.id=res.data[i].id;
                                obj.fromid=res.data[i].fromid;
                                obj.toid=res.data[i].toid;
                                obj.type=res.data[i].type;
                                obj.content=res.data[i].content;
                                obj.loading=res.data[i].loading;
                                obj.withdraw=res.data[i].withdraw;
                                obj.rand=res.data[i].rand;
                                obj.created_at=res.data[i].created_at;
                                obj.user=res.data[i].user;
                                this.record.unshift(obj);
                                this.loadingTop=false;
                            }
                            this.currentPosition();
                        });
                }
            }
        },
        //转接后删除一个侧边栏
        delSidebar(info){
            for(var i=0;i<this.chatRecord.length;i++){
                if(info.fromid===this.chatRecord[i].fromid){
                    this.chatRecord.splice(i,1);
                    if(this.info.toid===info.fromid){
                        this.isShow='';
                        this.info.toid='';
                        this.content='';
                        this.clickShow='';
                    }
                    break;
                }
            }
        },
        //选择哪个用户转接给其他客服
        async transfer(item){
            this.userTransfer=item;
            await this.findOnline();
            this.online={
                title:"转接给在线客服",
                show:true,
                width:"20%"
            }
        },
        //查询当前的在线客服
        findOnline(){
            findOnline()
                .then(res=>{
                    this.onlinenow=res.data;
                })
        },
        clickList(v){
            /*add: "菲律宾"
            fromid: "访客134.159.226.46"
            ip: "134.159.226.46"
            isread: 0
            model: "其他设备"
            record: Array(16)
            toid: "3"*/
            if(this.info.toid!==v.fromid){
                //如果有未读消息,点击后我会让其他客服的未读消息都为0
                if(v.isread){
                    imclick(v);
                }
                this.vipData=v.vip;
                this.info.address=v.add;
                this.nohavemany='';//暂无更多
                if(v.record.length!==0){
                    this.info.tableId=v.record[0].id;
                }
                v.isread=0;//让我当前的未读消息变为0
                this.info.fromid=v.toid+'';
                this.info.name=v.ip;
                this.info.toid=v.fromid;
                this.record=v.record;
                this.clickShow=v.ip;//背景颜色
                this.isShow=v.ip;//是否显示聊天框
                this.lastHeight=0;
                this.isWidth='';
                this.move='';//点击后必须移动才有颜色。直接等于空试试
                this.chatBottom();
            }
        },
        //当绑定成功了，再告诉用户。我已经上线了。
        imOnline(){
            this.info.name=this.$store.getters.name;
            this.$store.dispatch('admin/online',this.info);
        },
        //给gateway发送一个消息,存到session里面
        websocketsend(agentData){//数据发送
            this.websock.send(agentData);
        },
        //初始化weosocket
        initWebSocket(){
            //ws地址,连接websock
            const wsuri =this.config.ws;
            this.websock = new WebSocket(wsuri);
            //获取到fromid->服务器的user表唯一ID,对于用户来说,fromid->访客+{ip}
            //var fromid=this.$store.getters.id;
            //当客服接收到服务器发送过来的消息
            this.websock.onmessage=this.websocketonmessage;
            this.websock.onclose=this.websockclose;
        },
        //中间聊天类
        handleSelect(item) {
            for(var a=0;a<this.languageData.length;a++){
                if(this.languageData[a].name===item.name){
                    this.language=item.name;
                    this.languageName=item.value;
                    this.visible=false;
                    break;
                }
            }
        },
        //下面两个是翻译搜索弹出来的下拉框
        querySearch(queryString, cb) {
            let languageDatas=this.languageData;
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
            this.language=info.name;
            this.languageName=info.value;
            this.visible=false;
        },
        //翻译文本域里面的内容
        translationContent(){
            if(!this.content.trim()){
                this.content='';
                return this.$message.error('聊天内容不能为空');
            }
            this.translationText='翻译中,请稍等……';
            let obj={};
            obj.content=this.content;
            obj.language=this.language;
            translation(obj)
                .then(res=>{
                    this.content=res.data.content;
                    this.translationText='翻译文本内容';
                })
        },
        //剪切板粘贴到内容里面进行发送图片
        pasteImg(e) {
            const cbd = e.clipboardData;
            const ua = window.navigator.userAgent;
            // 如果是 Safari 直接 return
            if (!(e.clipboardData && e.clipboardData.items)) {
                return;
            }
            if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
                cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
                ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
                return;
            }
            if(cbd.items[0].kind==='string' && typeof cbd.items[1]==='undefined'){
                return ;
            }
            /*for(let i=0;i<cbd.items.length;i++){
                let item=cbd.items[i];
                if(item.kind==="file"){
                    // blob 就是从剪切板获得的文件，可以进行上传或其他操作
                    const blob=item.getAsFile();
                    if(blob.size===0){
                        return;
                    }
                    return this.upload(blob);
                }else{
                    var that=this;
                    item.getAsString(function (str) {
                        // str 是获取到的字符串
                        return that.content=str;
                    });
                }
                /!*if(item.kind==="string"){

                }*!/
            }*/
            //针对图片的copy信息
            if(cbd.items[0].kind==="file"||cbd.items[1].kind==="file"){
                // blob 就是从剪切板获得的文件，可以进行上传或其他操作
                let blob='';
                for(var i=0;i<cbd.items.length;i++){
                    if(cbd.items[i].kind==='file'){
                        blob=cbd.items[i].getAsFile();
                        break;
                    }
                }
                if(blob.size===0){
                    return;
                }
                return this.upload(blob);
            }
            //针对文字的copy信息
            let item=cbd.items[0];
            if(item.kind==="string"){
                const myField = this.$refs.contentArea;
                if (myField.selectionStart || myField.selectionStart === 0) {
                    this.content = myField.value;
                }
                /*
                item.getAsString(function (str) {
                    console.log(str)
                    // str 是获取到的字符串
                    that.content=str;
                });*/
            }
        },
        //发送图片
        sendPic(e){
            var file=e.target.files[0];
            this.$refs.pathClear.value='';
            this.upload(file);
        },
        //上传图片到服务器
        upload(file){
            var form_data=new FormData();
            var type=file.type.split('/')[0];//image
            var size=file.size / 1024 / 1024 < 10;//image
            if(type!=='image'){
                return this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
            }
            if(!size){
                return this.$message.error('上传图片大小不能超过 10MB!');
            }
            this.info.rand=Number(Math.random().toString().substr(2)).toString(36)+this.getTime();
            form_data.append("file",file);
            form_data.append("toid",this.info.toid);
            form_data.append("fromid",this.info.fromid);
            form_data.append("sendid",this.$store.getters.id);
            form_data.append("rand",this.info.rand);
            form_data.append("name",this.$store.getters.name);
            form_data.append("avatar",this.$store.getters.avatar);
            this.$store.dispatch('websock/sendPic',form_data);
            let obj={};
            obj.content=URL.createObjectURL(file);
            obj.rand=this.info.rand;
            obj.toid=this.info.toid;
            obj.fromid=this.info.fromid;
            obj.type=4;
            obj.withdraw='';
            obj.created_at=this.getTime();
            let user={};
            user.avatar=this.$store.getters.avatar;
            user.name=this.$store.getters.name;
            obj.user=user;
            this.record.push(obj);
            this.chatBottom();
        },
        //发送文本消息
        send(){
            if(this.content.trim()===''){
                this.content='';
                return this.$message.error('聊天内容不能为空');
            }
            if(this.info.toid===''){
                return this.$message.error('不能给未指定用户发送');
            }
            var date=this.getTime();
            this.info.rand=Number(Math.random().toString().substr(2)).toString(36)+date;
            this.info.content=AES.encrypt(this.content);
            this.info.sendid=this.$store.getters.id;
            this.$store.dispatch('websock/sendMsg',this.info);
            let obj={};
            obj.content=this.content;
            this.content='';
            obj.toid=this.info.toid;
            obj.fromid=this.info.fromid;
            obj.type=1;
            obj.withdraw='';
            obj.created_at=date;
            obj.rand=this.info.rand;
            let user={};
            user.avatar=this.$store.getters.avatar;
            user.name=this.$store.getters.name;
            obj.user=user;
            this.record.push(obj);
            this.chatBottom();
            //当前的fromid是this.sendMsgInfo.fromid;
        },
        //菜单栏 移出
        mousebye(){
            this.kulay='';
        },
        //菜单栏 移入
        mousego(v){
            this.kulay=v;
        },
        //添加表情到文本域里面
        addEmoji(e) {
            this.content += e.native;
        },
        //撤回消息
        withdraw(info,event){
            if(!info.withdraw){
                this.withdrawData=info;
                this.$refs.withdraw.open(event);
            }
        },
        //点击撤回消息后
        clickWithdraw(){
            for(var i=0;i<this.record.length;i++){
                if(this.withdrawData.rand===this.record[i].rand){
                    this.record[i].withdraw='已经撤回';
                    break;
                }
            }
            withdraw(this.withdrawData)
        },
        //点击翻译后
        clickTranslation(){
            for(var a=0;a<this.record.length;a++){
                if(this.record[a].rand===this.translationData.rand){
                    this.record[a].loading='开始转圈圈';
                    break;
                }
            }
            translation(this.translationData)
                .then(res=>{
                    for(var a=0;a<this.record.length;a++){
                        if(this.record[a].rand===res.data.rand){
                            this.record[a].content=res.data.content;
                            this.record[a].loading='';
                            break;
                        }
                    }
                });
        },
        //翻译
        translation(info,event){
            this.translationData=info;
            this.$refs.translation.open(event);
        },
        //菜单类
        //快捷语类
        //删除当前快捷语
        remove(node, data) {
            if(confirm('确定要删除吗')===true){
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                delShortcut(data.id);
            }
        },
        //修改快捷语的dialog
        updateShortcut(row){
            this.form=Object.assign({},row);
            this.dialog={
                show:true,
                title:'编辑常用回复'
            };
        },
        //发送快捷语给用户
        sendShortcut(row) {
            if(!this.info.toid){
                return this.$message.error('不能给未指定用户发送');
            }
            this.blurryType=false;
            this.info.content=AES.encrypt(row.content);
            this.info.sendid=this.$store.getters.id;
            let obj={};
            obj.content=row.content;
            obj.fromid=this.info.fromid;
            obj.toid=this.info.toid;
            obj.type=1;
            obj.withdraw='';
            obj.created_at=this.getTime();
            this.info.rand=Number(Math.random().toString().substr(2)).toString(36)+obj.created_at;
            obj.rand=this.info.rand;
            this.record.push(obj);
            this.chatBottom();
            this.$store.dispatch('websock/sendMsg',this.info);
        },
        //获取快捷回复
        getShortcut(){
            getShortcut()
                .then(res=>{
                    this.fast=res.data;
                    this.temporary=res.data;
                    this.fuzzySearch=[];
                    for(var i=0;i<res.data.length;i++){
                        if(res.data[i].children===undefined){
                            continue;
                        }
                        for(var j=0;j<res.data[i].children.length;j++){
                            this.fuzzySearch.push(res.data[i].children[j]);
                        }
                    }
                });
        },
        //关键词查询
        searchFor1(){
            if(this.input1){
                // filter()方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                // 注意：filter()不会对空数组进行检测。
                // 注意：filter()不会改变原始数组。
                this.tableData=this.recordData1.filter(data=>{
                    // some() 方法用于检测数组中的元素是否满足指定条件;
                    // some() 方法会依次执行数组的每个元素：
                    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                    // 如果没有满足条件的元素，则返回false。
                    // 注意： some() 不会对空数组进行检测。
                    // 注意： some() 不会改变原始数组。
                    return Object.keys(data).some(key=>{
                        // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                        // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                        return String(data[key]).toLowerCase().indexOf(this.input1)>-1
                    });
                });
            }
            if(this.input1===''){
                this.tableData=this.recordData2;
            }
        },
        //关键词查询
        searchFor(){
            if(this.input){
                // filter()方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                // 注意：filter()不会对空数组进行检测。
                // 注意：filter()不会改变原始数组。
                this.fast=this.fuzzySearch.filter(data=>{
                    // some() 方法用于检测数组中的元素是否满足指定条件;
                    // some() 方法会依次执行数组的每个元素：
                    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                    // 如果没有满足条件的元素，则返回false。
                    // 注意： some() 不会对空数组进行检测。
                    // 注意： some() 不会改变原始数组。
                    return Object.keys(data).some(key=>{
                        // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                        // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                        return String(data[key]).toLowerCase().indexOf(this.input)>-1
                    });
                });
            }
            if(this.input===''){
                this.fast=this.temporary;
            }
        },
        //显示快捷语的标题或者是内容
        changeTitle(info){
            if(info==='title'){
                this.showTile='';
            }else{
                this.showTile='显示标题';
            }
        },
        //下面8个方法也懵了反正就是excel上传快捷语,方法缩小，然后看分割线到什么位置截止
        //-------------------------------分割线
        generateData({ header, results }) {
            this.excelData.header = header
            this.excelData.results = results
            this.onSuccess && this.onSuccess(this.excelData)
        },
        uploadXsl(rawFile) {
            this.$refs['excel-upload-input'].value = null // 修复无法选择相同的Excel
            if (!this.beforeUpload) {
                this.readerData(rawFile)
                return
            }
            const before = this.beforeUpload(rawFile)
            if (before) {
                this.readerData(rawFile)
            }
        },
        readerData(rawFile) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => {
                    const data = e.target.result
                    const workbook = XLSX.read(data, { type: 'array' })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const header = this.getHeaderRow(worksheet)
                    const results = XLSX.utils.sheet_to_json(worksheet)
                    this.generateData({ header, results })
                    resolve()
                }
                reader.readAsArrayBuffer(rawFile)
            })
        },
        getHeaderRow(sheet) {
            const headers = []
            const range = XLSX.utils.decode_range(sheet['!ref'])
            let C
            const R = range.s.r
            /* start in the first row */
            for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
                const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
                /* find the cell in the first row */
                let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
                if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
                headers.push(hdr)
            }
            return headers
        },
        //点开导入按钮
        handleUpload() {
            this.$refs['excel-upload-input'].click()
        },
        //点开导入按钮
        handleClickXls(e) {
            const files = e.target.files
            const rawFile = files[0] // only use files[0]
            if (!rawFile) return
            this.uploadXsl(rawFile)
        },
        //上传excel的文件大小
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1
            if (isLt1M) {
                return true
            }
            this.$message({
                message: '请不要上传大于1M的文件.',
                type: 'warning'
            })
            return false
        },
        //上传excel的快捷语
        onSuccess({ results, header }) {
            var data=[];
            for(var i=0;i<results.length;i++){
                var object={numbering:results[i].分类编号,categoryName:results[i].分类名称,content:results[i].内容,title:results[i].标题};
                let obj={};
                obj.numbering=object.numbering;
                obj.categoryName=object.categoryName;
                obj.content=object.content;
                obj.title=object.title;
                data.push(obj);
            }
            uploadXsl(data)
                .then(()=>{
                    this.getShortcut();
                })
        },
        //-------------------------------分割线
        //添加快捷语的dialog
        addShortcut(){
            this.form=Object.assign({},defaultForm);
            this.dialog={
                show:true,
                title:'添加常用回复'
            };
        },
        //移入菜单样式
        mouseOver: function(v){
            if(this.clickShow!==v){
                this.move=v;
            }
        },
        //移出菜单样式
        mouseLeave: function () {
            this.move ='';
        },
        handleClick(tab, event) {

        },
        //右键加入黑名单
        openmenu(info,event){
            this.addBlackEnd=info;
            this.$refs.menu.open(event);
        },
        //点击加入黑名单后
        onClick(){
            blackEnd(this.addBlackEnd)
            .then(()=>{
                for(var i=0;i<this.chatRecord.length;i++){
                    if(this.chatRecord[i].ip===this.addBlackEnd.ip){
                        this.chatRecord.splice(i,1);
                        if(this.info.toid===this.addBlackEnd.fromid){
                            this.isShow='';
                            this.content='';
                            this.info.toid='';
                        }
                        break;
                    }
                }
            })
        },
        //在其他地方进行登录.当前退出
        async logout() {
            sessionStorage.setItem('islogout','');
            await this.$store.dispatch('user/logout1',this.$store.getters.client_id);
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        //让聊天框到达上一次的位置->无等待时间
        currentPosition(){
            this.$nextTick(function(){
                var div = document.getElementById('heightBottom');
                //第一次是1000 第二次是2000 第三次是3000
                this.currentHeight=div.scrollHeight-this.lastHeight;
                this.lastHeight=div.scrollHeight;
                div.scrollTop = this.currentHeight;
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
            var hour= myDate.getHours();
            if(hour<10){
                hour='0'+hour;
            }
            var minutes= myDate.getMinutes();
            if(minutes<10){
                minutes='0'+minutes;
            }
            var seconds= myDate.getSeconds();
            if(seconds<10){
                seconds='0'+seconds;
            }
            return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
        },
        //让聊天框到达最底部
        chatBottom(){
            this.$nextTick(function(){
                var div = document.getElementById('heightBottom');
                div.scrollTop = div.scrollHeight+666;
            });
        },
    }
}
</script>
<style lang="scss">
.tree{
    .el-tree-node {
        white-space: normal;
        .el-tree-node__content {
            height: 90%;
            align-items: start;
        }
    }
}
</style>
<style scoped>
@import '~vue-context/dist/css/vue-context.css';
@import "../../assets/aliicon/iconfont.css";
.el-table__row>td{
    border: none;
}
.el-table::before {
    height: 0px;
}
>>>.has-gutter{
    display: none;
}
/*隐藏滚动条*/
::-webkit-scrollbar {
    width: 0 !important;
}
::-webkit-scrollbar {
    width: 0 !important;height: 0;
}
.itemShow{
    cursor: pointer;  /*鼠标悬停变小手*/
    background:#ccc ;
    height: 50px;
    font-size: 14px;
    color: #000;
    display: flex;
    flex-direction: row ;
    justify-content: space-between;
}
/*隐藏滚动条*/
#style{
    background:	#F8F8F8;
}
.replyTool{
    display: flex;
    justify-content: flex-start;
    align-items:center;
    cursor: pointer;  /*鼠标悬停变小手*/
}
.custom-tree-node {
    flex: 1;
    /*display: flex;
    align-items: center;
    justify-content: space-between;*/
    font-size: 14px;
    padding-right: 8px;
    line-height: 25px;
}
>>>.to .el-loading-spinner {
    margin-top: -8px !important;
}
>>>.el-collapse-item__content {
    padding-bottom: 0;
}
.excel-upload-input{
    display: none;
    z-index: -9999;
}
.drop{
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
}
.fixed{
    width: 100%;
    height: calc(100vh - 211px);
    /*border: 1px green solid;*/
    overflow-y: scroll;
}
.tooltip{
    margin: 4px;
}
.title{
    display: flex;
    align-items:center;
}
.hand{
    cursor: pointer;  /*鼠标悬停变小手*/
}

.hiddenupload{
    position: relative;
    cursor: pointer;
    overflow: hidden;
    display: inline-block;
    text-decoration: none;
}
.hiddenupload input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}
.sendpic{
    width: auto;
    height: auto;
    max-width:100%;
    max-height: 100%;
}
#changecolor{
    background: #ccc;
}
.from{
    flex-direction: row-reverse;
}
.toHeader,.fromHeader{
    width: 40px;
    height: 40px;
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
.toMsgTime,.fromMsgTime{
    margin: 13px 15px;
    display: flex;
}
.fromMsgTime{
    flex-direction: row-reverse;
}
.to,.from{
    margin: 0px 15px;
    display: flex;
    align-items: center;
    font-size: 15px;
}
.column{
    display: flex;
    flex-grow: 1;
}
.msg-area {
    outline:0;
    width: 100%;
    resize: none;
    border: none;
    overflow-y: auto;
}
.ui{
    display: flex;
    height:30px;
}
.content{
    width: 100%;
    height: calc(100vh - 400px);
    /*border: 1px green solid;*/
    overflow-y: scroll;
}
.box-1{
    height: 100%;
    padding: 20px;
    margin: 0 auto;
    color: #595B66;
    font-family: 'Microsoft Yahei', sans-serif;
}
.right{
    margin: 5px;
    display: flex;
    align-items: center;
}
.aside{
    margin:5px;
    box-sizing: border-box;
    line-height:20px;
    display: flex;
    flex-direction: column ;
    justify-content: space-between;
}

.box{
    border-right: 1px #E2E2E2 solid;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.box-2{
    border-left: 1px #E2E2E2 solid;
}
.item{
    cursor: pointer;  /*鼠标悬停变小手*/
    border-bottom: 1px solid #E2E2E2;
    height: 50px;
    font-size: 14px;
    color: #000;
    display: flex;
    flex-direction: row ;
    justify-content: space-between;
}
.el-aside{
    margin-bottom:0;
    padding: 0 0;
    background: #fff;
}
</style>
