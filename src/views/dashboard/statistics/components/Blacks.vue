<template>
    <el-dialog title="黑名单列表" :visible.sync="dialog.show" top="1%">
        <el-table :data="blacksdata" :max-height="height+'px'">
            <el-table-column prop="created_at" label="加入时间" align="center" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    {{scope.row.created_at}}
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="封禁IP" align="center">
                <template slot-scope="scope">
                    {{scope.row.ip}}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" align="center">
                <template slot-scope="scope">
                    {{scope.row.address}}
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="操作" align="center">
                <template slot-scope="scope">
                    <i class="el-icon-delete" style="cursor: pointer" @click="del(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script>
import {delOraddblack} from "@/api/contact";

export default {
    name:'Black',
    data(){
        return{
            customerInfo:[],
            height:0
        }
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
    created() {
        this.height=document.body.clientHeight-84-120;
    },
    props:{
        blacksdata:{
            type:Array,
            default(){
                return [];
            }
        },
        dialog:{
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
