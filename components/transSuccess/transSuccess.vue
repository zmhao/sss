<template>
  <!-- 交易成功的组件 -->
  <div class="transSuccess">
    <p class="transSuccess-img">
      <img src="../../assets/img/transImg@2x.png" />
    </p>
    <p class="transSuccess-title">{{ $t(text) }}</p>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '123'
    }
  }
};
</script>
<style lang="scss" scoped>
.transSuccess {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-img {
    padding: 35px 0 20px 0;
    img {
      width: 78px;
      height: 78px;
    }
  }
  &-title {
    color: #000000;
    font-size: 16px;
    opacity: 0.6;
  }
}
</style>
