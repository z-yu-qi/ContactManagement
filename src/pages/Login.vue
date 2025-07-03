<template>
  <div>
    <div class="login-logo">通讯录</div>
    <form action="" class="login-cont">
      <p class="errorInfo">{{errorInfo}}</p>
      <ul>
        <li>
          <input v-model="username" type="text" placeholder="请输入用户名：">
        </li>
        <li>
          <input v-model="password" type="password" placeholder="请输入密码：">
        </li>
      </ul>
      <a href="javascript:;" class="submitButton" @click="submit()">登  录</a>
      <a href="javascript:;" class="submitButton" @click="interceptorTest()">测  试</a>
    </form>
    <p class="copyright">
      Copyright © 2019-2020 <a href="http://www.baidu.com">djin-phonebook</a>
    </p>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "Login",
    data(){
      return{
        username:'',
        password:'',
        errorInfo:'请您登陆'
      }
    },
    methods:{
      getServerUrl(path) {
        return `http://localhost:8090/${path}`;
      },
      submit(){
        if(this.username.trim()==''){
          this.errorInfo="用户名不能为空！";
          return;
        }
        if(this.password.trim()==''){
          this.errorInfo="密码不能为空！";
          return;
        }
        console.log('ok')
        let url = this.getServerUrl("tadmin/login");
        axios.post(url,{
          "username":this.username,
          "password":this.password
        })
          .then(response=>{
             console.log(response)
            // this.errorInfo="成功登录";
            this.$router.replace('/phoneBook');
            if (response.data.success) {
              //console.log(response)
              this.errorInfo = "成功登录";
              // 存储token
              localStorage.setItem('token', response.data.token);
              // 跳转到首页
              this.$router.replace('/phoneBook');
            } else {
              this.errorInfo = "登录失败";
            }
          }).catch(error=>{
              this.errorInfo=error;
          })
      },
      interceptorTest(){  //进行拦截器的访问测试
        //取到存在页面中的令牌token
        let token=window.localStorage.getItem("token")
        if(!token){
          console.warn('未找到token');
          return;
        }
        //将其封装在请求对象中带入到服务器端去
        axios.defaults.headers.common['token']=token
        //加载所有的通讯录数据
        axios.get(this.getServerUrl("tphonebook/loadAll"))
          .then(response=>{
            console.log("通讯录数据:"+response)
          }).catch(error=>{
            console.log("请求失败:"+error)
          })
      }
    }
  }
</script>

<style scoped>
  .login-logo {
    width: 3rem;
    height: 3rem;
    background: #10a78e;
    margin: 1rem auto .5rem;
    color: #fff;
    line-height: 3rem;
    font-size: .8rem;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
  }
  .login-cont {
    margin: 1rem .8rem;
    line-height: .4rem;
  }
  li {
    border-bottom: 1px solid #ebebeb;
    height: 1rem;
    padding: .3rem 0 0;
    position: relative;
    overflow: hidden;
  }
  input{
    border: none;
    line-height: .8rem;
    width: 100%;
    outline: 0;
  }
  .submitButton {
    background: #10a78e;
    color: #fff;
    border-radius: 1rem;
    height: 1rem;
    line-height: 1rem;
    font-size: .6rem;
    margin-top: 1rem;
    padding: 0;
    text-align: center;
    display: block;
  }
  .errorInfo {
    color: red;
    padding-top: .3rem;
  }
  .copyright {
    position: absolute;
    padding-top: 0;
    padding-left: 1rem;
    font-size: .3rem;
  }
</style>