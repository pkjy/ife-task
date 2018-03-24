<template>
  <div>
    <section>
      <div class="edit">
        <div class="edit-header">
          <input type="text" value="标题" id="page_subject" />
        </div>
        <div class="edit-qbox" id="edit-qbox">
        </div>
        <div class="edit-body">
          <ul v-show="ifAddQuestion">
            <li onClick="myQuestionaire.edit.newRadio(event)"><img :src="radioIcon" alt="q-icon" />
              <span>单选</span>
            </li>
            <li onClick="myQuestionaire.edit.newCheckbox(event)"><img :src="checkIcon" alt="q-icon" />
              <span>多选</span>
            </li>
            <li onClick="myQuestionaire.edit.newTextarea(event)"><img :src="textIcon" alt="q-icon" />
              <span>文本题</span>
            </li>
          </ul>
          <span @click='ifAddQuestion=!ifAddQuestion'>+ 添加问题</span>
        </div>
        <div class="edit-footer">
          <div>
            <span>问卷截至日期</span>
            <input type="text" class="date" data-calendar/>
          </div>
          <div>
            <input type="button" value="保存问卷" onclick="myQuestionaire.edit.save()" />
            <input type="button" value="发布问卷" onClick="myQuestionaire.edit.confirmPost()" />
          </div>
        </div>
      </div>
    </section>
    <section id="maskControl" class="hide">
      <div class="mask"></div>
      <div class="alert">
        <div class="alert-top">
          <span>提示</span>
        </div>
        <div class="alert-bottom">
          <p>是否发布问卷？</p>
          <p>问卷截止日期到
            <span id="limitedDate">未选择时间</span>
          </p>
          <div>
            <input type="button" value="确定" onClick="myQuestionaire.edit.post(event)" />
            <input type="button" value="取消" onClick="myQuestionaire.edit.confirmPost(event)" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {},
  data() {
    return {
      radioIcon: require("../assets/radio-16.png"),
      checkIcon: require("../assets/check-16.png"),
      textIcon: require("../assets/text-16.png"),
      ifAddQuestion: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
