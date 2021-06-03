<template>
    <div class="box" :style="{maxWidth:width+'%'}" v-loading="loading">
        <audio controls="controls" hidden src="@/assets/tip.wav" ref="audio"></audio>
        <header>
            <div style="font-size: 12px;margin-left:10px;cursor:pointer;" @click="jumplink()">
                <span v-if="info.jumplink">
                    <i class="el-icon-caret-left"></i>
                </span>
            </div>
            <div>{{info.title}}</div>
            <div>{{info.name|status}}</div>
        </header>
        <div class="content" id="heightBottom" @scroll="handleScroll($event)">
            <div style="height:2%;display: flex;align-items: center;justify-content: center">
                <div v-loading="loadingTop" element-loading-spinner="el-icon-loading"></div>
                <!--<div v-if="nohavemany" style="text-align: center;font-size: 12px">暂无更多</div>-->
                <!--<div v-if="findmany" style="text-align: center;font-size: 12px;cursor:pointer;" @click="infiniteScroll('first')">查看更多</div>-->
                <div v-if="findmany" style="text-align: center;font-size: 12px;cursor:pointer;" @click="infiniteScroll('first')"><i class="el-icon-plus"></i></div>
            </div>
            <!-- 聊天内容 -->
            <div  v-for="v in chatRecord">
                <div v-if="v.fromid!==info.fromid && v.withdraw!==1 && v.content && v.fromid">
                    <span class="toMsgTime">{{v.created_at}}</span>
                    <div class="to">
                        <img :src="config.link+info.avatar" class="toHeader"/>
                        <div v-if="v.type===1" class="toText" style="color:white;border-radius: 10px" v-html="v.content"></div>
                        <div v-if="v.type===2" class="toText" style="max-width:10%;max-height:10%;padding:0;" v-viewer>
                            <img class="sendpic" :src="config.link+v.content" :key="config.link+v.content"/>
                        </div>
                    </div>
                </div>
                <!--<div v-if="v.type===3" style="text-align: center;margin-top: 10px;font-size: 12px;">
                    <span style="background: #ccc" v-html="v.content"></span>
                </div>-->
                <div v-if="v.fromid===info.fromid && v.fromid">
                    <span class="fromMsgTime">{{v.created_at}}</span>
                    <div class="from">
                        <img src="@/assets/cust.jpg" class="fromHeader"/>
                        <div v-if="v.type===1" class="fromText" style="color:white;border-radius: 10px" v-html="v.content"></div>
                        <div v-if="v.type===2||v.type===4" class="fromText" style="max-width: 10%;max-height:10%;padding:0;" v-viewer>
                            <img v-if="v.type===2" class="sendpic" :src="config.link+v.content" :key="config.link+v.content"/>
                            <img v-if="v.type===4" class="sendpic" :src="v.content" :key="config.link+v.content"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <el-popover
                placement="top"
                trigger="click">
                <div>
                    <Picker
                        :include="['people']"
                        :showSearch="false"
                        :showPreview="false"
                        :showCategories="false"
                        @select="addEmoji"/>
                </div>
                <span slot="reference" class="icon icon-kaixin" style="cursor:pointer" :id='kulay==="expression"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('expression')"></span>
            </el-popover>
            <span class="icon icon-tupiantianjia hiddenupload" :id='kulay==="pic"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('pic')">
                 <input type="file" ref="pathClear" accept="image/*" @change="sendPic">
            </span>
            <span @click="dialog.show=true" class="icon icon-zan" style="cursor:pointer" :id='kulay==="zan"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('zan')"></span>
            <!--<div ref="paste"
                 type="text"
                 contenteditable="true"
                 @paste.stop.prevent="pasteImg($event)"
                 style="width:60%">
                &lt;!&ndash;<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="content" @keyup.enter.native="send" resize="none"></el-input>&ndash;&gt;

            </div>-->
            <textarea ref="contentArea" style="width:60%;resize: none;" v-model="content" :rows="2" @keyup.enter="send" @paste="pasteImg($event)"></textarea>
            <!--<el-input type="textarea" style="width:60%" :rows="2" v-model="content" placeholder="请输入内容" @keyup.enter.native="send" resize="none" @paste="pasteImg($event)"></el-input>-->
            <i class="el-icon-position" @click="send" style="cursor:pointer;font-size: 24px;" :id='kulay==="send"?"changecolor":""' @mouseleave="mousebye()" @mouseover="mousego('send')"></i>
        </footer>
        <Good :dialog="dialog" :info="info"></Good>
    </div>
