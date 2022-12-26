<script setup>
</script>

<template>
  <nav>
    <!--使用 router-link 组件进行导航 -->
    <!--通过传递 `to` 来指定链接 -->
    <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
    <router-link to="/mryz">每日一字</router-link><br>
    <router-link to="/zitie">字帖</router-link>
  </nav>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view/>
</template>

<style scoped>

</style>
