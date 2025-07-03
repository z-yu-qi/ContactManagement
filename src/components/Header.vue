<!--Header.vue-->
<template>
    <div class="header">
      通讯录
      <!-- <div class="iconfont add-icon">&#xe81b;</div> -->
      <router-link to="/add" tag="div" class="iconfont add-icon">&#xe81b;</router-link>
    </div>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>
 @import "../assets/styles/varibles.css";
  .header {
    position: relative;
    overflow: hidden;
    background: var(--bgColor);  /* 使用CSS变量 */
    font-size: 0.35rem;
    font-weight: bold;
    text-align: center;
    height: 0.86rem;
    line-height: 0.86rem;
  }
  .header .add-icon {
    position: fixed;
    right: 0.45rem;
    top: 0rem;
  }
</style>