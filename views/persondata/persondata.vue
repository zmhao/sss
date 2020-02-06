<template>
  <!-- 个人资料 -->
  <div class="person">
    <div class="person-header">
      <v-header title="个人资料"></v-header>
    </div>
    <div class="person-content">
      <v-menu
        @onSubmit="userInfo()"
        :isHead="true"
        :path="photoPath"
        title="头像"
      ></v-menu>
      <v-menu @onSubmit="modifyNike()" :tag="username" title="昵称"></v-menu>
      <v-menu :tag="phone" title="手机号" :isArrow="true"></v-menu>
    </div>
    <div class="person-popup">
      <mt-popup v-model="popupVisible">
        <div class="person-popup-content">
          <p class="person-popup-content-ninkname">{{ $t("修改昵称") }}</p>
          <div class="person-popup-content-div">
            <div class="inp-border">
              <input
                type="text"
                maxlength="8"
                minlength="2"
                class="person-popup-content-div-input"
                :placeholder="$t('请输入2-8位昵称')"
                v-model="nickname"
              />
            </div>
          </div>
          <div class="person-popup-content-bottom">
            <mt-button
              v-on:click="onCancel()"
              class="person-popup-content-bottom-cancel"
              >{{ $t("取消") }}</mt-button
            >
            <mt-button
              v-on:click="onSubmit()"
              class="person-popup-content-bottom-commit"
              >{{ $t("确定") }}</mt-button
            >
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vMenu from "@/components/menu/menu";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import publicapi from "../../assets/js/publicapi";
import { apiModifyAccountNike } from "@api/api"; // 导入我们的api接口
export default {
  data() {
    return {
      nickname: "",
      phone: "111",
      username: "",
      photoPath: require("../../assets/img/headPhoto@2x.png"),
      popupVisible: false
    };
  },
  mounted() {
    this.username = storages.get(global.USERINFO).username;
    this.phone = storages.get(global.USERINFO).phone;
    this.getHeader();
  },
  methods: {
    onCancel() {
      this.popupVisible = false;
    },
    userInfo() {
      // this.$router.push("/settinghead");
      this.$router.push("/settinghead");
    },
    goBack() {
      this.$router.back();
    },
    handleClose(done) {
      done();
    },
    modifyNike() {
      this.popupVisible = true;
    },
    onSubmit() {
      if (this.nickname.trim() == "") {
        this.$toast("请输入昵称");
        return;
      }
      if (this.username.trim() === this.nickname.trim()) {
        this.anickname = "";
        this.dialogVisible = false;
        return;
      }
      this.$loading();
      apiModifyAccountNike({
        nickname: this.nickname
      }).then(res => {
        this.$loading.close();
        this.username = this.nickname;
        this.nickname = "";
        storages.del(global.USERINFO);
        storages.del(global.TOKEN);
        storages.set(global.TOKEN, res.token);
        // this.username = storages.get(global.USERINFO).username;
        // storages.set(global.USERINFO, res.data.uid.userinfo);
        this.popupVisible = false;
        publicapi.updateUserInfo();
      });
    },
    // 更新头像
    getHeader() {
      if (storages.get(global.HEADPIC).length != 0) {
        this.photoPath = storages.get(global.HEADPIC);
      } else {
        let isImg = null;
        publicapi.refreshHead().then(d => {
          if (!d) {
            this.photoPath = storages.get(global.HEADPIC);
          }
        });
      }
    }
  },
  components: {
    vHeader,
    vMenu
  }
};
</script>
<style lang="scss" scoped>
.person {
  &-content {
    margin-top: 40px;
  }
  &-popup {
    width: 100%;
    height: 216px;
    background-color: #fff;
    .mint-popup {
      width: 80%;
      height: 216px;
      position: fixed;
      background: #fff;
      border-radius: 15px;
      top: 50%;
      left: 50%;
      -webkit-transform: translate3d(-50%, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transition: 0.2s ease-out;
      transition: 0.2s ease-out;
    }
    &-content {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 0.4rem;
      &-bottom {
        width: 100%;
        height: 50%;
        display: inline-block;
        &-cancel {
          width: 35%;
          height: 40px;
          background: rgb(179, 177, 177);
          opacity: 1;
          border-radius: 16px;
          font-size: 14px;
          margin-right: 5px;
          color: #444444;
          border: 0.5px solid rgb(175, 173, 173);
        }
        &-commit {
          width: 35%;
          margin-left: 5px;
          height: 40px;
          background: rgba(236, 144, 24, 1);
          border: 0.5px solid rgba(236, 144, 24, 1);
          opacity: 1;
          font-size: 14px;
          color: #fff;
          border-radius: 16px;
        }
      }
      &-ninkname {
        font-size: 13px;
        padding-top: 16px;
        color: #001026;
      }
      &-div {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50%;
        justify-content: center;
        &-input {
          position: relative;
          width: 80%;
          height: 40px;
          display: flex;
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0); // 透明背景
          border: 0.5px solid #abb1be;
          outline: none; // 去除选中状态边框
        }
      }
    }
  }
}
.inp-border {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    border-bottom: 1px solid $font-color;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
    opacity: 0.2;
  }
}
</style>
