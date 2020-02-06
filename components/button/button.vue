<template>
  <div class="btn">
    <div class="btn-box">
      <mt-button
        v-on:click="onSubmit()"
        class="button-container"
        :class="disabledVal == false ? 'btn-primary' : 'button--default'"
        type="primary"
        :disabled="disabledVal"
        >{{ $t(btnText) }}</mt-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'vBtn',
  props: ['btnText', 'type', 'disabledVal'], // btnText:按钮文本,type:按钮类型(default, primary, danger),disabledVal:禁用
  data () {
    return {}
  },
  methods: {
    // onSubmit:按钮提交事件
    onSubmit () {
      this.$emit('btnSubmit', '')
    }
  }
}
</script>
<style lang="scss">
.btn {
  .btn-box {
    border-radius: 20px;
    overflow: hidden;
    margin: 0 18px;
    .button-container {
      width: 100%;
    }
    .btn-primary {
      background-color: $btn-color !important;
      border-color: $btn-color !important;
      &:active {
        @include btn-activeColor;
      }
    }
    .button--default {
      color: #fff !important;
      background-color: #999999 !important;
    }
  }
}
</style>
