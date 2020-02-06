<template>
  <div class="phone" ref="phone" @click.prevent="theClick">
    <div class="phone-header">
      <v-header title="更换手机号"></v-header>
    </div>
    <div class="phone-content">
      <p class="phone-content-title">
        {{ $t("输入您要绑定的新手机号并进行验证") }}
      </p>
      <!-- <p class="phone-content-title">{{ $t("并进行验证！") }}</p> -->
      <div class="phone-content-div">
        <div>
          <v-input
            @phoneFun="phoneFun"
            :eTarget.sync="eTarget"
            :codeLength="11"
            
          ></v-input>
        </div>
        <div style="margin-top:20px;">
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
            <div class="validation-btn" @click="onClick">
              <mt-button
                type="primary"
                :class="a == true ? 'is-disabled' : 'validation-btn-box'"
                :disabled="a"
                >{{ verifyCodeMsg }}</mt-button
              >
            </div>
          </div>
        </div>
        <div class="btn-box is-de">
          <mt-button
            @click="btnCommit"
            class="button-container"
            type="primary"
            :disabled="isDisabled"
            >{{ $t("立即修改") }}</mt-button
          >
        </div>
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
import vBtn from "@/components/button/button";
import vInput from "@/components/input/input";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import { apiGetCode, apiModifyPhone } from "@api/api"; // 导入我们的api接口
import vKeyboard from "@/components/keyboard/keyboard";
import publicapi from "../../assets/js/publicapi";
export default {
  data() {
    return {
      phoneNumber: "",
      lang: storages.get(global.LANG) === "" || "zh_CN",
      eTarget: "1",
      isDisabled: true,
      a: true, //禁用验证码按钮
      inpPlaceholder: "请输入手机验证码", //input提示语
      phoneCode: "", //验证码
      inpShow: false, //光标
      isPay: false, //控制键盘
      // isDisabled: false, // 禁用按钮
      verifyCodeMsg: "获取验证码" //验证码倒计时
    };
  },
  mounted() {
    let that = this;
    // 监听input光标
    that.$refs.phone.addEventListener("click", function(e) {
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
    getVerifyCode() {
      let that = this;
      if (this.lang === "") {
        this.lang = "zh_CN"; //en_US  km_KH
      }
      if (this.phoneNumber === "") {
        this.$toast("请输入手机号");
        return;
      }
      apiGetCode({
        phone: this.phoneNumber,
        lang: this.lang,
        function: "modifyphone"
      }).then(res => {
        // self.$router.push("/main");
        if (res.status == 200) {
          that.a = true;
          let time = 90;
          let timer = setInterval(() => {
            that.verifyCodeMsg = time + "s";
            that.disabled = true;
            time--;
            if (time == 0) {
              clearInterval(timer);
              that.verifyCodeMsg = "获取验证码";
              that.a = false;
            }
          }, 1000);
        }
      });
    },
    btnCommit() {
      if (this.phoneNumber === "") {
        this.$toast("请输入手机号");
        return;
      }
      if (this.phoneCode === "") {
        this.$toast("请输入验证码");
        return;
      }
      this.$loading();
      apiModifyPhone({
        sms: this.phoneCode,
        phone: this.phoneNumber
      }).then(res => {
        this.$loading.close();
        console.log(res);
        storages.del(global.USERINFO);
        storages.del(global.TOKEN);
        storages.set(global.TOKEN, res.token);
        storages.set(global.USERINFO,res.data.uid.userinfo)
        publicapi.updateUserInfo();
        this.$toast("修改成功");
        this.$router.back();
      });
      this.$loading.close()
    },
    goBack() {
      this.$router.back();
    },
    codeVal(d) {
      this.phoneCode = d;
    },
    // theClick: 传值到子组件
    theClick(event) {
      this.eTarget = event.target;
    },
    // phoneFun: 电话号码
    phoneFun(d) {
      this.phoneNumber = d;
      if (this.phoneNumber && this.phoneCode) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      if (this.phoneNumber.length == 11) {
        this.a = false;
      } else {
        this.a = true;
      }
    },
    // inputPsw: 输入验证码
    inputPsw() {
      this.inpShow = true;
    },
    // 键盘输入验证码
    moneyFun(d) {
      let that = this;
      if (that.phoneCode.length == 6) {
      } else {
        that.phoneCode += d.val;
      }
      if (this.phoneNumber && this.phoneCode) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      that.inpPlaceholder = "";
    },
    // 删除验证码
    deleteFun() {
      let that = this;
      if (that.phoneCode) {
        that.phoneCode = that.phoneCode.substring(0, that.phoneCode.length - 1);
      }
      if (!that.phoneCode) {
        that.disableVal = true;
      }
    },
    // onClick：获取验证码
    onClick() {
      let that = this;
      that.getVerifyCode();
    }
  },
  components: {
    vHeader,
    vBtn,
    vKeyboard,
    vInput
  }
};
</script>
<style lang="scss" scoped>
.phone {
  width: 100%;
  height: 100%;
  &-content {
    margin-top: 80px;
    &-title {
      align-items: center;
      text-align: center;
      font-size: 16px;
      color: rgba(36, 52, 90, 1);
    }
    &-div {
      padding: 0 18px;
      margin-top: 40px;
      &-input {
        width: 100%;
        height: 40px;
        display: flex;
        border: 0 solid #abb1be;
        border-bottom: 1px solid rgb(247, 244, 244);
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
      }
      &-li {
        margin-top: 20px;
      }
    }
  }
}
.btn-box {
  margin-top: 32px;
  border-radius: 20px;
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
.is-de {
  .is-disabled {
    background-color: #999999 !important;
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
</style>
