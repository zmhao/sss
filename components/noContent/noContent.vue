<template>
  <div class="noContent">
      <!-- 暂无数据组件 -->
    <div class="noContent-img">
      <img src="../../assets/img/no-content@2x.png" alt="" />
    </div>
    <div class="noContent-text">{{ $t("暂时没有更多内容哦~") }}</div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.noContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  &-img {
    img {
      width: 130px;
      height: 130px;
    }
  }
  &-text {
    font-size: 16px;
    margin-top: 35px;
    color: #777777;
  }
}
</style>
