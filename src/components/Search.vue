<template>
    <div>
      <div class="search">
        <input v-model="keyword" class="search-input" type="text" placeholder="搜索"/>
      </div>
      <div class="search-content" ref="search" v-show="keyword">
        <div>
            <div class="item"
                v-for="item of list"
                :key="item.id">
            <img :src="item.image" >
            <div class="content border-bottom">{{item.name}}</div>
            </div>
            <div class="item center" v-show="!list.length">
                没有找到匹配数据
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Bscroll from 'better-scroll';
    import PhoneBook from '../pages/PhoneBook.vue';

    export default {
        name: "Search",
        data(){
          return{
            keyword:'',
            list:[]
          }
        },
        props:{
            phoneBooks:Object
        },
        watch:{
            keyword(){
                if(!this.keyword){
                    this.list=[];
                    return;
                }
                const result=[]
                for(let i in this.phoneBooks){
                    this.phoneBooks[i].forEach((value)=>{
                        if(value.name.indexOf(this.keyword)>-1){
                            result.push(value);
                        }
                    })
                }
                this.list=result
            }
        },
        mounted() {
            this.scroll=new Bscroll(this.$refs.search)
        }
        
    }
</script>

<style scoped>
  
  @import "../assets/styles/varibles.css";

  .border-bottom::before {
    border-color: #D3D3D3;
  }

  .search {
    padding: 0.1rem 0.1rem;
    height: 0.72rem;
    background: var(--bgColor);
    text-align: center;
  }

  .search .search-input {
    box-sizing: border-box;
    width: 100%;
    height: 0.62rem;
    line-height: 0.62rem;
    text-align: center;
    border-radius: 0.06rem;
    color: #666;
    padding: 0 0.1rem;
  }

  .search-content {
    z-index: 99;
    overflow: hidden;
    position: absolute;
    top: 1.74rem;
    left: 0;
    right: 0;
    bottom: 0;
    background: #eee;
  }

  .search-content .item {
    line-height: 0.76rem;
    margin: 0.2rem;
  }

  .search-content .item img {
    float: left;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.2rem;
  }

  .search-content .item .content {
    padding-left: 1rem;
    font-size: 0.4rem;
    padding-bottom: 0.3rem;
  }

  .search-content .center {
    text-align: center;
  }
</style>