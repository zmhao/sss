<template>
  <div class="scanContent">
    <v-header title="提示"></v-header>
    <div class="scanContent-content">
      <div class="scanContent-content-way">{{ $t("已扫描到以下内容") }}</div>
      <div class="scanContent-content-text">{{ $t(message) }}</div>
      <div class="scanContent-title">
        {{ $t("扫描所得内容并非本应用提供，请谨慎使用。") }}
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";

export default {
  data() {
    return {
      message: "asdad"
    };
  },
  mounted() {
    let that = this;
    that.message = that.$route.query.code;
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss" scoped>
.scanContent {
  width: 100%;
  height: 100%;
  &-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100% - 50;
    padding: 0 18px;
    &-way {
    }
    &-text {
      margin-top: 20px;
      position: relative;
      border: 1px solid #f8f8f8;
      width: 100%;
      padding: 10px 0;
      font-size: 20px;
      color: $font-color;
    }
  }
  .scanContent-title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 10px;
    color: #bbbbbb;
  }
}
</style>
