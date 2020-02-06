<template>
  <div ref="inputBox">
    <div
      class="exchange-content-inp"
      :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'">
      <p class="placeholder" @click="inputPsw" ref="input">
        {{ $t(inpPlaceholder) }}
      </p>
      <p class="simulation-inp" :class="inpShow == false ? '' : 'borderLfet'">
        {{ phoneCode }}
      </p>
      <div class="validation-btn" v-if="codeLength == 6" @click="onClick()">
        <mt-button
          type="primary"
          :class="isDisabled == true ? 'is-disabled' : 'validation-btn-box'"
          :disabled="isDisabled"
          >{{ verifyCodeMsg }}</mt-button
        >
      </div>
    </div>
    <!-- 输入键盘 -->
    <div ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @close="isPay = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
      >
      </v-keyboard>
    </div>
  </div>
</template>
<script>
import vKeyboard from "@/components/keyboard/keyboard";
export default {
  props: ["eTarget", "codeLength", "codeDisabled",], //eTarget：目标元素，codelength：输入字符的长度,codeDisabled:是否禁用获取验证码按钮
  data() {
    return {
      inpShow: false,
      isDisabled: true,
      verifyCodeMsg: "获取验证码",
      phoneCode: "", //手机号码
      isPay: false,
      inpPlaceholder: this.codeLength == 11 ? "请输入手机号码" : "请输入验证码",
      isTime: true
    };
  },
  mounted() {
    if (this.codeDisabled == false) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  },
  watch: {
    eTarget(newV, oldV) {
      let that = this;
      that.inputHide(newV);
    },
    codeDisabled() {
      if (this.codeDisabled == false) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
  },
  methods: {
    inputPsw() {
      if (this.codeLength == 6) {
        // console.log(55);
      }
    },
    // 获取验证码
    onClick() {
      let that = this;
      that.$emit("getCode", "");
    },
    // timeFun: 倒计时
    timeFun() {
      let that =this
      if (!that.isDisabled) {
        that.isDisabled = true;
        let time = 5;
        let timer = setInterval(() => {
          that.verifyCodeMsg = time + "s";
          time--;
          if (time == 0) {
            clearInterval(timer);
            that.verifyCodeMsg = "获取验证码";
            that.isDisabled = false;
            that.$emit
          }
        }, 1000);
      }
    },
    inputHide(ele) {
      let that = this;
      let inp = that.$refs.input;
      let keyboard = that.$refs.keyboard;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow = true;
        that.isPay = true;
        if (!that.phoneCode) {
          if (that.codeLength == 6) {
            that.inpPlaceholder = "请输入验证码";
          } else {
            that.inpPlaceholder = "请输入手机号码";
          }
        }
      } else {
        that.inpShow = false;
        that.isPay = false;
        if (!that.phoneCode) {
          if (that.codeLength == 6) {
            that.inpPlaceholder = "请输入验证码";
          } else {
            that.inpPlaceholder = "请输入手机号码";
          }
        }
      }
    },
    moneyFun(d) {
      let that = this;
      if (that.codeLength == 11) {
        if (that.phoneCode.length !== 11) {
          that.phoneCode += d.val;
        }
      } else {
        if (that.phoneCode.length !== 6) {
          that.phoneCode += d.val;
        }
      }
      that.$emit("phoneFun", that.phoneCode);
      that.inpPlaceholder = "";
    },
    deleteFun() {
      let that = this;
      if (that.phoneCode) {
        that.phoneCode = that.phoneCode.substring(0, that.phoneCode.length - 1);
      }
      if (!that.phoneCode) {
        that.disableVal = true;
        if (that.codeLength == 11) {
          that.inpPlaceholder = "请输入手机号码";
        } else {
          that.inpPlaceholder = "请输入验证码";
        }
      }
      that.$emit("phoneFun", that.phoneCode);
    }
  },
  components: {
    vKeyboard
  }
};
</script>
<style lang="scss" scoped>
.exchange-content-inp {
  position: relative;
  text-align: left;
  .validation-btn {
    height: 28px;
    min-width: 95px;
    border-radius: 14px;
    overflow: hidden;
    position: absolute;
    right: 18px;
    top: 0;
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
  input {
    width: 100%;
    outline: none;
    font-size: 16px;
  }

  .placeholder {
    height: 30px;
    margin: 0;
    font-size: 16px;
    color: #bbbbbb;
    display: flex;
    align-items: center;
    background: rgba(0,0,0,0)
  }
  .simulation-inp {
    position: absolute;
    top: 3px;
    margin: 0;
    font-size: 20px;
    min-width: 1px;
    min-height: 23px;
    color: $btn-color;
  }
  .borderLfet {
    &::after {
      content: "";
      display: block;
      height: 100%;
      // border-left: 1px solid $btn-color;
      position: absolute;
      top: 0;
      right: -2px;
      width: 2px;
      animation: dong 0.5s infinite 0s ease-in-out alternate;
    }
  }
}
.bottomBorderC {
  &::after {
    content: "";
    display: block;
    position: absolute;
    border-bottom: 1px solid $font-color;
    opacity: 0.1;
    margin-top: 5px;
    width: 100%;
    @include menu-borderBottom;
  }
}
.bottomBorderB {
  &::after {
    content: "";
    display: block;
    position: absolute;
    border-bottom: 2px solid $btn-color;
    margin-top: 5px;
    width: 100%;
    @include menu-borderBottom;
  }
}
.borderLfet {
  &::after {
    content: "";
    display: block;
    height: 100%;
    // border-left: 1px solid $btn-color;
    position: absolute;
    top: 0;
    right: -2px;
    width: 2px;
    animation: dong 0.5s infinite 0s ease-in-out alternate;
  }
}
@keyframes dong {
  0% {
    background-color: #fff;
  }
  100% {
    background-color: $btn-color;
    border-radius: 1px;
  }
}
</style>
