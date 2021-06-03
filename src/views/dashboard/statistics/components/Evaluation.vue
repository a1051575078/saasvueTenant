<template>
    <el-dialog title="评价列表" :visible.sync="evaluation.show" top="1%">
        <el-table :data="evaluationdata" :max-height="height+'px'">
            <el-table-column prop="created_at" label="评价时间" align="center" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    {{scope.row.created_at}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="对接客服" align="center">
                <template slot-scope="scope">
                    {{scope.row.user.name}}
                </template>
            </el-table-column>
            <el-table-column label="评价" align="center">
                <template slot-scope="scope">
                    {{scope.row.good?'👍':'👎'}}
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" align="center">
                <template slot-scope="scope">
                    {{scope.row.content}}
                </template>
            </el-table-column>
            <el-table-column prop="visitors" label="评价人" align="center">
                <template slot-scope="scope">
                    {{scope.row.visitors}}
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
import {delOraddblack} from "@/api/contact";

export default {
    name:'Evaluation',
    data(){
        return{
            height:0,
        }
    },
    created() {
        this.height=document.body.clientHeight-84-120;
    },
    methods:{
        del(info){
            info.blacklist=0;
            delOraddblack(info)
                .then(()=>{
                    this.$message.success('移除黑名单成功');
                });
            for (var i=0;i<this.blacksdata.length;i++){
                if(info.id===this.blacksdata[i].id){
                    this.blacksdata.splice(i,1);
                    break;
                }
            }
        }
    },
    props:{
        evaluationdata:{
            type:Array,
            default(){
                return [];
            }
        },
        evaluation:{
            type:Object,
            default(){
                return {};
            }
        }
    },
}
</script>
<style scoped>
</style>
