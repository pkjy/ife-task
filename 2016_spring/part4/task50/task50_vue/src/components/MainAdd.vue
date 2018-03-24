<template>
  <div>
    <section class="add">
      <div class="add-icon"><img :src="imgIcon" alt="add" /></div>
      <router-link :to="{name:'MainEdit'}">新建问卷</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: "MainAdd",
  props: {},
  data() {
    return {
      imgIcon: require("../assets/add-32.png")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
