<template>
  <!-- 交易成功界面 -->
  <div class="transSucc">
    <div class="transSucc-header">
      <v-header :title="title"></v-header>
    </div>
    <div class="transSucc-content">
      <v-transSuccess :text="text"></v-transSuccess>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vTransSuccess from "@/components/transSuccess/transSuccess";
export default {
  data() {
    return {
      title: "",
      text: ""
    };
  },
  mounted() {
    let that = this;
    that.title = that.$route.query.title;
    that.text = that.$route.query.text;
  },
  components: {
    vHeader,
    vTransSuccess
  }
};
</script>
<style lang="scss" scoped>
.transSucc {
  width: 100%;
  height: 100%;
}
</style>
