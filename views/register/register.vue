<template>
  <div>
    <!-- 注册页面 -->
    <v-header></v-header>
    <div class="psw-content">
      <p class="label-style">{{$t('请填写以下注册信息')}}</p>
      <div class="div-center">
        <div class="div-center-li">
          <v-mobilePhone @changeVal="mobilePhone"></v-mobilePhone>
        </div>
        <div class="div-center-li">
          <v-psw
            @changeVal="userVal"
            :verifyCodeMsg="btnTitle"
            @onClick="getVerifyCode()"
            imgSwitch="2"
            validationFlag="true"
            type="text"
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
            @changeVal="userNewPwd"
            imgSwitch="1"
            type="password"
            placeholderVal="请输入确认密码"
          ></v-psw>
        </div>
      </div>
      <div class="btn-box">
        <mt-button
          class="button-container"
          @click.prevent="registerFun"
          type="primary"
          >{{ $t("注册") }}</mt-button
        >
      </div>
      <div class="agreement">
        <img
          :src="imgFlag == false ? choose : chooseImg"
          alt=""
          @click.prevent="imgFlag = !imgFlag"
        />
        <span class="agreement-text">{{ $t("已阅读并同意") }}</span>
        <span class="agreement-register">{{ $t("《用户注册服务协议》") }}</span>
        <span class="agreement-register">{{ $t("《隐私政策》") }}</span>
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
import { apiGetCode, apiRegistLogin } from "@api/api"; // 导入我们的api接口
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
      lang: "",
      chooseImg: require("../../assets/img/choose@2x.png"), // 选中时的图片
      choose: require("../../assets/img/chooseNull@2x.png"), // 未选中时的图片
      imgFlag: false // 控制选择图片的状态
    };
  },
  mounted() {
    console.log(11);
    this.lang = storages.get(global_msg.LANG);
  },
  methods: {
    onClick() {
      console.log("111");
    },
    getVerifyCode() {
      if (this.phoneNumber === "") {
        this.$toast("请输入电话号");
        return;
      }
      if (this.lang === "") {
        this.lang = "zh_CN"; // en  km
      }
      apiGetCode({
        phone: this.phoneNumber,
        lang: this.lang,
        function: "reg"
      }).then(res => {
        console.log(res);
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
    onSubmit() {},
    userPwd(p) {
      this.accountPwd = p;
    },
    userNewPwd(p) {
      this.accountOldPwd = p;
    },
    mobilePhone(p) {
      this.phoneNumber = p;
    },
    userVal(d) {
      this.verifyCode = d;
    },
    // registerFun:注册按钮事件
    registerFun() {
      let that = this;
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
      if (!this.imgFlag) {
        this.$toast("请勾选用户协议");
        return;
      }
      if (this.lang === "") {
        this.lang = "zh_CN"; // en  km
      }
      this.$loading();
      apiRegistLogin({
        phone: this.phoneNumber,
        password: sha1(this.accountOldPwd).toLocaleLowerCase(),
        sms: this.verifyCode,
        lang: this.lang
      }).then(res => {
        this.$loading.close();
        console.log(res);
        storages.set(global_msg.USERINFO, res.data.userinfo);
        storages.set(global_msg.TOKEN, res.data.userinfo.token);
        that.$router.push({ path: "/RegisterComplate" });
        // this.$router.go(-1)
      });
    }
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
  .agreement {
    margin-top: 15px;
    display: flex;
    font-size: 13px;
    align-items: center;
    justify-content: center;
    img {
      width: 16px;
      height: 16px;
    }
    .agreement-text {
      color: rgba(161, 161, 161, 1);
      margin-left: 4px;
    }
    .agreement-register {
      color: $btn-color;
      &:active {
        color: $font-activeColor;
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
