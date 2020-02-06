<template>
  <div class="refresh" ref="refresh">
    <div class="refresh-header">
      <v-header title="更换手机号"></v-header>
    </div>
    <div class="refresh-content">
      <p class="refresh-content-title">{{$t('为了安全，我们会向您的原手机号')}}</p>
      <p class="refresh-content-phone">{{ "+855 " + account }}</p>
      <p class="refresh-content-title">{{$t('发送短信验证码')}}</p>
      <div class="refresh-content-li">
        <div
          class="exchange-content-inp"
          :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'"
        >
          <p class="placeholder" @click="inputPsw" ref="input">
            {{ $t(inpPlaceholder) }}
          </p>
          <p
            class="simulation-inp"
            :class="inpShow == false ? '' : 'borderLfet'"
          >
            {{ phoneCode }}
          </p>
          <div class="validation-btn" @click="onClick()">
            <mt-button
              type="primary"
              :class="isDisabled == true ? 'is-disabled' : 'validation-btn-box'"
              :disabled="isDisabled"
              >{{ verifyCodeMsg }}</mt-button
            >
          </div>
        </div>
      </div>
      <div class="btn-box">
        <mt-button @click="nextBtn" class="button-container" type="primary">{{
          $t("确定")
        }}</mt-button>
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
import vHeader from "@/components/header/header";
import vMenu from "@/components/menu/menu";
import vBtn from "@/components/button/button";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import vKeyboard from "@/components/keyboard/keyboard";

import { apiGetCode, apiCheckPhone } from "@api/api"; // 导入我们的api接口
export default {
  data() {
    return {
      account: storages.get(global.USERINFO).phone,
      lang: storages.get(global.LANG) === "" || "zh_CN",
      inpPlaceholder: "请输入手机验证码", //input提示语
      phoneCode: "", //验证码
      inpShow: false, //光标
      isPay: false, //控制键盘
      isDisabled: false, // 禁用按钮
      verifyCodeMsg: "获取验证码" //验证码倒计时
    };
  },
  mounted() {
    let that = this;
    // 监听input光标
    that.$refs.refresh.addEventListener("click", function(e) {
      let ele = e.target;
      let inp = that.$refs.input;
      let keyboard = that.$refs.keyboard;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow = true;
        that.isPay = true;
        if (!that.phoneCode) {
          that.inpPlaceholder = "请输入手机验证码";
        }
      } else {
        that.inpShow = false;
        that.isPay = false;
        if (!that.phoneCode) {
          that.inpPlaceholder = "请输入手机验证码";
        }
      }
    });
  },
  methods: {
    nextBtn() {
      if (this.phoneCode === "") {
        this.$toast("请输入验证码");
        return;
      }
      if (this.phoneCode.length !== 6) {
        this.$toast("验证码输入错误");
        return;
      }
      this.$loading();
      apiCheckPhone({
        function: "checkphone",
        sms: this.phoneCode,
        phone: this.account
      }).then(res => {
        this.$loading.close();
        this.$router.replace("/newphone");
      });
    },
    getVerifyCode() {
      let that = this;
      this.$loading();
      if (this.lang === "") {
        this.lang = "zh_CN"; // en_US  km_KH
      }
      apiGetCode({
        phone: this.account,
        lang: this.lang,
        function: "checkphone"
      }).then(res => {
        if (res.status == 200) {
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
        // self.$router.push("/main");
        that.$loading.close();
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    codeVal(d) {
      this.verifyCode = d;
    },
    // inputPsw: 输入手机号码
    inputPsw() {
      this.inpShow = true;
    },
    // 键盘输入手机号码
    moneyFun(d) {
      let that = this;
      if (that.phoneCode.length == 6) {
      } else {
        that.phoneCode += d.val;
      }
      that.inpPlaceholder = "";
    },
    // 删除手机号
    deleteFun() {
      let that = this;
      if (that.phoneCode) {
        that.phoneCode = that.phoneCode.substring(0, that.phoneCode.length - 1);
      }
      if (!that.phoneCode) {
        that.disableVal = true;
      }
    },
    // onClick: 短信倒计时
    onClick() {
      let that = this;
      that.getVerifyCode();
    }
  },
  components: {
    vHeader,
    vMenu,
    vBtn,
    vKeyboard
  }
};
</script>
<style lang="scss" scoped>
.refresh {
  width: 100%;
  height: 100%;
  &-content {
    &-li {
      padding: 0 18px;
      margin-top: 40px;
    }
    margin-top: 30%;
    &-title {
      align-items: center;
      text-align: center;
      font-size: 16px;
      color: rgba(36, 52, 90, 1);
    }
    &-phone {
      align-items: center;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      color: rgba(68, 68, 68, 1);
    }
  }
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
}
.btn-box {
  margin-top: 32px;
  border-radius: 20px;
  margin-left: 20px;
  margin-right: 20px;
  overflow: hidden;
  .button-container {
    width: 100%;
    background-color: $btn-color !important;
    border-color: $btn-color !important;
    &:active {
      @include btn-activeColor;
    }
  }
}
.exchange-content-inp {
  position: relative;
  text-align: left;
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
    background: rgba(0, 0, 0, 0);
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
    border-bottom: 1px solid $font-color;
    opacity: 0.1;
    margin-top: 5px;
    position: absolute;
    width: 100%;
    @include menu-borderBottom;
  }
}
.bottomBorderB {
  &::after {
    content: "";
    display: block;
    border-bottom: 2px solid $btn-color;
    margin-top: 5px;
    position: absolute;
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
