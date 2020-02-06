<template>
  <div class="photo">
    <div class="photo-header">
      <v-header title="设置个人头像"></v-header>
    </div>
    <div class="photo-content">
      <div class="photo-content-upload">
        <img
          :class="{
            'photo-content-upload-pic': isSelect === false,
            'photo-content-upload-pic1': isSelect === true
          }"
          :src="src"
        />
      </div>
      <div @click="albumFun" class="photo-btn">
        <v-btn
          btnText="从相册选一张"
          type="primary"
          :disabledVal="false"
        ></v-btn>
      </div>
      <div @click="cameraFun" class="photo-btn">
        <v-btn btnText="拍一张照片" type="primary" :disabledVal="false"></v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vBtn from "@/components/button/button";
import { apiUploadPic, apiModifyNickPic } from "@api/api";
import publicapi from "@js/publicapi";

import storages from "@views/cache/cache";
import global from "@views/common/global";
export default {
  data() {
    return {
      src: require("../../assets/img/photoPic@2x.png"),
      isSelect: false
    };
  },
  methods: {
    cameraFun() {
      let self = this;
      // 相机拍照
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
        self.src = "data:image/jpeg;base64," + imageData;
        
        self.uploadPic(self.src);
      }

      function onFail(message) {
        self.$loading.close();
        // alert('Failed because: ' + message)取消
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
        self.src = "data:image/jpeg;base64," + imageURL;
        self.uploadPic(self.src);
      }

      function onFail(message) {
        self.$loading.close();
        // alert('Failed because: ' + message) 已取消
      }
    },
    uploadPic(path) {
      let self = this;
      apiModifyNickPic({
        image_str: this.src
      }).then(res => {
        self.$loading.close();
        publicapi.updateUserInfo();
        self.$toast('设置头像成功')
        setTimeout(() => {
          self.$router.back()
        }, 2000);
      });
    }
  },
  components: {
    vHeader,
    vBtn
  }
};
</script>
<style lang="scss" scoped>
// .head {
//   width: 100%;
//   display: inline-block;
//   margin-top: 20px;
// }
// .text {
//   float: left;
// }
// .img {
//   float: right;
//   width: 15px;
//   height: 15px;
//   margin-top: 10px;
// }
// .btn {
//   width: 80%;
//   margin-top: 20px;
//   float: center;
// }
.photo {
  width: 100%;
  height: 100%;
  &-btn {
    margin-top: 20px;
  }
  &-content {
    padding: 0 18px;
    &-upload {
      height: 339px;
      margin-top: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      background-color: #eceef1;
      &-pic {
        width: 76px;
        height: 66px;
      }
      &-pic1 {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
