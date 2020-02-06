<template>
  <div style="overflow: hidden;">
    <div class="login-box">
      <div class="login-lang">
        <div class="lang-btn" @click="selectLang">{{ $t("语言") }}</div>
      </div>
      <div class="div-center">
        <span class="login-title">{{ $t("欢迎使用ModernPay") }}</span>
        <span class="login-title-small">{{ $t("Free your payments") }}</span>
        <div class="inout">
          <v-mobilePhone @changeVal="userVal"></v-mobilePhone>

          <v-psw
            @changeVal="pasVal"
            imgSwitch="1"
            type="password"
            placeholderVal="请输入密码"
          ></v-psw>
          <div class="btn-box">
            <mt-button
              v-on:click="onSubmit()"
              class="button-container"
              type="primary"
              >{{ $t("登录") }}</mt-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="forget-psw">
      <label class="bottom-lift" @click="notPwd">{{ $t("忘记密码?") }}</label>
      <div class="username">
        <span>{{ $t("如果你还没有账号,") }}</span>
        <label class="bottom-right" @click="resgAccount">{{
          $t("注册")
        }}</label>
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
import storages from "@views/cache/cache";
import global, { PASSWORDSIGN } from "@views/common/global";
import { apiLogin } from "@api/api"; // 导入我们的api接口
import md5 from "md5";
import sha1 from "sha1";
import { randomStr } from "@js/util";
import look from "@/assets/img/look_login.png";
import vMobilePhone from "@/components/login/mobilePhone";
import vPsw from "@/components/login/psw";
// import jPish from "@js/jpush";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        private_keys: "",
        public_keys: "",
        list: [],
        lang: storages.get(global.LANG) === "" || "zh_CN",
        look
      }
    };
  },
  mounted() {
    storages.del(global.USERINFO);
    storages.del(global.TOKEN);
    storages.del(global.HEADPIC);
    this.lang = storages.get(global.LANG);
    // setTimeout(() => {
    //   jPish.setAlias(1, "888888").then(d => {
    //     console.log(d);
    //   });
    // }, 30000);
  },
  methods: {
    selectLang() {
      this.$router.push("/selectlang");
    },
    onSubmit() {
      if (this.form.username === "" || this.form.password === "") {
        this.$toast("请输入账号密码");
        return;
      }
      let self = this;
      // let uuuid = device.uuid;
      let uuuid = "1111";
      var uname = self.form.username;
      var pwd = self.form.password;
      let noStr = randomStr(16, false);
      if (this.lang.length == 0) {
        this.lang = "zh_CN"; // en  km
      }
      this.$loading();
      apiLogin({
        account_type: 0,
        account: uname,
        password: md5(
          md5(
            sha1(pwd).toLocaleLowerCase() + PASSWORDSIGN
          ).toLocaleLowerCase() + noStr
        ).toLocaleLowerCase(),
        imei: uuuid,
        nonstr: noStr,
        lang: this.lang
      }).then(res => {
        this.$loading.close();
        if (res.status == 200) {
          storages.set(global.USERINFO, res.data.userinfo);
          storages.set(global.TOKEN, res.data.userinfo.token);
          self.$router.push("/");
        }else{
          this.$toast(res.msg)
        }
      });
    },
    notPwd() {
      this.$router.push("/notpwd");
    },
    resgAccount() {
      this.$router.push("/register");
    },
    random: function(length) {
      var str = Math.random()
        .toString(36)
        .substr(2);
      if (str.length >= length) {
        return str.substr(0, length);
      }
      str += random(length - str.length);
      return str;
    },
    // 监听子组件回传手机号
    userVal(d) {
      this.form.username = d;
    },
    // 监听子组件回传密码
    pasVal(d) {
      this.form.password = d;
    }
  },
  components: {
    vMobilePhone,
    vPsw
  }
};
</script>

<style lang="scss">
.login-box {
  text-decoration: none;
  padding: 0 18px;
}
.login-title {
  text-align: left;
  color: #24345a;
  display: block;
  margin-bottom: 6px;
  font-size: 24px;
}
.login-title-small {
  text-align: left;
  color: #24345a;
  font-size: 13px;
  display: block;
}
.login-lang {
  text-align: right;
  color: #187cec;
  font-size: 19px;
  margin: 23px 0;
  display: flex;
  justify-content: flex-end;
  // padding-right: 18px/360 * 100vw;
  // margin-top: 67px/360 * 100vw;
}

.div-center {
  // margin-left: 18px/360 * 100vw;
}
.inout {
  margin-top: 44px;
}

.inout {
  // margin-top: 230px/360 * 100vw;
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
}

.forget-psw {
  font-size: 14px;
  margin-top: 213px;
  text-align: center;
  .bottom-lift {
    color: $btn-color;
    &:active {
      color: $font-activeColor;
    }
  }
  .username {
    color: #a1a1a1;
    margin-top: 30px;
    .bottom-right {
      color: $btn-color;
      &:active {
        color: $font-activeColor;
      }
    }
  }
}
.inout-img {
  display: inline-block;
  border: 1px dashed #eae9e9;
  margin: 0 5px;
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
.lang-btn {
  width: 50px;
  height: 30px;
  text-align: center;
}
</style>
