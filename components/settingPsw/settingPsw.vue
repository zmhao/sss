<template>
  <div class="settingPsw">
    <mt-popup
      v-model="popupVisible"
      position="center"
      :closeOnClickModal="false"
    >
      <div class="settingPsw-content">
        <div class="settingPsw-content-header">
          {{ $t("请先设置支付密码再进行支付") }}
        </div>
        <div class="settingPsw-content-btnBox">
          <div class="settingPsw-content-btnBox-cancel" @click="cancelFun">
            {{ $t("取消") }}
          </div>
          <div class="settingPsw-content-btnBox-setting" @click="settingFun">
            {{ $t("前往设置") }}
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
export default {
  props: {
    popupPsw: {
      //控制弹框显示
      type: Boolean,
      default: false
    }
  },
  watch: {
    popupPsw() {
      this.popupVisible = this.popupPsw;
    }
  },
  data() {
    return {
      popupVisible: false
    };
  },
  methods: {
    //   cancelFun:取消事件
    cancelFun() {
      this.popupVisible = false;
      this.$emit("cancelFun");
    },
    // settingFun：前往设置密码
    settingFun() {
      this.$emit("settingFun");
    }
  }
};
</script>
<style lang="scss" scoped>
.settingPsw {
  &-content {
    // padding: 50px 0;
    &-header {
      font-size: 16px;
      color: $font-color;
      margin: 50px 0 40px 0;
    }
    &-btnBox {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 30px;
      div {
        width: 126px;
        height: 43px;
        border-radius: 22px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
      }
      &-cancel {
        background: rgba(36, 52, 90, 0.1);
        color: #444444;
        &:active {
          color: #6f6e6e;
        }
      }
      &-setting {
        background: rgba(236, 144, 24, 1);
        color: #fff;
        &:active {
          color: #dcdbdb;
        }
      }
    }
  }
}
.mint-popup {
  width: 85%;
  border-radius: 14px;
}
</style>
