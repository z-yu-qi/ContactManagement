<template>
    <div class="detail">
      <div class="header">
        <!--回到通讯录显示页面-->
        <router-link tag="div" to="/phoneBook" class="iconfont">&#xe667;</router-link>
      </div>
  
      <div class="image">
        <div class="info">
          <!--@click="showGalleryClick"绑定点击方式显示的方法-->
          <img :src="phoneBook.image" @click="showGalleryClick"/>
        </div>
        <div class="action">
          <!--点击执行文件域的上传方法-->
          <button @click="imageClick">修改头像</button>
          <!--文件域发生改变执行上传方法：自动上传，根据ref='file'中的file值发生改变就执行upload方法-->
          <input type="file" name="file" accept="image/png,image/gif,image/jpeg,image/jpg" ref="file" @change="upload">
        </div>
      </div>
  
      <div class="userInfo">
        <div class="item border-bottom">
          <span>姓名</span>
          <input type="text" placeholder="请输入姓名" v-model="phoneBook.name">
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
          <textarea  placeholder="请输入工作单位地址" v-model="phoneBook.workaddress"></textarea>
        </div>
        <div class="item border-bottom">
          <span>家庭地址</span>
          <textarea placeholder="请输入家庭地址" v-model="phoneBook.homeaddress"></textarea>
        </div>
        <div class="item border-bottom">
          <span>备注</span>
          <textarea placeholder="请输入备注" v-model="phoneBook.remark"></textarea>
        </div>
      </div>
  
      <div class="action">
        <div class="item border-bottom" style="background-color: #25a4bb">
          <a @click="updInfo">修改</a>
        </div>
        <div class="item border-bottom" style="background-color: crimson">
            <a @click="deleteInfo">删除</a>
        </div>
      </div>
      <!--引入Gallery.vue组件
            v-show="showGallery"根据showGallery的值是否显示放大图片
            :galleryImage="galleryImage"向Gallery.vue组件传入参数galleryImage
            @hideGalleryClick="hideGalleryClick"绑定此组件要执行的hideGalleryClick方法
        -->
      <Gallery v-show="showGallery"
               :galleryImage="galleryImage"
               @hideGalleryClick="hideGalleryClick"></Gallery>
    </div>
  </template>
  
  <script>
      import axios from 'axios'
      import {getServerUrl} from '../config/sys'
      import Gallery from "../pages/common/Gallery.vue";
      export default {
          name: "Detail",
          components: {
            Gallery
          },
          data(){
              return{
                phoneBook: {
                    image: 'https://img.shetu66.com/2023/09/20/1695193306328559.png',
                    name: '',
                    phonenumber: '',
                    telenumber: '',
                    workaddress: '',
                    homeaddress: '',
                    remark: ''
                },
                //定义数据属性，是否显示放大图片的div
                showGallery:false,
                //定义要显示的图片路径数据属性
                galleryImage:'',
                checkPhoneIf: false,
                checkTeleIf: false,
                oldPhone:'',
                oldTele:''
              }
          },
          methods:{
            //点击图片进行放大的方法
            showGalleryClick(){
                //显示放大组件
                this.showGallery = true;
                //将图片地址给到变量，传入到图片放大组件中
                this.galleryImage = this.phoneBook.image;
            },
            //被Gallery.vue组件调用的将图片还原
            hideGalleryClick(){
              this.showGallery=false
            },
            imageClick(){
              //this.$refs.file相当于选择器，找到ref='file'的这个标签
              //调用文件域点击事件，执行upload()方法
              this.$refs.file.click();
            },
            //文件上传方法
            upload(e){
              //获取被上传的文件
              let file=e.target.files[0];
              let param=new FormData();
              //将文件封装到此参数对象中
              param.append('file',file,file.name);
              console.log(param.get('file'));
              //构建访问后端服务器的上传控制器路径
              let url=getServerUrl("tphonebook/uploadImage");
              //获取用户数据token
              let token=window.localStorage.getItem("token")
              //将用户数据token封装到request请求对象的header中
              //修改请求参数的类型，让其传递文件参数
              let config={
                headers:{'Content-Type':'multipart/form-data','token':token}
              };
              //执行图片文件的异步上传操作
              axios.post(url,param,config)
                .then(response=>{
                  console.log(response.data);
                  if(response.data.code==200){
                    this.phoneBook.image=response.data.newFileName;
                    console.log(response.data.newFileName);
                  }
                  alert(response.data.msg);
                }).catch(error=>{
                console.log(error)
              })
            },
            //点击执行添加的方法
            updInfo(){
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
                //装入主键id
                this.phoneBook['id'] = this.$route.params.id
                let url=getServerUrl('tphonebook/updT');
                let token=window.localStorage.getItem('token')
                axios.defaults.headers.common['token'] = token;
                axios.post(url,this.phoneBook)
                    .then(response=>{
                    if(response.data=='updSuccess'){
                    alert("修改成功")
                    //执行List.vue组件中的refreshPhoneBook方法，重新加载通讯录数据
                    PubSub.publish('refreshPhoneBook','');
                    //跳转到通讯录页面
                    this.$router.replace('/phoneBook')
                    }else{
                    alert(response.data.msg)
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
            getInfo(){
                // 确保从路由获取ID
                const id = this.$route.params.id;
                if (!id) {
                    console.error('未获取到联系人ID');
                    return;
                }
                let url=getServerUrl('tphonebook/loadTById');
                let token=window.localStorage.getItem('token')
                axios.defaults.headers.common['token'] = token;
                axios.get(url,{
                    params:{
                        id: id
                    },
                    headers: {
                        'token': token
                    }
                }).then(response=>{
                    this.phoneBook=response.data;
                    console.log(this.phoneBook)
                }).catch(error=>{
                    alert(error+'-请联系管理员')
                })  
            },
            keyupCheckPhone(){  //填写手机号执行的方法
            if(this.phoneBook.phonenumber!=null && this.phoneBook.phonenumber.trim()!=''
                &&(/^1[3456789]\d{9}$/.test(this.phoneBook.phonenumber))){
                if(this.oldPhone!=this.phoneBook.phonenumber){
                this.checkPhone();  //验证手机号唯一性
                }
            }

            },
            keyupCheckTele(){  //填写座机号执行的方法
                if(this.phoneBook.telenumber!=null && this.phoneBook.telenumber.trim()!=''
                &&(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.phoneBook.telenumber))){
                if(this.oldTele!=this.phoneBook.telenumber){
                    this.checkTele();  //验证座机号唯一性
                }
                }

            },
            deleteInfo(){
                if(confirm('您确定要删除这条记录吗')){
                    let url=getServerUrl('tphonebook/delete');
                    let token=window.localStorage.getItem('token')
                    axios.defaults.headers.common['token'] = token;
                    axios.post(url,{id:this.$route.params.id}).then(response=>{
                    if(response.data=='delSuccess'){
                        alert("删除成功")
                        //执行PhoneBook.vue组件中的refreshPhoneBook方法，重新加载通讯录数据
                        PubSub.publish('refreshPhoneBook','');
                        //跳转到通讯录页面
                        this.$router.replace('/phoneBook')
                    }else{
                        alert(response.data.msg)
                    }
                    }).catch(error=>{
                    alert(error+'-请联系管理员')
                    })
                }
           }
          },
          mounted() {
            if (!this.$route.params.id) {
                this.$message.warning('无效的联系人ID');
                this.$router.back();
                return;
            }
            this.getInfo();
            this.oldPhone = this.phoneBook.phonenumber;
            this.oldTele = this.phoneBook.telenumber;
            
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

  .detail .userInfo .item input,
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