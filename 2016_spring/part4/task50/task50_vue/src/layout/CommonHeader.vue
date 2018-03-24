<template>
  <div class="hello">
    <header class='header'>
      <img :src="imgHead" />
      <h3>问卷管理</h3>
      <router-link :to="{name:'MainHome'}" class='go-home'>
        <span title="主页">我的问卷</span>
      </router-link>
      <a href="https://github.com/pkjy/ife-task/tree/gh-pages/2016_spring/part4/task50/" class="go-github">
        <span title="跳转至Github">源码</span>
      </a>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "CommonHeader",
  props: {},
  data() {
    return {
      imgHead: require("../assets/log_50x50.png")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
