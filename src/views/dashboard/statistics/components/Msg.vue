<template>
    <div>
        <el-form :inline="true">
            <i class="el-icon-back" style="cursor:pointer;font-size: 24px" @click="$emit('back')"></i>
            <el-form-item label="搜索：" style="margin-left: 10px">
                <el-input v-model="input" size="mini" clearable/>
            </el-form-item>
            <el-form-item>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        所有客服<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item.name" v-for="item in customerinfo" :key="item.id" :disabled="item.name===clickName">{{item.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
        </el-form>
        <div>
            <el-table :data="tableData" border fit highlight-current-row style="width:100%" size="mini" :max-height="height+'px'" @cell-click="changeInput">
                <el-table-column prop="created_at" label="更新时间" align="center" min-width="15%" sortable>
                    <template slot-scope="scope">
                        <i class="el-icon-time"/>
                        <span style="margin-left:10px">{{scope.row.created_at}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="接待客服" align="center" min-width="5%">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="访问IP" align="center" min-width="10%">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.ip}}</span>
                    </template>

                </el-table-column>
                <el-table-column prop="address" label="IP地理位置" align="center" min-width="15%">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.address}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="recordnumber" label="聊天条数" align="center" min-width="5%">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{scope.row.recordnumber|iszero}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="blacklist" label="黑名单状态" align="center" min-width="5%">
                    <template slot-scope="scope">
                        <el-switch
                            v-if="showEdit[scope.$index]['blacklist']"
                            v-model="scope.row.blacklist"
                            v-focus
                            :active-value="1"
                            :inactive-value="0"
                            @blur="inputBlur"
                            @change="handleEdit(scope.row,scope.$index)">
                        </el-switch>
                        <span style="margin-left: 10px" v-if="!showEdit[scope.$index]['blacklist']">{{scope.row.blacklist|isEnd}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="record" label="查看聊天记录" align="center" min-width="10%">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.recordnumber>0" :underline="false" @click="letsgo(scope.row)">前往</el-link>
                        <el-link v-else :underline="false" @click="letsgo(scope.row)" disabled>前往</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row>
            <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="paginations.currentPage"
                        :page-sizes="paginations.pageSizes"
                        :page-size="paginations.pageSize"
                        :layout="paginations.layout"
                        :total="paginations.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <RecordDialog :dialog="dialog" :info="info"></RecordDialog>
    </div>
</template>
<script>
import {getContact,delOraddblack,getAllCustomerInfo} from '@/api/contact';
import RecordDialog from "./components/RecordDialog";
export default {
    components: {RecordDialog},
    directives:{
        focus:{
            // 指令的定义
            inserted:function(el){
                el.getElementsByTagName('input')[0].focus();
                // el.focus()
            }
        }
    },
    filters:{
        isEnd(value){
            if(value===0){
                return '否';
            }else{
                return '是';
            }
        },
        iszero(value){
            if(value){
                return value;
            }else{
                return 0;
            }
        }
    },
    name:'Msg',
    data(){
        return{
            info:{
                fromid:'',
                toid:'',
                tableId:0,
                id:0,
                name:''
            },
            input:'',
            allTableData:[],
            fuzzySearch:[],
            height:0,
            showEdit:[],
            tabMapOptions:[],
            activeName:'cn',
            total:{
                balance:0,
                profit:0
            },
            paginations:{
                currentPage:1,//当前页数
                pageSizes:[25,50,100],//每页显示多少条
                pageSize:25,//一页显示多少条
                layout:'total,sizes,prev,pager,next,jumper',
                total:0//总数
            },
            clickName:'',
            tableData:[],
            filterTableData:[],
            dialog:{
                show:false,
                title:''
            },
            page:1,
            currencies:{
                currency:'cn'
            }
        }
    },
    props:{
        customerinfo:{
            type:Array,
            default(){
                return [];
            }
        },
        msg:{
            type:Array,
            default() {
                return [];
            }
        }
    },
    watch:{
        'input':function(v){
            this.searchFor(v);
        },
        tableData:function(){
            this.setShowEdit();
        },
    },
    created(){
        this.height=document.body.clientHeight-84-60-120-140;
    },
    mounted() {
        this.allTableData=this.msg;
        this.filterTableData=this.msg;
        this.fuzzySearch=this.msg;
        //设置分页数据
        this.setPaginations();
    },
    methods:{
        letsgo(info){
            //是從前端的角度傳過來。所以fromid是前端的fromid，需要改爲toid
            this.info.toid=info.fromid;
            this.info.fromid='访客'+info.ip;
            this.info.id=info.id;
            this.info.name=info.name;
            this.dialog.show=true;
        },
        handleCommand(command) {
            this.clickName=command;
            this.searchFor(command,'1')
        },
        // 失焦
        inputBlur(){
            this.setShowEditInit();
        },
        // 初始化单元格显示状态
        setShowEditInit(){
            for (const item of this.showEdit){
                for (const innerItem in item){
                    item[innerItem]=false;
                }
            }
        },
        // 设置单元显示转态数据
        setShowEdit(){
            const tempShowEdit=[];
            for (const item of this.tableData){
                const tempShow={};
                for (const innerItem in item){
                    tempShow[innerItem]=false;
                }
                tempShowEdit.push(tempShow);
            }
            this.showEdit=tempShowEdit;
        },
        // 切换单元格为编辑
        changeInput(row,column,cell,event){
            this.setShowEditInit();
            const nowObj=column.property;
            const index=this.tableData.indexOf(row);
            this.showEdit[index][nowObj]=!this.showEdit[index][nowObj];
        },
        handleEdit(row,index){
            delOraddblack(row)
                .then(()=>{
                    this.$message({
                        message:'修改成功',
                        type:'success',
                        duration:5*1000
                    });
                })
        },
        handleCurrentChange(page){
            // 当前页
            this.page=page;
            const sortnum=this.paginations.pageSize*(page-1);
            const table=this.allTableData.filter((item,index)=>{
                return index>=sortnum;
            });
            // 设置默认分页数据
            this.tableData = table.filter((item,index)=>{
                return index<this.paginations.pageSize;
            });
        },
        setPaginations(){
            //分页属性设置
            this.paginations.total=this.allTableData.length;
            this.paginations.currentPage=this.page;
            this.paginations.pageSize=25;
            if(this.paginations.currentPage>1){
                this.handleCurrentChange(this.paginations.currentPage);
            }else if(this.paginations.currentPage===1){
                //设置默认的分页数据
                this.tableData=this.allTableData.filter((item,index)=>{
                    return index<this.paginations.pageSize;
                })
            }
        },
        handleSizeChange(val){
            //切换size
            this.paginations.currentPage=1;
            this.paginations.pageSize=val;
            this.tableData=this.allTableData.filter((item,index)=>{
                return index<val;
            });
        },
        searchFor(v,is=''){
            if(v){
                // filter()方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                // 注意：filter()不会对空数组进行检测。
                // 注意：filter()不会改变原始数组。
                this.allTableData=this.fuzzySearch.filter(data=>{
                    // some() 方法用于检测数组中的元素是否满足指定条件;
                    // some() 方法会依次执行数组的每个元素：
                    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                    // 如果没有满足条件的元素，则返回false。
                    // 注意： some() 不会对空数组进行检测。
                    // 注意： some() 不会改变原始数组。
                    return Object.keys(data).some(key=>{
                        // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                        // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                        return String(data[key]).toLowerCase().indexOf(v)>-1
                    });

                });
                this.setPaginations();
            }
            if(this.input===''&&is===''){
                this.allTableData=this.fuzzySearch;
                this.setPaginations();
            }
        }
    }
}
</script>
<style scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.tab-container{
    margin:30px;
}
.pagination{
    text-align:right;
    margin-top:10px;
}
</style>
