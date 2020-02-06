<template>
  <div class="currency">
    <!-- 弹框组件 -->
    <mt-actionsheet
      :actions="actions"
      v-model="sheetFlag"
    ></mt-actionsheet>
  </div>
</template>
<script>
export default {
  name: "vCurrency",
  props: ["actions", "sheetVisible"], //actions:操作的数据数组,sheetVisible:父组件回传的关闭组件状态
  data() {
    return {
      sheetFlag: false, // 控制弹框的值
    };
  },
  watch: {
    //sheetVisible:赋值到控制状态
    sheetVisible() {
      this.sheetFlag = this.sheetVisible;
    },
    //sheetFlag:回传到父组件
    sheetFlag() {
      this.$emit("closeChange", this.sheetFlag);
    }
  },
};
</script>
<style lang="scss"></style>
