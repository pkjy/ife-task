<template>
  <div>
    <section>
      <table class="list-table">
        <thead>
          <tr>
            <th></th>
            <th>标题</th>
            <th>时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="checkBox">

        </tbody>
        <tfoot>
          <tr>
            <td colspan="2"><input type="checkbox" id="checkAll" onChange="myQuestionaire.index.checkAll(event)" />
              <span class="check-all">全选</span>
            </td>
            <td><input type="button" value="删除" id="delete_some" onClick="myQuestionaire.index.toggleMask(event)" /></td>
            <td colspan="2" class="addQn">
              <input type="button" id="addQn" value="+ 新增问卷" @click="$router.push({name:'MainAdd'})" />
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  name: "MainHome",
  props: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
