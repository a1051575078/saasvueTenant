<template>
    <div :id="id" style="height:500px" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
    mixins: [resize],
    props: {
        looktable:{
            type:String,
            default:''
        },
        details:{
            type:Object,
            default:{}
        },
        cntime:{
            type:String,
            default:'今日'
        },
        id: {
            type: String,
            default: 'chart'
        },
    },
    data() {
        return {
            chart: null,
            cnTime:'今日'
        }
    },
    /*mounted() {
        this.initChart()
    },*/
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    watch:{
        'details':function (){
            this.initChart()
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(document.getElementById(this.id))
            const xData = (function() {
                const data = [];
                for (let i = 1; i < 25; i++) {
                    data.push(i-1+':00');
                }
                return data;
            }());
            this.chart.setOption({
                title: {
                    text:this.cntime,
                    x: '20',
                    top: '20',
                    textStyle: {
                        color: '#ccc',
                        fontSize: '22'
                    },
                    subtextStyle: {
                        color: '#90979c',
                        fontSize: '16'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    borderWidth: 0,
                    top: 150,
                    bottom: 95,
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    x: '5%',
                    top: '10%',
                    textStyle: {
                        color: '#90979c'
                    },
                    data: ['访客数', '黑名单', '消息数','评价']
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0

                    },
                    data: xData
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0
                    },
                    splitArea: {
                        show: false
                    }
                }],
                /*dataZoom: [{
                    show: true,
                    height: 30,
                    xAxisIndex: [
                        0
                    ],
                    bottom: 30,
                    start: 10,
                    end: 80,
                    handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                    handleSize: '110%',
                    handleStyle: {
                        color: '#d3dee5'

                    },
                    textStyle: {
                        color: '#fff' },
                    borderColor: '#90979c'

                }, {
                    type: 'inside',
                    show: true,
                    height: 15,
                    start: 1,
                    end: 35
                }],*/
                series: [{
                    name: '访客数',
                    type: 'bar',
                    stack: 'total',
                    barMaxWidth: 35,
                    barGap: '10%',
                    itemStyle: {
                        normal: {
                            color: 'rgba(255,144,128,1)',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                },
                                position: 'insideTop',
                                formatter(p) {
                                    return p.value > 0 ? p.value : ''
                                }
                            }
                        }
                    },
                    data:this.details.visitor
                },

                    {
                        name: '黑名单',
                        type: 'bar',
                        stack: 'total',
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,191,183,1)',
                                barBorderRadius: 0,
                                label: {
                                    show: true,
                                    position: 'insideTop',
                                    formatter(p) {
                                        return p.value > 0 ? p.value : ''
                                    }
                                }
                            }
                        },
                        data:this.details.black
                    },{
                        name: '消息数',
                        type: 'bar',
                        stack: 'total',
                        itemStyle: {
                            normal: {
                                color: 'rgba(0,230,48,1)',
                                barBorderRadius: 0,
                                label: {
                                    show: true,
                                    position: 'insideTop',
                                    formatter(p) {
                                        return p.value > 0 ? p.value : ''
                                    }
                                }
                            }
                        },
                        data:this.details.record
                    },{
                        name: '评价',
                        type: 'bar',
                        stack: 'total',
                        itemStyle: {
                            normal: {
                                color: 'rgba(251,230,48,1)',
                                barBorderRadius: 0,
                                label: {
                                    show: true,
                                    position: 'insideTop',
                                    formatter(p) {
                                        return p.value > 0 ? p.value : ''
                                    }
                                }
                            }
                        },
                        data:this.details.evaluations
                    }
                ]
            })
        }
    }
}
</script>
