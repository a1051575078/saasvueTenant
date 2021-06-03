<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-menu">
            <!--<template v-if="device!=='mobile'">
              &lt;!&ndash;<search id="header-search" class="right-menu-item" />

              <error-log class="errLog-container right-menu-item hover-effect" />

              <screenfull id="screenfull" class="right-menu-item hover-effect" />

              <el-tooltip content="Global Size" effect="dark" placement="bottom">
                <size-select id="size-select" class="right-menu-item hover-effect" />
              </el-tooltip>&ndash;&gt;

            </template>-->

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

                <div class="avatar-wrapper">
                    <img :src="config.link+avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom"/>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/info/settings-info">
                        <el-dropdown-item>个人信息</el-dropdown-item>
                    </router-link>
                    <div @click="clickHang" v-if="roles==='客服'">
                        <el-dropdown-item v-if="is_server===0"><i class="el-icon-lock"></i>{{ hang }}</el-dropdown-item>
                        <el-dropdown-item v-if="is_server===1"><i class="el-icon-unlock"></i>{{ hang }}</el-dropdown-item>
                    </div>
                    <!--<router-link to="/">
                      <el-dropdown-item>Dashboard</el-dropdown-item>
                    </router-link>
                    <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                      <el-dropdown-item>Github</el-dropdown-item>
                    </a>
                    <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
                      <el-dropdown-item>Docs</el-dropdown-item>
                    </a>-->

                    <el-dropdown-item divided @click.native="logout">
                        <span style="display:block;">退出</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {toolHang} from "@/api/tool";

export default {
    data(){
        return {
            is_server:0,
            hang:'',
        }
    },
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
        Screenfull,
        SizeSelect,
        Search
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar',
            'device',
            'roles'
        ])
    },
    created() {
        //得到当前挂起状态
        this.getHang();
    },
    methods: {
        getHang(){
            this.is_server=this.$store.getters.is_server;
            if(this.is_server===0){
                this.hang='上线';
            }else{
                this.hang='挂起';
            }
        },
        //改变挂起样式及其他操作
        changeHang(){
            if(this.is_server!==0){
                this.hang='上线';
                this.is_server=0;
            }else{
                this.hang='挂起';
                this.is_server=1;
            }
        },
        //点击功能中心的挂起
        clickHang(){
            toolHang({is_server:this.is_server});
            this.changeHang();
        },
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            sessionStorage.setItem('islogout','');
            await this.$store.dispatch('user/logout',this.$store.getters.client_id)
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.hand{
    cursor: pointer;  /*鼠标悬停变小手*/
}
#style{
    background:	#F8F8F8;
}
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
