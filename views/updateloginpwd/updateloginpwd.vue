<template>
  <div class="logpwd">
    <div class="logpwd-header">
      <v-header title="修改登陆密码"></v-header>
    </div>
    <div class="logpwd-content">
      <div class="logpwd-content-div">
        <input
          type="password"
          maxlength="16"
          minlength="6"
          class="logpwd-content-div-input"
          @focus="getInp1"
          @blur="loseInp"
          :placeholder="$t('请输入原密码')"
          v-model="oldpwd"
          :class="inpBorder == 1 ? 'border-change':'border-deful'"
        />
        <input
          type="password"
          maxlength="16"
          minlength="6"
          @focus="getInp2"
          @blur="loseInp"
          class="logpwd-content-div-input"
          :placeholder="$t('请输入新密码')"
          v-model="password"
          :class="inpBorder == 2 ? 'border-change':'border-deful'"
        />
        <input
          type="password"
          maxlength="16"
          minlength="6"
          @focus="getInp3"
          @blur="loseInp"
          class="logpwd-content-div-input"
          :placeholder="$t('请再次输入新密码')"
          v-model="newpwd"
          :class="inpBorder == 3 ? 'border-change':'border-deful'"
        />
      </div>
      <div class="btn-box">
        <mt-button @click="nextBtn" class="button-container" type="primary">{{
          $t("立即修改")
        }}</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vBtn from "@/components/button/button";
import sha1 from "sha1";
import { apiUpdatePwd } from "@api/api";
export default {
  data() {
    return {
      oldpwd: "",
      password: "",
      newpwd: "",
      inpBorder: 0
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    nextBtn() {
      if (this.oldpwd === "") {
        this.$toast("请输入原密码");
        return;
      }
      if (this.oldpwd.length < 6) {
        this.$toast("原密码错误");
        return;
      }
      if (this.password === "") {
        this.$toast("请输入新密码");
        return;
      }
      if (this.oldpwd.length < 6) {
        this.$toast("新密码格式错误");
        return;
      }
      if (this.newpwd === "") {
        this.$newpwd("请再次确认新密码");
        return;
      }
      if (this.password !== this.newpwd) {
        this.$toast("两次输入新密码不一致");
        return;
      }
      let old_password = sha1(this.oldpwd).toLocaleLowerCase();
      let new_password = sha1(this.newpwd).toLocaleLowerCase();
      this.$loading();
      apiUpdatePwd({
        old_password: old_password,
        new_password: new_password
      }).then(res => {
        this.$loading.close();
        this.$router.back();
      });
    },
    getInp1(){
      this.inpBorder = 1
    },
    getInp2(){
      this.inpBorder = 2
    },
    getInp3(){
      this.inpBorder = 3
    },
    loseInp(){
      this.inpBorder = 0
    },
  },
  components: {
    vHeader,
    vBtn
  }
};
</script>
<style lang="scss" scoped>
.logpwd {
  width: 100%;
  height: 100%;
  &-content {
    margin-top: 30%;
    width: 100%;
    &-div {
      margin-left: 30px;
      margin-right: 30px;
      &-input {
        margin-top: 10px;
        width: 100%;
        height: 40px;
        display: flex;
        background-color: rgba(0, 0, 0, 0); // 透明背景
        border: 0 solid #abb1be;
        // border-bottom: 1px solid rgb(247, 244, 244);
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        outline: none; // 去除选中状态边框
        color: $btn-color;
      }
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
.border-deful{
  border-bottom: 1px solid rgb(247, 244, 244);
}
.border-change{
  border-bottom: 1px solid #187CEC;
}
</style>
