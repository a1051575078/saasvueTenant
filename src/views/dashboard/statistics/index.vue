<template>
    <div class="dashboard-editor-container">
        <div style="display: flex;justify-content:flex-end">
            <el-button-group>
                <el-button :type="showColor==='today'?'primary':''" @click="clickDay('today')">今日</el-button>
                <el-button :type="showColor==='yesterday'?'primary':''" @click="clickDay('yesterday')">昨日</el-button>
                <el-button :type="showColor==='before'?'primary':''" @click="clickDay('before')">一周内</el-button>
            </el-button-group>
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 10px">
            <div style="width: 80%;height: 100%" ref="getheight">
                <div style="display: flex;justify-content: space-between;margin-bottom: 20px">
                    <div class="card-panel" @click="choose('visitors')">
                        <div class="card-panel-icon-wrapper icon-people">
                            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                访客数
                            </div>
                            <count-to :start-val="0" :end-val="details.visitors" :duration="1000" class="card-panel-num" />
                        </div>
                    </div>
                    <div class="card-panel" @click="choose('msg')">
                        <div class="card-panel-icon-wrapper icon-message">
                            <svg-icon icon-class="message" class-name="card-panel-icon" />
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                消息数
                            </div>
                            <count-to :start-val="0" :end-val="details.msg" :duration="1000" class="card-panel-num" />
                        </div>
                    </div>
                    <div class="card-panel" @click="choose('blacks')">
                        <div class="card-panel-icon-wrapper icon-lock">
                            <svg-icon icon-class="lock" class-name="card-panel-icon" />
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                黑名单
                            </div>
                            <count-to :start-val="0" :end-val="details.blacks" :duration="1000" class="card-panel-num" />
                        </div>
                    </div>
                    <div class="card-panel" @click="choose('evaluation')">
                        <div class="card-panel-icon-wrapper icon-star">
                            <svg-icon icon-class="star" class-name="card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                评价
                            </div>
                            <count-to :start-val="0" :end-val="details.evaluation" :duration="1000" class="card-panel-num" />
                        </div>
                    </div>
                </div>
                <el-row style="background:#fff;padding:10px" v-show="!lookTable">
                    <!--<line-chart :chart-data="lineChartData" />-->
                    <Echarts :details="details" :cntime="cnTime"></Echarts>
                </el-row>
                <div v-if="lookTable==='visitors'">
                    <Visitor :visitordata="visitorData" @back="back"></Visitor>
                </div>
                <div v-if="lookTable==='msg'">
                    <Msg :msg="msgData" :customerinfo="customerInfo" @back="back"></Msg>
                </div>
                <div>
                    <Blacks :blacksdata="blacksData" :dialog="dialog"></Blacks>
                </div>
                <div>
                    <Evaluation :evaluationdata="evaluationData" :evaluation="evaluation"></Evaluation>
                </div>
            </div>
            <div style="width: 20%;margin-left:20px">
                <div class="right" style="width: 100%;height: 100%">
                    <div style="text-align: center;margin-top: 10px;font-size: 14px" ref="delheight">
                        <mallki class-name="mallki-text" text="查看客服统计数据" />
                    </div>
                    <div style="padding: 10px;overflow-y:auto;" :style="{height:height+'px'}">
                        <div style="display: flex;justify-content:flex-start;flex-wrap: wrap" v-show="!isLook">
                            <div @click="info(item)" class="style color" style="cursor:pointer;width: 33%;text-align: center" v-for="item in userInfo">
                                {{ item.name }}
                            </div>
                        </div>
                        <div v-show="isLook">
                            <i class="el-icon-back" style="cursor:pointer;font-size: 24px" @click="isLook=''"></i>
                            <div style="display: flex;align-items: center;flex-direction: column">
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">接待有效客户</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.clientnum}}</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">消息数量</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.msgnum}}</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">好评数/率</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.evaluation}}%</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">平均响应</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.averagetime}}分</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">平均对话</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.dialogue}}分</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">平均首次回复</div>
                                    <div style="display: flex;justify-content: center;font-weight: bold">{{userData.firstime}}分</div>
                                </div>
                                <div style="margin-top: 10px">
                                    <div style="font-size:12px;display: flex;justify-content: center">工作时长</div>
                                </div>
                            </div>
                            <div ref="echarts" style="height: 10px"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import Echarts from './components/Echarts';
