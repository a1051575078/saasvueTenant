<template>
    <div class="tab-container">
        <div style="display: flex;justify-content: space-between;">
            <el-form :inline="true">
                <el-form-item label="搜索：">
                    <el-input v-model="input" size="mini" clearable/>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width:100%" size="mini" :max-height="height+'px'">
            <el-table-column prop="name" label="操作客服" align="center" min-width="10%">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.user.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="操作类型" align="center" min-width="10%">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="日志内容" align="center" min-width="45%">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.content}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ip" label="访问IP" align="center" min-width="10%">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.ip}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="IP地理位置" align="center" min-width="10%">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.address}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" align="center" min-width="15%" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span style="margin-left:10px">{{scope.row.created_at}}</span>
                </template>
            </el-table-column>
        </el-table>
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
    </div>
</template>
<script>
    import {getAllCustomerInfo} from "@/api/contact";
    import {getLog} from "@/api/log";
    import delDialog from "@/views/info/customer-management/datamanagement/components/delDialog";
    import addDialog from "@/views/info/customer-management/datamanagement/components/addDialog";
    const defaultUser={
        name:'',
        password:''
    };
    export default {
        name:'InfoLog',
        data(){
            return{
                delDialog:{
                    title:'',
                    show:false,
                },
                addDialog:{
                    title:'',
                    show:false,
                },
                customerInfo:[],
                input:'',
                allTableData:[],
                fuzzySearch:[],
                height:0,
                paginations:{
                    currentPage:1,//当前页数
                    pageSizes:[25,50,100],//每页显示多少条
                    pageSize:25,//一页显示多少条
                    layout:'total,sizes,prev,pager,next,jumper',
                    total:0//总数
                },
                tableData:[],
                filterTableData:[],
                page:1,
                form:Object.assign({},defaultUser),
                seat:0
            }
        },
        watch:{
            'input':function(v){
                this.searchFor(v);
            }
        },
        created(){
            this.height=document.body.clientHeight-84-60-120;
            this.getLog();
            this.getCustomerInfo();
        },
        methods:{
            getCustomerInfo(){
                getAllCustomerInfo()
                    .then(res=>{
                        this.customerInfo=res.data;
                    })
            },
            getLog(){
                getLog()
                    .then(response=>{
                        this.allTableData=response.data;
                        this.filterTableData=response.data;
                        this.fuzzySearch=response.data;
                        //设置分页数据
                        this.setPaginations();
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
