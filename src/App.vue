<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    import {logout} from "@/api/user";

    export default {
        name: 'App',
    }
</script>
<style>
    .el-badge__content.is-fixed {
        position: absolute;
        top: 0;
        right: 40px !important;
        -webkit-transform: translateY(-50%) translateX(100%);
        transform: translateY(-50%) translateX(100%) !important;
    }
    .el-loading-spinner {
        top: 50%;
        margin-top:0 !important;
        width: 100%;
        text-align: center;
        position: absolute;
    }
    .el-tabs__header {
        margin: 0 0 0 !important;
    }
    ::-webkit-scrollbar {
        width: 7px; /*滚动条宽度*/
        height: 7px; /*滚动条高度*/
        background-color: white;
    }
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: rgba(221, 222, 224); /*滚动条的背景颜色*/
    }
</style>
