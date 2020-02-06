<template>
  <div>
    <v-header></v-header>
    <!-- 忘记密码界面 -->
    <div class="psw-content">
      <p class="label-style">{{$t('找回密码')}}</p>
      <div class="div-center">
        <div class="div-center-li">
          <v-mobilePhone @changeVal="userPhone"></v-mobilePhone>
        </div>
        <div class="div-center-li">
          <v-psw
            @changeVal="userverify"
            imgSwitch="2"
            validationFlag="true"
            :verifyCodeMsg="btnTitle"
            @onClick="getVerifyCode()"
            type="text"
            :phone="phoneNumber"
            placeholderVal="请输入验证码"
          ></v-psw>
        </div>
        <div class="div-center-li">
          <v-psw
            @changeVal="userPwd"
            imgSwitch="1"
            type="password"
            placeholderVal="请输入密码"
          ></v-psw>
        </div>
        <div class="div-center-li">
          <v-psw
            @changeVal="userOldPwd"
            imgSwitch="1"
            type="password"
            placeholderVal="请输入确认密码"
          ></v-psw>
        </div>
      </div>
      <div class="btn-box">
        <mt-button @click="onSubmit" class="button-container" type="primary">{{
          $t("确定")
        }}</mt-button>
      </div>
    </div>
    <div class="right-bottom">
      <div class="Img">
        <img src="../../assets/img/11.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import storages from "../cache/cache";
import sha1 from "sha1";
import global_msg from "../common/global";
import { apiGetCode, apiRegainPwd } from "@api/api"; // 导入我们的api接口
import vHeader from "@/components/header/header.vue";
import vMobilePhone from "@/components/login/mobilePhone.vue";
import vPsw from "@/components/login/psw.vue";
export default {
  data() {
    return {
      private_keys: "",
      public_keys: "",
      list: [],
      btnTitle: "获取验证码",
      phoneNumber: "",
      verifyCode: "",
      disabled: false,
      accountPwd: "",
      accountOldPwd: "",
      lang: storages.get(global_msg.LANG)
    };
  },
  methods: {
    getVerifyCode() {
      if (this.phoneNumber === "") {
        this.$toast("请输入电话号");
        return;
      }
      apiGetCode({
        phone: this.phoneNumber,
        lang: this.lang,
        function: "backpwd"
      }).then(res => {
        let time = 90;
        let timer = setInterval(() => {
          this.btnTitle = time + "s";
          this.disabled = true;
          time--;
          if (time === 0) {
            clearInterval(timer);
            this.btnTitle = "获取验证码";
            this.disabled = false;
          }
        }, 1000);
      });
    },
    onSubmit() {
      if (this.phoneNumber === "") {
        this.$toast("请输入电话号");
        return;
      }
      if (this.verifyCode === "") {
        this.$toast("请输入验证码");
        return;
      }
      if (this.accountPwd === "") {
        this.$toast("请输入密码");
        return;
      }
      if (this.accountPwd.length < 6) {
        this.$toast("密码长度不够");
        return;
      }
      if (this.accountOldPwd === "") {
        this.$toast("请确认密码");
        return;
      }
      if (this.accountPwd !== this.accountOldPwd) {
        this.$toast("两次输入的密码不一致");
        return;
      }
      this.$loading();
      apiRegainPwd({
        phone: this.phoneNumber,
        password: sha1(this.accountOldPwd).toLocaleLowerCase(),
        sms: this.verifyCode
      }).then(res => {
        this.$loading.close();
        this.$router.back();
      });
    },
    userOldPwd(v) {
      this.accountOldPwd = v;
    },
    userPwd(v) {
      this.accountPwd = v;
    },
    userPhone(v) {
      this.phoneNumber = v;
    },
    userverify(v) {
      this.verifyCode = v;
    },
    userVal(d) {}
  },
  components: {
    vHeader,
    vMobilePhone,
    vPsw
  }
};
</script>
<style lang="scss" scoped>
.psw-content {
  padding: 0 18px;
  .img-style {
    width: 30px;
    height: 30px;
    padding: 5px;
    float: left;
  }
  .label-style {
    font-size: 25px;
    text-align: left;
    color: $font-color;
    margin: 30px 0;
  }
  .div-center {
    .div-center-li {
      margin-bottom: 35px;
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
  .right-bottom {
    position: fixed;
    z-index: -99;
    /* padding: 0 0 0 34px; */
    width: 100%;
    bottom: 0;
    .Img {
      img {
        width: 250px;
        float: right;
      }
    }

    @media screen and (max-width: 414px) {
      .Img {
        img {
          width: 290px;
          float: right;
        }
      }
    }
  }
}
</style>
