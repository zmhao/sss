<template>
  <div class="setting">
    <div class="setting-header">
      <v-header title="设置"></v-header>
    </div>
    <div class="setting-content">
      <v-menu @onSubmit="userInfo()" title="个人资料"></v-menu>
      <v-menu @onSubmit="accountInfo()" title="账号与安全"></v-menu>
    </div>
    <div class="setting-bottom">
      <v-btn
        btnText="退出"
        @btnSubmit="exitApp()"
        type="primary"
        :disabledVal="false"
      ></v-btn>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vMenu from "@/components/menu/menu";
import vBtn from "@/components/button/button";
export default {
  methods: {
    userInfo() {
      this.$router.push("/persondata");
    },
    accountInfo() {
      this.$router.push("/accountsafe");
    },
    exitApp() {
      this.$router.replace("/login");
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  components: {
    vHeader,
    vMenu,
    vBtn
  }
};
</script>
<style lang="scss" scoped>
.setting {
  &-bottom {
    width: 100%;
    height: 100px;
    position: absolute;
    background-color: #fff;
    border: #ffff;
    bottom: 0;
  }
  &-content {
    width: 100%;
    margin-top: 40px;
    &-data {
      float: left;
      &-img {
        float: right;
        width: 15px;
        height: 15px;
        margin-top: 10px;
      }
    }
  }
}
</style>
