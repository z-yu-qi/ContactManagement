<template>
  <div>
    <phone-book-header></phone-book-header>
    <!--:phoneBooks="phoneBooks给Search.vue组件中绑定通讯录数据-->
    <phone-book-search :phoneBooks="phoneBooks"></phone-book-search>
    <!--:phoneBooks="phoneBooks给list.vue组件中绑定通讯录数据-->
    <phone-book-list 
      letter="letter"
      v-if="Object.keys(phoneBooks).length > 0" 
      :phoneBooks="phoneBooks">
    </phone-book-list>
    <phone-book-alphabet @change="handleLetterChange" :phoneBooks="phoneBooks"></phone-book-alphabet>

  </div>
</template>

<script>
  import axios from 'axios'
  import {getServerUrl} from '../config/sys.js'
  import PhoneBookHeader from '../components/Header.vue'
  import PhoneBookSearch from '../components/Search.vue'
  import PhoneBookList from '../components/List.vue'
  import PhoneBookAlphabet from '../components/Alphabet.vue'
  import PubSub from 'pubsub-js'

  export default {
      name: "PhoneBook",
      data(){
        return{
          //通讯录数据
          phoneBooks:{},
          letter:''
        }
      },
      components:{
        PhoneBookHeader,
        PhoneBookSearch,
        PhoneBookList,
        PhoneBookAlphabet
      },
      methods:{
        getPhoneBooks(){
          //取到存在页面中的令牌token
          let token=window.localStorage.getItem("token")
          //将其封装在请求对象中带入到服务器端去
          axios.defaults.headers.common['token']=token
          //通过sys.js中的基础路径配置访问路径
          let url=getServerUrl("tphonebook/loadAllTPhonebook");
          //根据姓名首字母加载电话簿数据
          axios.get(url)
            .then(response=>{
              console.log(response);
              //将数据赋值给属性变量
              this.phoneBooks=response.data.data;
            }).catch(error=>{
            console.log(error)
          })
        },
        async refreshToken() {
          try {
            let url = getServerUrl('tadmin/refreshToken');
            let token = window.localStorage.getItem('token');
            axios.defaults.headers.common['token'] = token;
            
            const response = await axios.get(url, {})
              .then(response =>{
                if (response.data.code == 0) {
                  window.localStorage.setItem('token', response.data.msg);
                  console.log(`${new Date().toDateString()} token刷新成功: ${response.data.msg}`);
                  return response;
                }
              }).catch(error => {
              alert(error + '-请联系管理员')
            })
            
          } catch (error) {
            console.error('Token刷新失败:', error);
            throw error;
          }
        },
        handleLetterChange(letter){
            console.log('传来的字母:'+letter);
            this.letter=letter;
            
        },
        
      },
      mounted() { //页面初始化即加载
        this.getPhoneBooks(); // 加载所有电话簿信息
        this.refreshToken() // 刷新token
          .then(response => {
            if (response) {
              console.log(new Date().toDateString() + 'token刷新成功' + response.data.msg);
            }
        });
        //添加修改删除后需要重新加载通讯录数据（进行方法消息发布）
        PubSub.subscribe('refreshPhoneBook',(msg,data)=>{
          console.log('收到消息refreshPhoneBook')
          this.getPhoneBooks();

        });
      }
      
  }
</script>

<style scoped>

</style>