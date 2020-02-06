<template>
  <div v-on:click="onSubmit()" class="v-btn">
    <div class="v-btn-menu">
      <div class="v-btn-menu-left">
        <p class="v-btn-menu-title">{{ $t(title) }}</p>
      </div>
      <div class="v-btn-menu-right">
        <p class="v-btn-menu-tag">{{ $t(tag) }}</p>
        <div class="img-box" v-if="isHead"><img class="v-btn-menu-imghead" :src="path" /></div>
        <img
          class="v-btn-menu-img"
          v-if="!isArrow"
          src="../../assets/img/settingIcon@2x.png"
        />
      </div>
    </div>
  </div>
</template>
<script>
import publicapi from "@js/publicapi";
import storages from "@views/cache/cache";
import global from "@views/common/global";
export default {
  name: "vMenu",
  props: ["title", "tag", "path", "isHead", "isArrow"], //title:菜单名 tag：菜单标签 path:头像路径  isHead：是否显示头像, isArrow:是否显示箭头图片
  data() {
    return {
    };
  },
  methods: {
    onSubmit() {
      let that = this;
      that.$emit("onSubmit");
    },
  }
};
</script>
<style lang="scss">
.v-btn {
  width: 100%;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  // border-bottom: 1px solid rgb(233, 233, 235);
  &::after{
    content: "";
    @include div-borderBottom;
  }
  &:active{
    background: rgba(0, 0, 0, 0.1)
  }
  &-menu {
    width: 100%;
    padding: 0 18px;
    display: flex;
    align-items: center;
    &-left,
    &-right {
      flex: 1;
      display: flex;
      align-items: center;
    }
    &-right {
      justify-content: flex-end;
    }
    &-title {
      font-size: 16px;
      color: $font-color;
      opacity: 0.75;
    }
    &-img {
      width: 14px;
      height: 14px;
    }
    .img-box{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    &-imghead {
      width: 40px;
      height: 40px;
    }
    &-tag {
      font-size: 18px;
      color: $font-color;
      opacity: 1;
    }
  }
}
</style>