</template>
<script>
import {Picker} from 'emoji-mart-vue';
import {infiniteScroll, updateAccess} from '@/api/client';
import AES from "@/utils/AES";
import Good from './components/Good';
export default {
    components:{Picker,Good},
    name:'Client',
    filters:{
        status(v){
            if(v===''){
                return '正在连接中~';
            }else if(v==='offline'){
                /*return '客服离线';*/
                return '';
            }else{
                return v;
            }
        }
    },
    data(){
        return {
            temporaryPic:{},//临时存储发送的图片
            loadingTop:false,//向上滑动的状态
            loading: true,//整个页面加载的loading
            width:40,//当前页面的宽度
            nohavemany:'',//暂无更多,没有更多聊天记录
            picOrMsg:'',//当用户长时间未连接,判断再次登上的是图片还是消息。因为异步同步不是很清楚，所以就阻塞操作
            findmany:'',//查看更多
            lastHeight:0,//上次滚动条记录的位置高度
            currentHeight:0,//当前滚动条的位置高度
            websock:null,//连接websock的实例
            kulay:'',//鼠標移入進去。動態class產生的背景顔色
            isClick:'',//鼠標點擊後以後才能響鈴
            chatRecord:[],//聊天记录的数组
            ping:'',//长时间未回复就断开连接的标识
            time:'',//获取最后一次用户操作的时间
            content:'',//文本域显示的文字内容,因需要加密。
            timer:'',//定时器的变量
            pings:'',//ping给服务端的变量
            //绑定的信息
            info:{
                client_id:'',//儅綁定的時候,gateway服務器的唯一標識符
                fromid:'',//發送者的fromid
                toid:'',//接收者,也就是客服的id
                name:'',//客服的id
                title:'',//首页的标题
                jumplink:'',//如果有值。则显示返回字样，并可以blank跳转
                avatar:'',//客服的头像
                tableId:0,//向上加载聊天记录的当前第一条聊天记录的id
                type:'',//發送的類型
                content:'',//發送加密后的消息内容
                webgroup:'',//和哪个网站的客服的在聊
                isread:0,//是否阅读,尚未做
                rand:'',//发送消息需要一段随机数,因为如果等待数据库传回来的ID的话,时间会很长
                client:'访客的标识',//只有访客才有这个标识,
                vip:{}//是否是vip
            },
            //客户端给服务端ping
            givePingData:{
                type:'ping'
            },
            //点赞的弹窗
            dialog:{
                show:false
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
        clearInterval(this.pings);
    },
    mounted() {
        this.$nextTick(function(){
            document.addEventListener("click",e=>{
                this.isClick='鼠标已经点击';
            });
        });
        this.timer=setInterval(this.sendPing,5000);
    },
    async created(){
        //判断当前用户是否是移动端
        this.isMobile();
        //得到当前的用户id console.log(访客192.168.10.1)
        await this.getCurrentInfo();
        await this.chooseOnlineCustomerService();
        await this.initWebSocket();
    },
    methods:{
        dropped(e){
            //狀態為3就是掉綫了
            if(e.currentTarget.readyState===3&&!this.ping){
                if(this.pings){
                    clearInterval(this.pings);
                }
                this.initWebSocket();
            }
        },
        //当客服接收到服务器发送过来的消息
        async websocketonmessage(e){//数据接收
            const message = JSON.parse(e.data);
            //console.log(message);
            switch (message.type){
                //{type:"black",fromid:"访客134.159.226.46",toid: "2"}
                case 'black':
                    if(message.fromid===this.info.fromid){
                        this.ping='不需要再次请求了';
                        this.closeClient(this.info);//关闭client_id
                        this.clearTime();//清除定时器
                        this.clearInterval(this.pings);
                        let end={};
                        end.content='无法连接';
                        end.type=3;
                        this.info.name='offline';
                        this.chatRecord.push(end);
                        this.chatBottom();
                    }
                    break;
                //得到{type: "bind", client_id: "7f00000108fe00000001"},先进行绑定,因为每个client_id都不会一样。只有绑定了才行
                case 'bind':
                    if(!this.time){
                        this.time=this.getTime();
                    }
                    this.info.client_id=message.client_id;
                    this.info.webgroup='api.'+this.config.url;
                    await this.$store.dispatch('websock/bind',this.info)
                    this.websocketsend(JSON.stringify(this.info));
                    //当绑定成功了，再告诉客服。我已经上线了。
                    await this.onlineTell();
                    if(this.picOrMsg==='msg'){
                        this.sendMsg();
                    }
                    if(this.picOrMsg==='pic'){
                        this.upload(this.temporaryPic);
                    }
                    this.picOrMsg='';
                    this.pings=setInterval(this.givePing,50000);
                    break;
                case 'text':case 'img':
                    //{content: "asdasd", fromid: 1, toid: "访客192.168.10.1", type: "text"}
                    //客服发过来的消息
                    let obj={};
                    obj.fromid=message.fromid;
                    obj.toid=message.toid;
                    if(message.type==='text'){
                        obj.type=1;
                        obj.content=AES.decrypt(message.content);
                    }else{
                        obj.type=2;
                        obj.content=message.content;
                    }
                    obj.created_at=this.getTime();
                    obj.rand=message.rand;
                    obj.withdraw=message.withdraw;
                    if(this.info.fromid===message.toid){
                        this.chatRecord.push(obj);
                        if(this.isClick){
                            this.$refs.audio.play(); //播放
                        }
                        this.time=this.getTime();
                        this.chatBottom();
                    }else{
                        //用户自己发送的消息,下面这个判断如果是多窗口的话。其他窗口的仍然需要push聊天记录
                        if(message.client_id!==this.info.client_id&&this.info.fromid===message.fromid){
                            this.time=this.getTime();
                            this.chatRecord.push(obj);
                        }
                    }
                    break;
                case 'online':
                    //如果当前我没有和任何人聊天,并且当前客服没有挂起
                    /*fromid: 2
                    is_server: 1
                    name: "小米"
                    type: "online"*/
                    if(this.info.name==='offline'&&message.is_server===1){
                        this.ping='为了让断开连接的时候，不要再请求一次';
                        await this.closeClient(this.info);
                        this.info.toid=message.fromid;
                        this.info.name=message.name;
                        this.info.avatar=message.avatar;
                        let obj={};
                        obj.fromid=this.info.toid;
                        obj.toid=this.info.fromid;
                        obj.type=1;
                        obj.content=message.content;
                        obj.created_at=this.getTime();
                        this.chatRecord.push(obj);
                        this.chatBottom();
                        clearInterval(this.pings);
                        await this.initWebSocket()
                            .then(()=>{
                                updateAccess(this.info)
                            });
                    }
                    break;
                case 'close':
                    if(message.fromid+''===this.info.toid+''){
                        this.info.name='offline';
                        let obj={};
                        obj.content='客服已掉线,正在为您重新安排客服';
                        obj.type=3;
                        this.chatRecord.push(obj);
                        await this.chooseOnlineCustomerService()
                            .then(()=>{
                                this.websocketsend(JSON.stringify(this.info));
                            });
                        if(this.info.name!=='offline'){
                            await this.onlineTell();
                        }
                        this.chatBottom();
                    }
                    //这是其他某个页面掉了，所以这个页面也该掉
                    if(message.fromid===this.info.fromid){
                        this.ping='长时间未回话,断开连接的标识';//仍然可以发消息
                        this.info.name='offline';
                        let transfer={};
                        transfer.content='您在其他页面已经退出';
                        transfer.type=3;
                        this.chatRecord.push(transfer);
                        this.chatBottom();
                        this.closeClient(this.info);
                        this.clearTime();//清除定时器*/
                        this.clearInterval(this.pings);
                    }
                    break;
                //{type:"withdraw",toid:"访客134.159.226.46",rand:"1918u4cwi7j2020-09-20 15:06:17",fromid:"2"}
                case 'withdraw':
                    //如果撤回的是我的
                    if(this.info.fromid===message.toid){
                        for (var i=0;i<this.chatRecord.length;i++){
                            if(this.chatRecord[i].rand===message.rand){
                                this.chatRecord[i].withdraw=1;
                                break;
                            }
                        }
                    }
                    break;
                case 'transfer':
                    /*add: "菲律宾"
                    fromid: "访客134.159.226.46"
                    ip: "134.159.226.46"
                    isread: 0
                    model: "其他设备"
                    name: "小米"
                    oldtoid: "3"
                    record: (16) [{…},{…},{…},{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                    toid:2
                    type:"transfer"*/
                    if(message.fromid===this.info.fromid){
                        this.info.toid=message.toid+'';
                        this.info.name=message.name;
                        let transfer={};
                        transfer.content='您已被'+message.name+'转接';
                        transfer.type=3;
                        this.chatRecord.push(transfer);
                        this.chatBottom();
                        await this.websocketsend(JSON.stringify(this.info));
                    }
                    break;
                case 'hang':
                    if(this.info.name==='offline'){
                        await this.chooseOnlineCustomerService();
                        if(this.info.name!=='offline'){
                            this.onlineTell();
                        }
                    }
                    break;
            }
        },
        //给服务端发送心跳
        givePing(){
            this.websock.send(JSON.stringify(this.givePingData));
        },
        //是否发送掉线信息
        sendPing(){
            let after=new Date(this.time).getTime()+300000;
            let now=new Date(this.getTime()).getTime();
            if(now>after){
                if(this.info.name!=='offline'){
                    let obj={};
                    obj.content='由于您长时间未进行对话。系统自动断开连接';
                    obj.type=3;
                    this.chatRecord.push(obj);
                    this.info.name='offline';
                }
                this.ping='长时间未回话,断开连接的标识';
                this.clearTime();
                this.closeClient(this.info);
                clearInterval(this.pings);
                this.chatBottom();
            }
        },
        //向上滑动
        infiniteScroll(info){
            //第一次点击,才会更改id
            if(info){
                this.info.tableId=this.chatRecord[0].id+1;
            }else{
                this.info.tableId=this.chatRecord[0].id;
            }
            this.findmany='';//查看更多
            this.loadingTop=true;//转动
            infiniteScroll(this.info)
                .then(res=>{
                    if(res.data.length===0){
                        this.loadingTop=false;
                        return this.nohavemany='暂无更多';
                    }
                    var length=res.data.length;
                    for(var i=length-1;i>=0;i--){
                        let obj={};
                        obj.id=res.data[i].id;
                        obj.fromid=res.data[i].fromid;
                        obj.toid=res.data[i].toid;
                        obj.type=res.data[i].type;
                        obj.content=res.data[i].content;
                        obj.withdraw=res.data[i].withdraw;
                        obj.rand=res.data[i].rand;
                        obj.created_at=res.data[i].created_at;
                        this.chatRecord.unshift(obj);
                    }
                    this.loadingTop=false;
                    this.currentPosition();
                });
        },
        //初始化weosocket
        async initWebSocket(){
            //ws地址,连接websock
            const wsuri=this.config.ws;
            this.websock=new WebSocket(wsuri);
            //获取到fromid->服务器的user表唯一ID,对于用户来说,fromid->访客+{ip}
            //当客服接收到服务器发送过来的消息
            this.websock.onmessage=await this.websocketonmessage;
            this.websock.onclose=await this.dropped;
        },
        //选择一名在线客服
        async chooseOnlineCustomerService(){
            await this.$store.dispatch('client/chooseOnlineCustomerService')
                .then(res=>{
                    this.loading=false;
                    if(res.data.isOnline==='offline'){
                        this.info.name=res.data.isOnline;
                        this.info.avatar='images/avatar.gif';
                    }else{
                        this.info.toid=res.data.fromid;
                        this.info.name=res.data.name;
                        this.info.avatar=res.data.avatar;
                    }
                    this.findmany='查看更多';
                    this.chatRecord.push(res.data);
                    this.chatBottom();
                });
        },
        //返回字样。并可以跳转
        jumplink(){
            window.open(this.info.jumplink,"_blank");
        },
        //获取fromid，也就是我.
        async getCurrentInfo(){
            await this.$store.dispatch('client/getCurrentInfo')
                .then(res=>{
                    //"访客134.159.226.46"
                    this.info.fromid=res.data.fromid;
                    this.info.jumplink=res.data.jumplink;
                    this.info.title=res.data.title;
                    this.info.vip=res.data.vip;
                });
        },
        //判断是否是移动端还是web端
        isMobile() {
            let flag=navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            if(flag){
                this.width=100;
            }
        },
        //滚动条的像素为0
        handleScroll (e) { //改变元素#searchBar的top值
            if(e.currentTarget.scrollTop===0){
                if(this.nohavemany===''){
                    this.infiniteScroll();
                }
            }
        },
        //让聊天框到达上一次的位置->无等待时间
        currentPosition(){
            this.$nextTick(function(){
                var div = document.getElementById('heightBottom');
                //第一次是1000 第二次是2000 第三次是3000
                this.currentHeight=div.scrollHeight-this.lastHeight;
                this.lastHeight=div.scrollHeight;
                div.scrollTop = this.currentHeight;
            })
        },
        //让聊天框到达最底部
        chatBottom(){
            this.$nextTick(function(){
                var div = document.getElementById('heightBottom');
                div.scrollTop = div.scrollHeight+300;
            });
        },
        //表情放在文本域中
        addEmoji(e) {
            this.content+=e.native;
        },
        //菜单栏 移入webkit-box-direction
        mousego(v){
            this.kulay=v;
        },
        //菜单栏 移出状态
        mousebye(){
            this.kulay='';
        },
        //給gatewayEvent發送消息
        async websocketsend(agentData){//数据发送
            await this.websock.send(agentData);
        },
        //获取时间->YYYY-MM-DD H:I:S
        getTime(){
            var myDate=new Date();
            var year=myDate.getFullYear();
            var month=myDate.getMonth()+1;
            if(month<10){
                month='0'+month;
            }
            var day= myDate.getDate();
            if(day<10){
                day='0'+day;
            }
            var hour= myDate.getHours();
            if(hour<10){
                hour='0'+hour;
            }
            var minutes= myDate.getMinutes();
            if(minutes<10){
                minutes='0'+minutes;
            }
            var seconds= myDate.getSeconds();
            if(seconds<10){
                seconds='0'+seconds;
            }
            return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
        },
        //清除定时器
        clearTime() {
            clearInterval(this.timer);
        },
        //删除当前连接的cilent用户
        async closeClient(info){
            //需要fromid,toid,client_id
            await this.$store.dispatch('client/closeClient',info);
        },
        //发送消息
        async send(){
            if(this.content.trim()===''){
                this.content='';
                return this.$message.error('聊天内容不能为空');
            }
            if(!this.ping){
                if(this.info.name==='offline'){
                    return this.content='';
                    //return this.$message.error('沒有客服上綫');
                }
            }
            this.time=this.getTime();
            this.info.content=AES.encrypt(this.content);
            this.info.rand=Number(Math.random().toString().substr(2)).toString(36)+this.time;
            let obj={};
            obj.content=this.content;
            this.content='';
            obj.fromid=this.info.fromid;
            obj.toid=this.info.toid;
            obj.type=1;
            obj.created_at=this.time;
            obj.rand=this.info.rand;
            this.chatRecord.push(obj);
            this.chatBottom();
            if(this.ping==='长时间未回话,断开连接的标识'){
                this.picOrMsg='msg';
                this.time='';
                await this.initWebSocket();
                await this.chooseOnlineCustomerService();
                this.ping='';
                if(this.info.name==='offline'){
                    return  this.$message.error('沒有客服上綫');
                }
                this.timer=setInterval(this.sendPing, 5000);
            }else{
                await this.sendMsg();
            }

        },
        //把消息发送
        async sendMsg(){
            this.info.type='text';
            await this.$store.dispatch('websock/sendMsg',this.info);
        },
        //发送图片
        sendPic(e){
            var file=e.target.files[0];
            this.$refs.pathClear.value='';
            this.upload(file);
        },
        async upload(file){
            this.temporaryPic=file;
            var type=file.type.split('/')[0];//image
            var size=file.size / 1024 / 1024 < 10;//image
            if(type!=='image'){
                return  this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
            }
            if(!size){
                return  this.$message.error('上传图片大小不能超过 10MB!');
            }
            if(this.ping==='长时间未回话,断开连接的标识'){
                this.picOrMsg='pic';
                this.time='';
                await this.initWebSocket();
                await this.chooseOnlineCustomerService();
                this.ping='';
                if(this.info.name==='offline'){
                    return  this.$message.error('沒有客服上綫');
                }
                return this.timer=setInterval(this.sendPing, 5000);
            }else{
                if(this.info.name==='offline'){
                    this.content='';
                    return  this.$message.error('沒有客服上綫');
                }
                var form_data=new FormData();
                form_data.append("file",file);
                form_data.append("toid",this.info.toid);
                form_data.append("fromid",this.info.fromid);
                form_data.append("client_id",this.info.client_id);
                form_data.append("client",this.info.client_id);
                this.time=this.getTime();
                this.info.rand=Number(Math.random().toString().substr(2)).toString(36)+this.time;
                this.$store.dispatch('websock/sendPic',form_data);
                let obj={};
                obj.content=URL.createObjectURL(file);
                obj.toid=this.info.toid;
                obj.fromid=this.info.fromid;
                obj.rand=this.info.rand;
                obj.type=4;
                obj.created_at=this.time;
                this.chatRecord.push(obj);
                this.chatBottom();
            }
        },
        //剪切板复制图片
        pasteImg(e) {
            const cbd = e.clipboardData;
            const ua = window.navigator.userAgent;
            // 如果是 Safari 直接 return
            if (!(e.clipboardData && e.clipboardData.items)) {
                return;
            }
            //
            if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
                cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
                ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
                return;
            }
            if(cbd.items[0].kind==='string' && typeof cbd.items[1]==='undefined'){
                return ;
            }
            /*for (let i = 0; i < cbd.items.length; i++) {
                let item = cbd.items[i];
                if (item.kind == "file") {
                    // blob 就是从剪切板获得的文件，可以进行上传或其他操作
                    const blob = item.getAsFile();
                    if (blob.size === 0) {
                        return;
                    }
                    this.upload(blob);
                }
                if(item.kind==="string"){
                    var that=this;
                    item.getAsString(function (str) {
                        // str 是获取到的字符串
                        that.content=str;
                    });
                }
            }*/
            //针对图片的copy信息
            if(cbd.items[0].kind==="file"||cbd.items[1].kind==="file"){
                // blob 就是从剪切板获得的文件，可以进行上传或其他操作
                let blob='';
                for(var i=0;i<cbd.items.length;i++){
                    if(cbd.items[i].kind==='file'){
                        blob=cbd.items[i].getAsFile();
                        break;
                    }
                }
                if(blob.size===0){
                    return;
                }
                return this.upload(blob);
            }
            //针对文字的copy信息
            let item=cbd.items[0];
            if(item.kind==="string"){
                const myField = this.$refs.contentArea;
                if (myField.selectionStart || myField.selectionStart === 0) {
                    this.content = myField.value;
                }
            }
        },
        //当绑定成功了，再告诉客服。我已经上线了。
        async onlineTell(){
            this.info.type='tell';
            await this.$store.dispatch('client/tell',this.info)
        },
    },
}
</script>
<style scoped>
@import "../../assets/aliicon/iconfont.css";
footer{
    height:100px;
    display: flex;
    align-items: center;
    padding: 0 20px 0 20px;
    justify-content: space-between;
    width: 100%;
}
.from{
    flex-direction: row-reverse;
}
.toText{
    padding: 10px;
    background:#B0C4DE;
    margin: 0 15px;
    justify-content: center;
    align-items: center;
    position: relative;
    display: -ms-flexbox;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    word-break:break-all;
    word-wrap:break-word
}
.fromText{
    padding: 10px;
    background: #409EFF;
    margin: 0 15px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    /*width: 50%;*/
    word-break:break-all;
    word-wrap:break-word
}
.to,.from{
    margin: 0 15px;
    display: flex;
    align-items: center;
    font-size: 15px;
}
.toMsgTime,.fromMsgTime{
    margin: 13px 15px;
    display: flex;
    font-size: 12px;
    color: #ccc;
}
.fromMsgTime{
    flex-direction: row-reverse;
}
>>>.el-loading-mask {
    position:absolute;
    z-index:2000;
    background-color: rgba(255, 255, 255, 0.9);
    margin:0;
    top:-10px;
    right:0;
    bottom:0;
    left:-5px;
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
}
/*隐藏滚动条*/
::-webkit-scrollbar {
    width: 0 !important;
}
::-webkit-scrollbar {
    width: 0 !important;height: 0;
}
/*隐藏滚动条*/
.content{
    width: 100%;
    height: calc(100vh - 150px);
    padding: 0 20px 0 20px;
    overflow-y: scroll;
}
header{
    line-height: 45px;
    font-size: 14px;
    width: 100%;
    height: 45px;
    background:#409EFF;
    display: flex;
    justify-content: space-between;
    color: white;
}
.box{
    height: 100%;
    margin: 0 auto;
    color: #595B66;
    font-family: 'Microsoft Yahei', sans-serif;
    border: 1px solid #E2E2E2;
}
.hiddenupload{
    position: relative;
    cursor: pointer;
    overflow: hidden;
    display: inline-block;
    text-decoration: none;
}
.hiddenupload input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}
.toHeader,.fromHeader{
    width: 40px;
    height: 40px;
}
.sendpic{
    width: auto;
    height: auto;
    max-width:100%;
    max-height: 100%;
}
#changecolor{
    background: #ccc;
}


</style>
