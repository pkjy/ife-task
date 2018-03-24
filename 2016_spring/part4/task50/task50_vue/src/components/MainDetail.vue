<template>
  <div>
    <section>
      <div class="detail">
        <div class="detail-header">
          <div>
            <h2 id="page_subject">这里是标题</h2>
            <p>此统计分析只包含完整回收的数据</p>
          </div>
        </div>
        <div class="detail-boxes" id="content_area">
        </div>
        <router-link :to="{name:'MainHome'}">
          <div class="detail-bottom">
            <img :src="imgIcon" alt="back" />
            <span>返回</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "MainDetail",
  props: {},
  data() {
    return {
      imgIcon: require("../assets/back-32.png")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
