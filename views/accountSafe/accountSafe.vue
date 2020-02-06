<template>
  <div class="safe">
    <div class="safe-header">
      <v-header title="账号与安全"></v-header>
    </div>
    <div class="safe-content">
      <v-menu
        @onSubmit="updataLoginPhone()"
        :tag="account"
        title="更换手机号"
      ></v-menu>
      <v-menu @onSubmit="updataLoginPwd()" title="修改登陆密码"></v-menu>
      <v-menu @onSubmit="updataPayPwd()" title="修改支付密码"></v-menu>
    </div>
  </div>
</template>
<script>
import storages from "@views/cache/cache";
import vHeader from "@/components/header/header";
import vMenu from "@/components/menu/menu";
import global from "@views/common/global";
export default {
  data() {
    return {
      account: ""
    };
  },
  created() {
    this.account = storages.get(global.USERINFO).phone;
  },
  methods: {
    updataLoginPhone() {
      this.$router.push("/refreshphone");
    },
    updataLoginPwd() {
      this.$router.push("/updateloginpwd");
    },
    updataPayPwd() {
      this.$router.push("/updatepaymentpwd");
    },
    goBack() {
      this.$router.back();
    }
  },
  components: {
    vHeader,
    vMenu
  }
};
</script>
<style lang="scss" scoped>
// .head {
//     width: 100%;
//     display: inline-block;
//     margin-top 20px
// }
// .text{
//     float left
// }
// .text-phone{
//     float left
// }
// .img{
//     float:right;
//     width 15px;
//     height 15px;
// }
// .phone{
//     float:right;
// }
.safe {
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
