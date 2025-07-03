<template>
    <div class="detail">
      <div class="header">
        <!--回到通讯录显示页面-->
        <router-link tag="div" to="/phoneBook" class="iconfont">&#xe667;</router-link>
      </div>
       
      <div class="image">
        
        <div class="info">
            <img :src="phoneBook.image" @click="showGalleryClick"/>
        </div>
        <div class="action">
            <button @click="imageClick">修改头像</button>
            <!--文件域发生改变执行上传方法-->
            <input type="file" name="file" accept="image/png,image/gif,image/jpeg,image/jpg" ref="file" @change="upload">
        </div>
       
      </div>

        <div class="userInfo">
            <div class="item border-bottom">
                <span>姓名</span>
                <input type="text" v-model="phoneBook.name">
            </div>
            <div class="item border-bottom">
            <span>手机号码</span>
            <input type="text" placeholder="请输入手机号" v-model="phoneBook.phonenumber" @keyup="keyupCheckPhone">
            </div>
            <div class="item border-bottom">
            <span>座机电话号码</span>
            <input type="text" placeholder="请输入座机号" v-model="phoneBook.telenumber" @keyup="keyupCheckTele">
            </div>
            <div class="item border-bottom">
                <span>工作单位地址</span>
                <textarea v-model="phoneBook.workaddress"></textarea>
            </div>
            <div class="item border-bottom">
                <span>家庭地址</span>
                <textarea v-model="phoneBook.homeaddress"></textarea>
            </div>
            <div class="item border-bottom">
                <span>备注</span>
                <textarea v-model="phoneBook.remark"></textarea>
            </div>  
        </div>

      <div class="action">
        <div class="item border-bottom" style="background-color: yellowgreen">
            <a @click="addInfo">保存</a>
        </div>
      </div>
       <!--引入Gallery.vue组件
        v-show="showGallery"根据showGallery的值是否显示放大图片
        :galleryImage="galleryImage"向Gallery.vue组件传入参数galleryImage
        @hideGalleryClick="hideGalleryClick"绑定此组件要执行的hideGalleryClick方法
        -->
        <gallery
            v-show="showGallery"
            :galleryImage="galleryImage"
            @hideGalleryClick="hideGalleryClick">
        </gallery>
    </div>
</template>