import CountTo from "vue-count-to";
import Mallki from '@/components/TextHoverEffect/Mallki'
import {detailed, getAllStatistics, getBlack, getEvaluation, getVisitorData} from "@/api/work";
import echarts from "echarts";
import resize from "@/views/dashboard/statistics/components/mixins/resize";
import Visitor from "./components/Visitor";
import Msg from "./components/Msg";
import Blacks from "./components/Blacks";
import {getAllCustomerInfo, getContact} from "@/api/contact";
import Evaluation from "./components/Evaluation";
export default {
    mixins: [resize],
    name: 'DashboardStatistics',
    components: {
        PanelGroup,
        LineChart,
        CountTo,
        Mallki,
        Echarts,
        Visitor,
        Msg,
        Blacks,
        Evaluation
    },
    data() {
        return {
            //所有的统计数据全部在里面
            allStatistics:[],
            //详情信息
            details:{},
            //是否点击了客服
            isLook:'',
            //客服的详细报表
            userInfo:[],
            //客服的信息
            userData:{},
            userAllDayData:{},
            cnTime:'今日',
            //查看详情的表格
            lookTable:'',
            //访客表格
            visitorData:[],
            //msg表格
            msgData:[],
            customerInfo:[],
            //黑名单表格
            blacksData:[],
            //评价表格
            evaluationData:[],
            chart: null,
            showColor:'today',
            height:0,
            dialog:{
                show:false
            },
            evaluation:{
                show:false
            }
        }
    },
    created() {
        this.getAllStatistics();
        this.detailedData();
        this.getVisitorData();
        this.getCustomerInfo();
        this.getContact();
        this.getBlack();
        this.getEvaluation();
    },
    methods: {
        //获取评价表信息
        getEvaluation(){
            getEvaluation()
            .then((res)=>{
                this.evaluationData=res.data;
            })
        },
        //获取黑名单信息
        getBlack(){
            getBlack()
            .then((res)=>{
                this.blacksData=res.data;
            })
        },
        //消息表格
        getContact(){
            getContact()
                .then(res=>{
                    this.msgData=res.data;
                })
        },
        //消息表的客服信息
        getCustomerInfo(){
            getAllCustomerInfo()
                .then(res=>{
                    this.customerInfo=res.data;
                })
        },
        //得到访客表格
        getVisitorData(){
            getVisitorData()
            .then((res)=>{
                this.visitorData=res.data;
            })
        },
        //选择类型表格
        choose(info){
            if(info==='blacks'){
                this.dialog.show=true;
            }else if(info==='evaluation'){
                this.evaluation.show=true;
            }else{
                this.lookTable=info;
            }
        },
        //获取客服首页信息的数据
        detailedData(){
            detailed()
            .then((res)=>{
                this.userInfo=res.data;
            });
        },
        //请求得到所有的统计数据的接口
        getAllStatistics(){
            getAllStatistics()
            .then((res)=>{
                this.allStatistics=res.data;
                this.details=res.data.today;
            })
        },
        //点击今日昨日以前
        clickDay(info){
            this.showColor=info;
            if(info==='today'){
                this.cnTime='今日'
            }else if (info==='yesterday'){
                this.cnTime='昨日'
            }else{
                this.cnTime='一周内'
            }
            this.details=this.allStatistics[info];
            if(JSON.stringify(this.userAllDayData)!=='{}'){
                this.userData=this.userAllDayData[info];
                this.clear();
                this.initChart();
            }
        },
        //点击客服的详情
        info(info){
            this.isLook='点击了客服';
            this.userAllDayData=info.info;
            this.userData=this.userAllDayData[this.showColor];
            this.clear();
            this.initChart();
        },
        clear(){
            if (!this.chart) {
                return;
            }
            this.chart.dispose();
            this.chart = null;
        },
        initChart() {
            this.chart = echarts.init(this.$refs.echarts)
            this.chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter:'{a0}:{c0}m'
                },
                xAxis: {
                    show:false,
                },
                yAxis: {
                    show:false,
                    type: 'category',
                    data:['时间']
                },
                series:this.userData.series
            })
        },
        //点击返回
        back(){
            this.lookTable='';
        },
    },
    mounted(){
        this.$nextTick(()=>{ // 页面渲染完成后的回调
            this.height=this.$refs.getheight.offsetHeight-this.$refs.delheight.offsetHeight-10;
            this.initChart();
        })
    },
    updated(){
        if(this.isLook){
            this.chart.resize();
        }
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
}
</script>

<style lang="scss" scoped>
.color{
    &:hover {
        color: #4AB7BD;

        &:before,
        &:after {
            background: #4AB7BD;
        }
    }
}
.style{
    font-size: 14px;
    padding: 14px 16px;
    border: none;
    outline: none;
    transition: 600ms ease all;
    position: relative;
    display: inline-block;

    &:hover {
        background: #fff;

        &:before,
        &:after {
            width: 100%;
            transition: 600ms ease all;
        }
    }

    &:before,
    &:after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        height: 2px;
        width: 0;
        transition: 400ms ease all;
    }

    &::after {
        right: inherit;
        top: inherit;
        left: 0;
        bottom: 0;
    }
}
.right{
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
}
.card-panel {
    height: 108px;
    width:24%;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
        .card-panel-icon-wrapper {
            color: #fff;
        }

        .icon-people {
            background: #40c9c6;
        }

        .icon-message {
            background: #36a3f7;
        }

        .icon-lock {
            background: #f4516c;
        }
        .icon-star {
            background: #d633ff;
        }
        .icon-shopping {
            background: #34bfa3
        }
    }

    .icon-people {
        color: #40c9c6;
    }

    .icon-message {
        color: #36a3f7;
    }

    .icon-lock {
        color: #f4516c;
    }
    .icon-star {
        color:#d633ff;
    }
    .icon-shopping {
        color: #34bfa3
    }

    .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
    }

    .card-panel-icon {
        float: left;
        font-size: 48px;
    }

    .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
            margin-bottom: 12px;
        }

        .card-panel-num {
            font-size: 20px;
        }
    }
}
.dashboard-editor-container {
    padding:20px;
    background-color: rgb(240, 242, 245);
    position: relative;
    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}

@media (max-width:1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
</style>
