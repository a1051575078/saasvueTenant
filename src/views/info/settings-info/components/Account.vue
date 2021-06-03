<template>
    <el-form ref="form" label-position="top" label-width="80px" :model="user" :rules="formRules">
        <el-form-item label="上传头像" style="display: flex;flex-direction: column">
            <el-upload
                    class="avatar-uploader"
                    :action="config.uploadJson"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="user.avatar" :src="user.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 100px;height: 100px;line-height:100px"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
            <el-input v-model.trim="user.name" v-if="user.role==='管理员'" :disabled="true"/>
            <el-input v-model.trim="user.name" v-if="user.role!=='管理员'"/>
        </el-form-item>
        <el-form-item label="修改密码" prop="password">
            <el-input show-password v-model.trim="user.password"/>
        </el-form-item>
        <div v-if="$store.getters.roles==='管理员'">
            <el-form-item label="标题名称" prop="title">
                <el-input v-model.trim="user.title"/>
            </el-form-item>
            <el-form-item label="返回链接" prop="jumplink">
                <el-input v-model.trim="user.jumplink"/>
            </el-form-item>
            <el-form-item label="聊天记录存储时间(默认30天)">
                <el-input-number v-model="user.num" :min="1" :max="30"></el-input-number>
            </el-form-item>
        </div>
        <div v-if="$store.getters.roles!=='管理员'">
            <el-form-item label="上传提醒语音">
                <el-upload
                    class="upload-demo"
                    drag
                    :action="config.uploadJson"
                    :limit="1"
                    :before-upload="beforeMusic"
                    :on-success="handleMusicSuccess">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">播放默认音效。支持上传文件格式mp3、wav等音频文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="欢迎语">
                <div class="components-container">
                    <div>
                        <tinymce v-model="user.content" :height="300" />
                    </div>
                    <div class="content" style="margin:0 auto">
                        <div>
                            <span class="fromMsgTime" style="font-size: 12px;color: #ccc">2088年08月08日</span>
                            <div class="from">
                                <img src="@/assets/hoster.jpg" alt="" class="fromHeader">
                                <div class="fromText" style="color:white">我是用户的角度看，当我加入进来的时候。看客服发给我的样子是👇</div>
                            </div>
                        </div>
                        <div v-if="user.content">
                            <span class="toMsgTime" style="font-size: 12px;color: #ccc">2088年08月08日</span>
                            <div class="to" style="line-height: 25px">
                                <img src="@/assets/cust.jpg" alt="" class="toHeader">
                                <div v-html="user.content" class="toText"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="submit('form')">更新</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
    import Tinymce from '@/components/Tinymce/index'
    import {updateUser} from "@/api/user";
export default {
    components:{Tinymce},
    props: {
        user: {
            type: Object,
            default: () => {
                return {
                    id:'',
                    name: '',
                    avatar: '',
                    content:``,
                    password:'',
                    title:'',
                    roles:'',
                    jumplink:'',
                    music:{},
                    num:undefined,
                }
            }
        }
    },
    data(){
        var name=(rule,value,callback)=>{
            if(value===''){
                callback(new Error('昵称不能为空'));
            }
            if(value.length>15){
                callback(new Error('长度不能超过15位数'));
            }
            callback();
        };
        var title=(rule,value,callback)=>{
            if(value!=null){
                if(value.length>20){
                    callback(new Error('字节长度请减少'));
                }
            }
            callback();
        };
        var password=(rule,value,callback)=>{
            if(value.length<6&&value!==''){
                callback(new Error('长度不能小于6位数'));
            }
            if(value.length>10&&value!==''){
                callback(new Error('长度不能大于10位数'));
            }
            callback();
        };
        var jumplink=(rule,value,callback)=>{
            if(value==null||value===''){
                callback();
            }
            let reg =/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (!reg.test(value)) {
                callback(new Error('请输入正确的链接。例:https://www.baidu.com OR https://baidu.com'))
            }else{
                callback();
            }
        };
        return {
            avatar:{},
            formRules:{
                name:[{required:true,validator:name,trigger:'change'}],
                password:[{validator:password,trigger:'blur'}],
                jumplink:[{validator:jumplink,triger:'blur'}],
                title:[{validator:title,triger:'blur'}]
            }
        }
    },
    methods: {
        handleMusicSuccess(res,file){
            //this.user.music= URL.createObjectURL(file.raw);
        },
        handleAvatarSuccess(res,file){
            this.user.avatar= URL.createObjectURL(file.raw);
        },
        beforeMusic(file){
            var type=file.type.split('/')[0];//audio
            var size=file.size / 1024 / 1024 < 0.5;//audio
            if(type!=='audio'){
                this.$message.error('上传的文件必须是音频格式!');
                return false;
            }
            if(!size){
                this.$message.error('上传图片大小不能超过500KB!');
                return false;
            }
            this.user.music=file;
        },
        beforeAvatarUpload(file) {
            var type=file.type.split('/')[0];//image
            var size=file.size / 1024 / 1024 < 3;//image
            if(type!=='image'){
                this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
                return false;
            }
            if(!size){
                this.$message.error('上传图片大小不能超过 3MB!');
                return false;
            }
            this.avatar=file;
        },
        submit(form) {
            this.$refs[form].validate(valid=>{
                if(valid){
                    var form_data=new FormData();
                    if(JSON.stringify(this.avatar) !== "{}"){
                        form_data.append("file",this.avatar);
                    }else{
                        form_data.append("file",'');
                    }
                    if(JSON.stringify(this.user.music)!=="{}"){
                        form_data.append("music",this.user.music);
                    }else{
                        form_data.append("music",'');
                    }
                    form_data.append("id",this.user.id);
                    form_data.append("name",this.user.name);
                    form_data.append("content",this.user.content);
                    form_data.append("password",this.user.password);
                    form_data.append("title",this.user.title);
                    form_data.append("jumplink",this.user.jumplink);
                    form_data.append("num",this.user.num);
                    updateUser(form_data)
                    .then(res=>{
                        form_data='';
                        this.$store.dispatch('user/updateavatar',res.data);
                        this.user.password='';
                        this.$message({
                            message:'用户信息已成功更新',
                            type: 'success',
                            duration: 5 * 1000
                        })
                    })
                }
            });
        }
    }
}
</script>
<style scoped>
    .from{
        flex-direction: row-reverse;
    }
    .content{
        width: 50%;
    }
    .toHeader,.fromHeader{
        width: 40px;
        height: 40px;
    }
    .toText{
        padding: 10px;
        background:#B0C4DE;
        margin: 0 15px;
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
    .toMsgTime,.fromMsgTime{
        margin: 13px 15px;
        display: flex;
    }
    .fromMsgTime{
        flex-direction: row-reverse;
    }
    .to,.from{
        margin: 0px 15px;
        display: flex;
        align-items: center;
        font-size: 15px;
    }
    .editor-content{
        margin-top: 20px;
    }
    >>>.avatar-uploader{
        line-height: 10px;
    }
    >>>.el-form-item__label{
        display: flex;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>
