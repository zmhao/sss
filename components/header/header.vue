<template>
  <div class="header" :class="flxedS == true ? 'flxed' : ''">
    <!-- 头部导航 -->
    <div class="header-box">
      <div class="header-box-back" @click="imgback">
        <img
          class="img-style"
          src="../../assets/img/back@2x.png"
          v-if="fontColor"
        />
        <img class="img-style" src="../../assets/img/arrBlack@2x.png" v-else />
      </div>
      <span :style="{ color: fontColor == true ? '#24345A' : '#fff' }">{{
        $t(title)
      }}</span>
      <!-- {{ varietie }} -->
      <div @click="tabFun" v-if="varietieRight" class="varietieRight">
        <p class="varietieRight-left" :class="varietie == 'USD'?'poacity':''">USD</p>
        <p class="varietieRight-center poacity">/</p>
        <p class="varietieRight-right" :class="varietie == 'KHR'?'poacity':''">KHR</p>
      </div>
    </div>
    <v-network></v-network>
  </div>
</template>
<script>
import vNetwork from "@/components/network/network";
export default {
  name: "v-header",
  props: {
    title: {
      // 标题
      type: String
    },
    fontColor: {
      // 字体颜色
      type: Boolean,
      default: true
    },
    varietieRight: {
      // 是否隐藏币种选项
      type: Boolean,
      default: false
    },
    scrollH: {
      // 是否固定在头部
      type: Boolean,
      default: false
    },
    callBack: {
      // 回调处理二级问题
      type: Boolean,
      default: false
    },
    flxedS: {
      type: Boolean,
      default: false
    }
  }, // 标题
  data() {
    return {
      varietie: "KHR" // 币种
    };
  },
  watch: {},
  methods: {
    callBackClick() {
      this.$emit("callBackClick");
    },
    imgback() {
      this.$router.back();
    },
    tabFun() {
      if (this.varietie == "USD") {
        this.varietie = "KHR";
        this.$emit("changeUSD", "USD");
      } else {
        this.varietie = "USD";
        this.$emit("changeUSD", "KHR");
      }
    }
  },
  components: {
    vNetwork
  }
};
</script>
<style lang="scss" scoped>
.flxed {
  position: fixed;
  top: 0;
  box-shadow: 1px 1px 5px 0px #ccc;
  background-color: #fff;
}
.header {
  width: 100%;
  z-index: 99;
  .header-box {
    padding: 0 18px 0 0;
    display: flex;
    height: 50px;
    align-items: center;
    font-size: 25px;
    &-back {
      padding-left: 18px;
      width: 30px;
      height: 50px;
      display: flex;
      align-items: center;
      img {
        width: 18px;
        height: 18px;
      }
      // &:active {
      //   background-color: $img-activeColor;
      // }
    }

    span {
      margin-left: 10px;
      flex: 1;
      text-align: left;
    }
    p {
      font-size: 16px;
      color: $btn-color;
      font-weight: bold;
    }
  }
}
.header-scroll {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  box-shadow: 0px 0px 4px 1px #ccc;
  .header-box {
    height: 50px !important;
    background: #fff;
  }
}
.header-scroll1 {
  width: 100%;
  z-index: 999;
  visibility: hidden;
  .header-box {
    height: 50px !important;
    background: #fff;
  }
}
.varietieRight{
  display: flex;
  .poacity{
    opacity: 0.3;
  }
}
</style>