<script>
    import axios from 'axios'
    import {getServerUrl} from '@/config/sys.js'
    import Gallery from '@/pages/common/Gallery.vue'
    import PubSub from 'pubsub-js'
    
    export default {
        name: "Add",
        data(){
          return{
            phoneBook:{image:'http://svbxca0zm.hb-bkt.clouddn.com/test1.png'},
            //定义数据属性，是否显示放大图片的div
            showGallery:false,
            //定义要显示的图片路径数据属性
            galleryImage:'',
            checkPhoneIf: false,
            checkTeleIf: false
        }
        },
        components:{
            //定义组件名
            Gallery
        },
        methods:{
            //将图片放大显示，且设置galleryImage参数
            showGalleryClick(){
                this.galleryImage=this.phoneBook.image;
                this.showGallery=true
            },
            //被Gallery.vue组件调用的将图片还原
            hideGalleryClick(){
                this.showGallery=false
            },
            imageClick(){
                console.log('图片被点击了');
                //调用文件域的点击事件，执行upload方法
                this.$refs.file.click();
            },  
            async upload(e){  //文件上传方法
                //获取被上传的文件
                const file = e.target.files[0];
                if (!file) return;
                const param=new FormData();
                //将文件封装到此参数对象中
                param.append('file',file,file.name);
                console.log(param.get('file'));
                try{
                    //封装访问服务器端的路径
                    let url=getServerUrl("tphonebook/uploadImage");
                    //取到用户数据token
                    let token=window.localStorage.getItem('token')
                    //将用户数据token封装到request请求对象的header中
                    let config={
                        headers:{'Content-Type':'multipart/form-data','token':token}
                    };
                    //将用户数据token装入到异步请求对象中
                    axios.defaults.headers.common['token'] = token;
                    //执行异步添加操作
                    axios.post(url,param,config)
                    .then(response=>{
                        console.log(response.data);
                        if(response.data.code==200){
                            alert("添加成功")
                            this.phoneBook.image=response.data.newFileName;
                            console.log(response.data.newFileName);
                        }else{
                            alert("添加失败")
                        }
                        alert(response.data.msg);
                    }).catch(error=>{
                        console.log(error)
                    })
                }catch(error){
                    console.error('上传失败:', error);
                    this.$message.error('上传失败，请重试');
                }
            },
            addInfo(){
                if(this.phoneBook.name==null || this.phoneBook.name.trim()==''){
                alert("姓名不为空！")
                return;
                }
                if(this.phoneBook.phonenumber==null || this.phoneBook.phonenumber.trim()==''){
                alert("手机号码不为空！")
                return;
                }
                if(!(/^1[3456789]\d{9}$/.test(this.phoneBook.phonenumber))){
                alert("手机号码有误，请重填");
                return;
                }
                if(this.phoneBook.telenumber!=null && this.phoneBook.telenumber.trim()!='' && !/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.phoneBook.telenumber)){
                alert('固定电话有误，请重填');
                return false;
                }
                console.log(this.phoneBook);
                //封装访问服务器端的路径
                let url=getServerUrl('tphonebook/saveT');
                //取到用户数据token
                let token=window.localStorage.getItem('token')
                //将用户数据token装入到异步请求对象中
                axios.defaults.headers.common['token'] = token;
                //执行异步添加操作
                axios.post(url,this.phoneBook)
                .then(response=>{
                    console.log(response.data);
                    if(response.data=='saveSuccess'){
                        alert("添加成功")
                    //自动跳转到通讯录显示页面
                    // this.$router.replace('/phoneBook')
                    }else{
                        alert("添加失败")
                    }
                }).catch(error=>{
                alert(error)
                })
            },
            checkPhone(){
                //取到存在页面中的令牌token
                let token=window.localStorage.getItem("token")
                //将其封装在请求对象中带入到服务器端去
                axios.defaults.headers.common['token']=token
                //执行通讯录添加
                axios.post(getServerUrl("tphonebook/getTotalByPramas"),{"phonenumber":this.phoneBook.phonenumber})
                .then(response=>{
                    if(response.data>0){
                    this.checkPhoneIf = false;
                    }else {
                    this.checkPhoneIf = true;
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            checkTele(){
                //取到存在页面中的令牌token
                let token=window.localStorage.getItem("token")
                //将其封装在请求对象中带入到服务器端去
                axios.defaults.headers.common['token']=token
                //执行通讯录添加
                axios.post(getServerUrl("tphonebook/getTotalByPramas"),{"telenumber":this.phoneBook.telenumber})
                .then(response=>{
                if(response.data>0){
                    this.checkTeleIf = false;
                }else {
                    this.checkTeleIf = true;
                }
                }).catch(error=>{
                console.log(error)
                })
            },
            keyupCheckPhone(){  //填写手机号执行的方法
                if(this.phoneBook.phonenumber!=null && this.phoneBook.phonenumber.trim()!=''
                    &&(/^1[3456789]\d{9}$/.test(this.phoneBook.phonenumber))){
                    this.checkPhone();  //验证手机号唯一性
                }
            },
            keyupCheckTele(){  //填写座机号执行的方法
                if(this.phoneBook.telenumber!=null && this.phoneBook.telenumber.trim()!=''
                &&(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.phoneBook.telenumber))){
                this.checkTele();  //验证座机号唯一性
                }

            }
        }
        
    }
</script>

<style scoped>
  @import "../assets/styles/varibles.css";

  .border-bottom::before {
    border-color: var(--borderColor);
  }

  .detail .header {
    position: fixed;
    top: 0;
    overflow: hidden;
    height: var(--headerHeight);
    line-height: var(--headerHeight);
    text-align: left;
    padding-left: 0.2rem;
    padding-top: 0.1rem;
    background-color: var(--borderColor);
    width: 100%;
    z-index: 10;
    opacity: 0.8;
  }

  .detail .image {
    margin-top: 0.86rem;
    text-align: center;
    width: 90%;
    height: 2.5rem;
  }

  .detail .image .info img {
    float: left;
    border-radius: 0.5rem;
    overflow: hidden;
    padding: 0.3rem;
    width: 2rem;
    height: 2rem;
  }

  .detail .image .action {
    padding-top: 1.55rem;
    text-align: left;
  }

  .detail .image .action button {
    background-color: #4caf50;
    border: none;
    color: #fff;
    padding: 0.15rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 0.2rem;
  }

  .detail .image .action input {
    display: none;
  }

  .detail .userInfo {
    padding-left: 0.3rem;
    padding-top: 0;
  }

  .detail .userInfo .item {
    padding-top: 0.3rem;
    padding-bottom: 0.1rem;
  }

  .detail .userInfo .item span {
    display: block;
    font-weight: 700;
  }

  .detail .userInfo .item input {
    padding-top: 0.1rem;
    width: 100%;
  }

  .detail .userInfo .item textarea {
    padding-top: 0.1rem;
    width: 100%;
  }

  .detail .action {
    padding-top: 0.5rem;
    padding-bottom: 2rem;
  }

  .detail .action .item {
    width: 100%;
    text-align: center;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .detail .action .item a {
    font-size: 0.4rem;
    color: #576b97;
  }
</style>