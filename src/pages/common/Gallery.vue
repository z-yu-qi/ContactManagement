<template>
    <!--@click="hideClick"绑定点击事件，执行hideClick方法，将图片还原-->
    <div class="container" @click="hideClick">
        <div class="wrapper">
          <!--根据Add.vue组件传过来的数据显示图片-->
          <img :src="galleryImage" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "Gallery",
        props:{
          //接收Add.vue组件传过来的数据
          galleryImage:String
        },
        methods:{
          hideClick(){
            //调用Add.vue组件的方法hideGalleryClick，将图片还原
            this.$emit('hideGalleryClick')
          }
        }
    }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 99;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #000;
  }
  
  .container .wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }
  
  .container .wrapper img {
    width: 100%;
  }
</style>