<template>
    <ul class="list">
      <li class="item"
        @click="handleLetterClick"
         v-for="(item,key) of letters">{{item}}</li>
    </ul>
</template>

<script>
    export default {
        name: "Alphabet",
        props:{
          phoneBooks:Object
        },
        computed:{
          letters(){
            const lettes=[]
            for (let i in this.phoneBooks){
              lettes.push(i)
            }
            return lettes;
          }
        },
        methods:{
            handleLetterClick(e){
                console.log(e.target.innerText);
                this.$emit("change",e.target.innerText);
            }
        }
    }
</script>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 1.58rem;
    right: 0;
    bottom: 0;
    width: 0.4rem;
  }
  
  .list .item {
    line-height: 0.8rem;
    text-align: center;
  }
</style>