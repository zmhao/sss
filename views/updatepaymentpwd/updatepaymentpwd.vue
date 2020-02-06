<template>
  <div class="payment" ref="payment" @click="getTarget">
    <div class="payment-header">
      <v-header title="修改支付密码"></v-header>
    </div>
    <div class="payment-content">
      <p class="payment-content-title">{{$t('为了安全，我们会向您的原手机号')}}</p>
      <p class="payment-content-phone">{{ "+855 " + account }}</p>
      <p class="payment-content-title">{{$t('发送短信验证码')}}</p>
      <div class="payment-content-li">
        <!-- <v-input
          @phoneFun="phoneFun"
          :eTarget.sync="eTarget"
          :codeLength="6"
          :codeDisabled="true"
          @getCode="getCodeFun"
          :clickStatus="isDisabled"
        ></v-input> -->
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
          <div class="validation-btn" @click="getVerifyCode">
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
          $t("下一步")
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
import { apiGetCode } from "@api/api"; // 导入我们的api接口
import md5 from "md5";
import sha1 from "sha1";
import storages from "@views/cache/cache";
import global, { PASSWORDSIGN } from "@views/common/global";
import vHeader from "@/components/header/header";
import vBtn from "@/components/button/button";
import vKeyboard from "@/components/keyboard/keyboard";
import { randomStr } from "@js/util";
export default {
  data() {
    return {
      btnTitle: "获取验证码",
      verifyCode: "",
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
    that.$refs.payment.addEventListener("click", function(e) {
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
    codeVal(d) {
      this.verifyCode = d;
    },
    nextBtn() {
      let that = this
      let uuuid = "1111";
      var pwd = that.phoneCode;
      let noStr = randomStr(16, false);
      storages.set(global.VALIDCODE, pwd);
      if (this.phoneCode === "") {
        this.$toast("请输入验证码");
        return;
      }
      if (this.phoneCode.length !== 6) {
        this.$toast("请输入正确的验证码");
        return;
      }
      this.$router.replace({path: "InputPaymentPwd",query:{random: noStr}});
    },
    getVerifyCode() {
      let that = this;
      that.$loading();
      if (this.lang === "") {
        this.lang = "zh_CN"; //en_US  km_KH
      }
      apiGetCode({
        phone: this.account,
        lang: this.lang,
        function: "paypwd"
      }).then(res => {
        if (res.status == "200") {
          that.isDisabled = true;
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
          that.$loading.close();
        }
      });
    },
    updataLoginPhone() {
      this.$router.push("/settinghead");
    },
    goBack() {
      this.$router.go(-1);
    },
    // 输入验证码
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
    // 获取点击时的目标元素
    getTarget(event) {
      this.eTarget = event.target;
    },
    // getCodeFun:获取验证码
    getCodeFun() {
      let that = this;
      that.getVerifyCode();
    },
    // inputPsw: 输入手机号码
    inputPsw() {
      this.inpShow = true;
    }
  },
  components: {
    vHeader,
    vBtn,
    vKeyboard
  }
};
</script>
<style lang="scss" scoped>
// .top {
//   padding-top: 5px;
//   padding-left: 10px;
// }
// .title {
//   width: 100%;
//   margin-top: 20px;
//   font-size: 18px;
//   margin-left: 10px;
//   color: #dcdcdc;
//   display: inline-block;
// }
// .text_hit {
//   width: 100%;
//   display: inline-block;
// }
// .btn {
//   width: 80%;
//   margin-top: 20px;
//   float: center;
// }
.payment {
  width: 100%;
  height: 100%;
  &-content {
    &-li {
      margin-top: 40px;
      margin-left: 20px;
      margin-right: 20px;
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
}
.btn-box {
  margin-top: 50px;
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
    background: rgba(0, 0, 0, 0)
  }
  .simulation-inp {
    position: absolute;
    top: 3px;
    margin: 0;
    font-size: 20px;
    z-index: -99;
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
