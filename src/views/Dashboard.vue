<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img
                            src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2855204159,1294025145&fm=26&gp=0.jpg"
                            class="user-avator"
                            alt
                        />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ baseForm.nickname }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        {{baseForm.email}}
                        <!-- <span>实习中...</span> -->
                    </div>
                    <div class="user-info-list">
                        {{baseContent1}}
                    </div>
                    <div class="user-info-list">
                        {{baseContent2}}
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:330px;">
                     <div id="messageChart" style="width:100%;height:310px"></div>
                    <!-- <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>
                    Vue <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress> -->
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-notebook-2 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{blogNum}}</div>
                                    <div>博客文章数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-view  grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{readSum}}</div>
                                    <div>文章总阅读量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-comment grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{messageNum}}</div>
                                    <div>留言数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:482px;">
                    <div style="width:100%;height:460px" id="readingChart"></div>
                    <!-- <div slot="header" class="clearfix">
                        <span>文章阅读量TOP10</span>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table> -->
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div style="width:100%;height:300px" id="readingChart"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <div id="messageChart" style="width:100%;height:300px"></div>
                </el-card>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
// import bus from '../common/bus';
import AV from 'leancloud-storage';
import { getArticleList,getUserInfoById } from '../api/index';
import * as echarts from 'echarts';
export default {
    name: 'dashboard',
    data() {
        return {
            name: 'Mr.Su',
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            articleList: [],
            readingArray: [],
            blogNameArray: [],
            readSum:0,
            blogNum:0,
            messageNum:0,
            baseForm:{},
            baseContent1:'',
            baseContent2:'',
        };
    },
    computed: {
        role() {
            return '超级管理员';
        }
    },
    methods: {
        async getArticleList() {
            const { data: res } = await getArticleList({
                status: 0,
                row_start: 0,
                row_count: 10,
                order_key: [['number', 'DESC']]
            });
            this.articleList = res.result_data.items;
            this.readingArray = this.articleList.map(val => {
                return val.number;
            });
            this.blogNameArray = this.articleList.map(val => {
                return val.title;
            });
            this.getReadingChart();
        },
        async getUserInfo() {
            const { data: res } = await getUserInfoById(2);
            this.baseForm = res.result_data;
            this.baseContent1 = this.baseForm.content.slice(0,12)
            this.baseContent2 = this.baseForm.content.slice(13)
        },
        getMessage() {
            const query = new AV.Query('Comment');
            // query.skip(10);
            query.find().then(res => {
                this.messageNum = res.length
            });
        },
        getReadingChart() {
            let that = this;
            let readingArr = that.readingArray;
            let blogNameArr = that.blogNameArray;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('readingChart'));
            // 绘制图表
            myChart.setOption({
                // tooltip: {
                //     trigger: 'axis',
                //     axisPointer: {
                //         // 坐标轴指示器，坐标轴触发有效
                //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                //     }
                // },
                // title: {
                //     text: '阅读量TOP10',
                //     left: 'center'
                // },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                // xAxis: [
                //     {
                //         type: 'category',
                //         data: blogNameArr,
                //         axisTick: {
                //             alignWithLabel: true
                //         }
                //     }
                // ],
                // yAxis: [
                //     {
                //         type: 'value'
                //     }
                // ],
                // series: [
                //     {
                //         name: '阅读量',
                //         type: 'bar',
                //         barWidth: '60%',
                //         data: readingArr
                //     }
                // ]
                // backgroundColor: '#00265f',
                title: {
                    text: '博客阅读量TOP10',
                    x: 'center',
                    y: '4%',
                    textStyle: {
                        color: '#333',
                        fontSize: '16'
                    },
                    subtextStyle: {
                        color: '#000',
                        fontSize: '16'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '20%',
                    right: '3%',
                    left: '8%',
                    bottom: '12%'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: blogNameArr,
                        axisLine: {
                            lineStyle: {
                                color: '#D9D9D9'
                            }
                        },
                        axisLabel: {
                            margin: 10,
                            color: '#000',
                            textStyle: {
                                fontSize: 14
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '',
                        axisLabel: {
                            formatter: '{value}',
                            color: '#000'
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: 'rgba(0,0,0,1)'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(0,0,0,0.12)'
                            }
                        },
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        data: readingArr,
                        barWidth: '20px',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(0,244,255,1)' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(0,77,167,1)' // 100% 处的颜色
                                        }
                                    ],
                                    false
                                ),
                                barBorderRadius: [30, 30, 30, 30],
                                shadowColor: 'rgba(0,160,221,1)',
                                shadowBlur: 4
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                                lineHeight: 30,
                                width: 80,
                                height: 30,
                                backgroundColor: 'rgba(0,160,221,0.1)',
                                borderRadius: 200,
                                position: ['-8', '-60'],
                                distance: 1,
                                formatter: ['    {d|●}', ' {a|{c}}     \n', '    {b|}'].join(','),
                                rich: {
                                    d: {
                                        color: '#3CDDCF'
                                    },
                                    a: {
                                        color: '#fff',
                                        align: 'center'
                                    },
                                    b: {
                                        width: 1,
                                        height: 30,
                                        borderWidth: 1,
                                        borderColor: '#234e6c',
                                        align: 'left'
                                    }
                                }
                            }
                        }
                    }
                ]
            });
        },
        getMessageChart() {
            var myChart3 = echarts.init(document.getElementById('messageChart'));
            let bgColor = '#fff';
            let color = ['#0090FF', '#36CE9E', '#FFC005', '#FF515A', '#8B5CFF', '#00CA69'];
            let date = new Date()
            let fiveDateLast = {
                first: '',
                two: '',
                three: '',
                four: '',
                five: '',
                six: '',
                seven: '',
            }
            date.setDate(date.getDate())
            fiveDateLast.first = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.two = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.three = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.four = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.five = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.six = date.getMonth() + 1 + '-' + date.getDate()
            date.setDate(date.getDate() - 1)
            fiveDateLast.seven = date.getMonth() + 1 + '-' + date.getDate()
            let echartData = [
                {
                    name: fiveDateLast.seven,
                    value1: 30,
                    value2: 2330
                },
                {
                    name: fiveDateLast.six,
                    value1: 40,
                    value2: 2330
                },
                {
                    name: fiveDateLast.five,
                    value1: 42,
                    value2: 2000
                },
                {
                    name: fiveDateLast.four,
                    value1: 45,
                    value2: 1800
                },
                {
                    name: fiveDateLast.three,
                    value1: 48,
                    value2: 1990
                },
                {
                    name: fiveDateLast.two,
                    value1: 52,
                    value2: 2330
                },
                {
                    name: fiveDateLast.first,
                    value1: 55,
                    value2: 2100
                }
            ];
            let xAxisData = echartData.map(v => v.name);
            let yAxisData1 = echartData.map(v => v.value1);
            let yAxisData2 = echartData.map(v => v.value2);
            const hexToRgba = (hex, opacity) => {
                let rgbaColor = '';
                let reg = /^#[\da-f]{6}$/i;
                if (reg.test(hex)) {
                    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt(
                        '0x' + hex.slice(5, 7)
                    )},${opacity})`;
                }
                return rgbaColor;
            };
            // 绘制图表
            myChart3.setOption({
                backgroundColor: bgColor,
                color: color,
                legend: {
                    right: 10,
                    top: 10
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        let html = '';
                        params.forEach(v => {
                            html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                    color[v.componentIndex]
                };"></span>
                ${v.seriesName}
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>`;
                        });
                        return html;
                    },
                    extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: '#ffffff',
                            shadowColor: 'rgba(225,225,225,1)',
                            shadowBlur: 5
                        }
                    }
                },
                grid: {
                    top: 80,
                    x: 10,
                    x2: 20,
                    y2: 20,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#333'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#D9D9D9'
                            }
                        },
                        data: xAxisData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle: {
                                color: '#666'
                            }
                        },
                        nameTextStyle: {
                            color: '#666',
                            fontSize: 12,
                            lineHeight: 40
                        },
                        splitLine: {
                            lineStyle: {
                                type: 'dashed',
                                color: '#E9E9E9'
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: '博客总阅读量',
                        type: 'line',
                        smooth: true,
                        // showSymbol: false,/
                        symbolSize: 8,
                        zlevel: 3,
                        lineStyle: {
                            normal: {
                                color: color[0],
                                shadowBlur: 3,
                                shadowColor: hexToRgba(color[0], 0.5),
                                shadowOffsetY: 8
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: hexToRgba(color[0], 0.3)
                                        },
                                        {
                                            offset: 1,
                                            color: hexToRgba(color[0], 0.1)
                                        }
                                    ],
                                    false
                                ),
                                shadowColor: hexToRgba(color[0], 0.1),
                                shadowBlur: 10
                            }
                        },
                        data: yAxisData1
                    },
                    // {
                    //     name: '去话',
                    //     type: 'line',
                    //     smooth: true,
                    //     // showSymbol: false,
                    //     symbolSize: 8,
                    //     zlevel: 3,
                    //     lineStyle: {
                    //         normal: {
                    //             color: color[1],
                    //             shadowBlur: 3,
                    //             shadowColor: hexToRgba(color[1], 0.5),
                    //             shadowOffsetY: 8
                    //         }
                    //     },
                    //     areaStyle: {
                    //         normal: {
                    //             color: new echarts.graphic.LinearGradient(
                    //                 0,
                    //                 0,
                    //                 0,
                    //                 1,
                    //                 [
                    //                     {
                    //                         offset: 0,
                    //                         color: hexToRgba(color[1], 0.3)
                    //                     },
                    //                     {
                    //                         offset: 1,
                    //                         color: hexToRgba(color[1], 0.1)
                    //                     }
                    //                 ],
                    //                 false
                    //             ),
                    //             shadowColor: hexToRgba(color[1], 0.1),
                    //             shadowBlur: 10
                    //         }
                    //     },
                    //     data: yAxisData2
                    // }
                ]
            });
            window.addEventListener('resize', function() {
                myChart3.resize();
            });
        }
    },
    created() {
        this.getArticleList();
        this.getMessage();
        this.getUserInfo()
        getArticleList().then(res=>{
            this.blogNum = res.data.total_row
            getArticleList({row_count:res.data.total_row}).then(res1=>{
                let that = this;
                res1.data.result_data.items.forEach(val => {
                //  console.log(val.number);
                that.readSum += val.number;
            });
            })
        });
            
    },
    mounted() {
        this.getMessageChart();
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 5px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

</style>
