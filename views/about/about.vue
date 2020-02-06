<template>
  <div class="about">
    <div class="about-header">
      <v-header title="关于我们"></v-header>
    </div>
    <div class="about-content">
      <div class="about-content-logo">
        <div class="about-content-logo-img">
          <img src="../../assets/img/aboutLogo@2x.png" />
        </div>
      </div>
      <p class="about-content-name">Modern Pay</p>
      <p class="about-content-version">V1.0.0</p>
      <v-menu @onSubmit="userInfo()" :tag="versoinMsg" title="检查更新"></v-menu>
      <v-menu @onSubmit="accountInfo()" title="服务协议"></v-menu>
      <v-menu @onSubmit="userInfo()" title="隐私保护指引"></v-menu>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vMenu from "@/components/menu/menu";
export default {
  data() {
    return {
      versoinMsg: ""
    };
  },
  created() {
    this.versoinMsg = "已是最新版本";
  },
  components: {
    vHeader,
    vMenu
  }
};
</script>
<style lang="scss" scoped>
.about {
  width: 100%;
  height: 100%;
  &-content {
    &-name {
      width: 100%;
      margin-top: 20px;
      font-size: 20px;
      text-align: center;
      color: $font-color;
    }
    &-version {
      width: 100%;
      text-align: center;
      font-size: 14px;
      margin-top: 10px;
      color: $font-color;
      margin-bottom: 44px;
    }
    &-logo {
      margin-top: 40px;
      display: inline-block;
      align-items: center;
      justify-content: center;
      justify-items: center;
      &-img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
