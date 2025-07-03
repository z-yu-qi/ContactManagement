<template>
    <!--关联绑定此div中数据的变化-->
    <div class="list" ref="wrapper">
      <!--使用div将滚动的显示出来-->
      <div>
        <div class="phoneBook"
            v-for="(item,key) of phoneBooks"
            :key="key" 
            :ref="key">
          <div class="title">{{key}}</div>
          <router-link class="item"
                :to="`/detail/${innerItem.id}`"
                tag="div"
                v-for="innerItem of item"
                :key="innerItem.id">
            <img :src="innerItem.image" />
            <div class="content border-bottom">{{innerItem.name}}</div>
          </router-link>
      </div>
      </div>
    </div>
</template>

<script>
    //引入better-scroll插件
    import Bscroll from 'better-scroll'
    import {getServerUrl} from '../config/sys.js'

    export default {
        name: "List",
        props:{
          phoneBooks: Object,
          letter: String
        },
        watch:{
            letter(){
                if(this.letter){  //有变化就执行
                    console.log("执行了点击字母实现滚动到指定位置");
                    const element=this.$refs[this.letter][0];
                    this.scroll.scrollToElement(element);
                }
                else{
                    console.log("无变化");
                }
            } 
        },
        mounted() { //初始化滚动
          this.scroll=new Bscroll(this.$refs.wrapper,{click: true});
          //console.log("初始化");
        }
        
    }
    
</script>

<style scoped>
   @import "../assets/styles/varibles.css";

  .border-bottom::before {
    border-color: var(--borderColor);
  }

  .list {
    position: absolute; /* 或 fixed */
    overflow: hidden;
    top: 1.58rem;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 100vh;
    overflow-y: auto; /* 允许滚动 */
  }

  .list .title {
    line-height: 0.54rem;
    background: var(--bgColor);
    padding-left: 0.2rem;
    color: #666;
    font-size: 0.26rem;
  }

  .list .item {
    line-height: 0.76rem;
    margin: 0.2rem;
  }

  .list .item img {
    float: left;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.2rem;
  }

  .list .item .content {
    padding-left: 1rem;
    font-size: 0.4rem;
    padding-bottom: 0.3rem;
  }
</style>