<template>
  <div>
    <!-- 密码输入框 -->
    <div class="inout_div">
      <img
        slot="prepend"
        class="img-icon"
        :src="imgSwitch == 1 ? img1 : img2"
      />
      <input
        :type="type"
        :maxlength="imgSwitch == 1 ? 16 : 6"
        minlength="6"
        class="input__inner"
        :placeholder="$t(placeholderVal)"
        v-model="message"
        @input="message = message.replace(/[^\d]/g, '')"
      />
      <div class="validation-btn" v-if="validationFlag" @click="onClick()">
        <mt-button
          type="primary"
          :class="isDisabled == true ? 'is-disabled' : 'validation-btn-box'"
          :disabled="isDisabled"
          >{{ verifyCodeMsg }}</mt-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "v-psw",
  props: ["validationFlag", "imgSwitch", "type", "placeholderVal", "phone"], // isDisabled': 是否禁用倒计时按钮,validationFlag:控制验证码按钮显示的值,imgSwitch: 控制图片的切换,type:input框的类型,placeholderVal:input框提示语 verifyCodeMsg验证码按钮倒计时
  data() {
    return {
      message: "", // input的值
      img1: require("../../assets/img/pswicon@2x.png"), // 密码input框图标
      img2: require("../../assets/img/validation@2x.png"), // 验证码input框图标
      isDisabled: false, // 禁用按钮
      verifyCodeMsg: "获取验证码" //验证码倒计时
    };
  },
  methods: {
    onClick() {
      let that = this;
      that.$emit("onClick");
      if (that.phone.length == 11) {
        that.isDisabled = true;
        let time = 90;
        let timer = setInterval(() => {
          that.verifyCodeMsg = time + "s";
          that.disabled = true;
          time--;
          if (time == 0) {
            clearInterval(timer);
            that.verifyCodeMsg = "获取验证码";
            that.isDisabled = false;
          }
        }, 1000);
      }
    }
  },
  watch: {
    message() {
      this.$emit("changeVal", this.message);
    }
  }
};
</script>
<style lang="scss" scoped>
.inout_div {
  display: flex;
  position: relative;
  height: 38px;
  width: 100%;
  margin: 0 auto;
  // justify-content: center;
  align-items: center;
  // border-bottom: 1px solid #eae9e9;
  &::after {
    content: "";
    @include div-borderBottom;
  }
  .input__inner {
    color: $font-color;
    width: 60%;
    font-size: 16px;
    outline: none;
  }
  .area-text {
    color: $font-color;
    font-size: 18px;
    margin: 5px 10px 0 0;
  }
  .validation-btn {
    height: 28px;
    min-width: 95px;
    border-radius: 14px;
    overflow: hidden;
    margin-top: 5px;

    .validation-btn-box {
      background-color: $btn-color !important;
      border-color: $btn-color !important;
      &:active {
        @include btn-activeColor;
      }
    }
    .is-disabled {
      background-color: #999999 !important;
      font-size: 13px;
      height: 100%;
      width: 100%;
    }
    &-box {
      width: 100%;
      height: 100%;
      font-size: 13px;
    }
  }
  .img-icon {
    height: 20px;
    width: 20px;
    margin: 0 5px;
  }
}
</style>
