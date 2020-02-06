<template>
  <div>
    <div class="inout_div">
      <img
        slot="prepend"
        class="img-icon"
        src="../../assets/img/phoneicon@2x.png"
      />
      <span class="area-text">+855</span>
      <input
        type="text"
        oninput="value=value.replace(/[^\d]/g,'')"
        maxlength="11"
        minlength="9"
        class="input__inner"
        :placeholder="$t('请输入账号')"
        v-model="message"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "v-mobilePhone",
  props: ["icon"], //icon:图片的名字
  data() {
    return {
      message: "" //input的值
    };
  },
  watch: {
    message() {
      this.$emit("changeVal", this.message);
    }
  }
};
</script>
<style lang="scss" scoped>
.inout_div {
  display: flex;
  position: relative;
  height: 45px;
  width: 100%;
  margin: 0 auto;
  // justify-content: center;
  align-items: center;
  &::after {
    content: "";
    @include div-borderBottom;
  }
  .input__inner {
    color: $font-color;
    width: 100%;
    font-size: 16px;
    outline: none;
  }
  .area-text {
    color: $font-color;
    font-size: 18px;
    margin: 5px 10px 0 0;
  }
  .img-icon {
    height: 20px;
    width: 20px;
    margin: 0 5px;
  }
  //   input::-webkit-input-placeholder {
  //     color: #eae9e9;
  //   }
  //   input::-moz-placeholder {
  //     /* Mozilla Firefox 19+ */
  //     color: #eae9e9;
  //   }
  //   input:-moz-placeholder {
  //     /* Mozilla Firefox 4 to 18 */
  //     color: #eae9e9;
  //   }
}
</style>
