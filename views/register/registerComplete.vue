<template>
  <div>
    <!-- 注册完善信息界面 -->
    <v-header
      title="完善资料"
    ></v-header>
    <div class="registerComplate">
      <div class="registerComplate-photo">
        <div @click="imgFun" class="registerComplate-photo-box">
          <img :src="imgSrc" />
        </div>
      </div>
      <div class="registerComplate-name">
        <div class="inout_div">
          <span>{{$t('昵称')}}</span>
          <input
            type="text"
            maxlength="16"
            minlength="2"
            class="input__inner"
            :placeholder="$t('请输入昵称')"
            v-model="name"
          />
        </div>
      </div>
      <div class="registerComplate-btn">
        <mt-button
          class="button-container"
          @click.prevent="registerComFun"
          type="primary"
          >{{ $t("提交") }}</mt-button
        >
      </div>
    </div>
    <div class="popup">
      <mt-popup v-model="popupVisible" position="bottom">
        <div class="popup-content">
          <p class="popup-content-title">{{ $t("上传头像") }}</p>
          <p class="popup-content-item" @click="albumFun">
            {{ $t("从相册选一张") }}
          </p>
          <p class="popup-content-item" @click="cameraFun">
            {{ $t("拍一张图片") }}
          </p>
          <div class="popup-content-sp"></div>
          <p class="popup-content-title" @click="cancel">{{ $t("取消") }}</p>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header.vue";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import { apiUploadPic, apiModifyNickPic } from "@api/api";
import publicapi from "@js/publicapi"
export default {
  data() {
    return {
      name: "", // 昵称
      imgSrc: require("../../assets/img/headPhoto@2x.png"),
      popupVisible: false
    };
  },
  mounted() {
    this.name = storages.get(global.USERINFO).username;
  },
  methods: {
    //   registerComFun:路由跳转函数。
    registerComFun() {
      apiModifyNickPic({
        nickname: this.name
      }).then(res => {
        console.log(res);
        this.$router.replace({ path: "/" });
      });
    },
    callBackClick() {
      this.$router.replace({ path: "/" });
    },
    imgFun() {
      this.popupVisible = true;
    },
    cancel() {
      this.popupVisible = false;
    },
    cameraFun() {
      let self = this;
      // 相机
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 10,
        destinationType: Camera.DestinationType.DATA_URL,
        allowEdit: true
      });
      function onSuccess(imageData) {
        // var image = document.getElementById('MyImg')
        // image.src = 'data:image/jpeg;base64,' + imageData
        self.$loading();
        self.isSelect = true;
        self.imgSrc = "data:image/jpeg;base64," + imageData;
        self.uploadPic(self.src);
      }

      function onFail(message) {
        // alert('Failed because: ' + message)取消
        self.popupVisible = false
        self.loading.close();
      }
    },
    albumFun() {
      let self = this;
      // 打开相册
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true
      });

      function onSuccess(imageURL) {
        self.$loading();
        self.isSelect = true;
        self.imgSrc = "data:image/jpeg;base64," + imageURL;
        self.uploadPic(self.src);
      }
      // 点击取消
      function onFail(message) {
        self.$loading.close();
        self.popupVisible = false
        // alert('Failed because: ' + message) 已取消
      }
    },
    uploadPic(path) {
      let self = this;
      apiModifyNickPic({
        image_str: self.imgSrc
      }).then(res => {
        self.$loading.close();
        self.popupVisible = false
        publicapi.updateUserInfo()
        self.$toast('设置成功')
      });
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss" scoped>
.registerComplate {
  padding: 0 18px;
  &-photo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 0;
    &-box {
      width: 72px;
      height: 72px;
      img {
        width: 72px;
        height: 72px;
      }
      &:active {
        background-color: $img-activeColor;
      }
    }
  }
  &-name {
    .inout_div {
      display: flex;
      position: relative;
      height: 38px;
      width: 100%;
      margin: 0 auto;
      // justify-content: center;
      align-items: center;
      // border-bottom: 1px solid #eae9e9;
      font-size: 18px;
      &::after {
        content: "";
        @include div-borderBottom;
      }
      .input__inner {
        color: $font-color;
        width: 60%;
        outline: none;
        margin-left: 12px;
        font-size: 18px;
      }
    }
  }
  &-btn {
    margin-top: 50px;
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
.popup {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .mint-popup {
    width: 100%;
    position: fixed;
    background: #fff;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: 0.2s ease-out;
    transition: 0.2s ease-out;
  }
  &-content {
    width: 100%;
    height: 20%;
    &-title {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #eae9e9;
      font-size: 13px;
      padding-top: 16px;
      color: #444444;
    }
    &-sp {
      width: 100%;
      height: 3px;
      background-color: #e5e5e5;
    }
    &-item {
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #eae9e9;
      font-size: 18px;
      padding-top: 16px;
      color: #001026;
    }
  }
}
</style>
