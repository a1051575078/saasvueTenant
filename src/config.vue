<script>
    //头像的访问
    //const link = 'http://demo.live003.com/';
    const link = window.location.protocol+'//'+window.location.host+'/';//
    //gateway 存的session租户域名,其实可以不用多次一举  直接在使用的地方写api."+window.location.host。但是测试。我前端用的loca。后端已经传到服务器。。。
    //const url='demo.live003.com';
    const url=window.location.host;
    //websock访问的连接
    //const ws=window.location.protocol==='http:'?"ws://demo.live003.com/wss":"wss://demo.live003.com/wss";
    const ws=window.location.protocol==='http:'?"ws://" + window.location.host + "/wss":"wss://" + window.location.host + "/wss";
    //const uploadJson="http://api.demo.live003.com/api/nihaoya";
    const uploadJson= window.location.protocol+"//"+window.location.host+'/api/nihaoya';
    export default{
        link,
        url,
        ws,
        uploadJson
    }
</script>
