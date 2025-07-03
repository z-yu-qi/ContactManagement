<template>
  <!--优化项目，使用页面缓存-->
  <keep-alive exclude="Detail">
    <router-view></router-view>
  </keep-alive>
</template>

<script>
  export default {
    name: 'App',

  }
</script>


<style scoped>

</style>
