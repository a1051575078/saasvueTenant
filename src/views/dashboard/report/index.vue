<template>
    <div class="tab-container">
        <div style="display: flex;justify-content: space-between;">
            <el-form :inline="true">
                <el-form-item label="搜索：">
                    <el-input v-model="input" size="mini" clearable/>
                </el-form-item>
            </el-form>
            <div>
                <el-button size="mini" type="primary" @click="addVip">新增</el-button>
                <el-button size="mini" type="danger" @click="deleteAllVip">批量删除</el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border fit highlight-current-row style="width:100%" size="mini" :max-height="height+'px'" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="加入时间" align="center" sortable>
                    <template slot-scope="scope">
                        <span>{{scope.row.created_at|date}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作客服" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.user}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户名字" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="性别" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.sex|sex}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="电话" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.phone}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="年龄" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.age}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="QQ" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.qq}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="微信" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.wechat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户IP" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.ip}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户地址" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.address}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.remarks}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popconfirm
                            confirmButtonText='确定'
                            cancelButtonText='取消'
                            icon="el-icon-info"
                            @onConfirm="deleteVip(scope)"
                            iconColor="red"
                            title="你确定要删除此会员吗？">
                            <i slot="reference" class="el-icon-delete" style="font-size: 18px;cursor: pointer"></i>
                        </el-popconfirm>
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
        <VipDialog :vip="vip" @refresh="refresh"></VipDialog>
    </div>
</template>
<script>
import {getContact,delOraddblack,getAllCustomerInfo} from '@/api/contact';
import {delAllVip, delVip, getVip} from "@/api/admin";
import VipDialog from './components/VipDialog';
export default {
    components: {VipDialog},
    filters:{
        sex(value){
            if(value===0){
                return '女';
            }else{
                return '男';
            }
        },
        date(value){
            return /\d{4}-\d{1,2}-\d{1,2}/g.exec(value)[0];
        }
    },
    name:'DashboardReport',
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
            customerInfo:[],
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
            },
            multipleSelection: [],
            vip:{
                show:false
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
        this.height=document.body.clientHeight-84-60-120;
        this.getVip();
    },
    methods:{
        deleteVip({index,row}){
            this.tableData.splice(index,1);
            delVip(row)
                .then(()=>{
                    this.$message.success('删除成功');
                });
        },
        deleteAllVip(){
            if(this.multipleSelection.length===0){
                return this.$message.error('请选择删除的用户');
            }
            this.$confirm('此操作将不可逆,请问继续删除？', '警告', {
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delAllVip(this.multipleSelection)
                    .then(()=>{
                        this.$message.success('删除成功');
                        this.getVip();
                    });
            });
        },
        refresh(){
            this.getVip();
        },
        addVip(){
            this.vip.show=true;
        },
        getVip(){
            getVip()
                .then(response=>{
                    this.allTableData=response.data;
                    this.filterTableData=response.data;
                    this.fuzzySearch=response.data;
                    //设置分页数据
                    this.setPaginations();
                })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
            console.log(row)
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
