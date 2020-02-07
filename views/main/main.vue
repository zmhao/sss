<template>
  <div class="home" ref="home">
    <v-network></v-network>
    <div class="main">
      <div class="main-header">
        <div class="main-header-content">
          <div class="main-header-content-left">
            <img @click="onPerson" :src="headSrc" alt />
          </div>
          <div class="main-header-content-center">{{ $t("Modern Pay") }}</div>
          <div class="main-header-content-right">
            <p class="main-header-content-right-scanning" @click="scanTrans">
              <img src="../../assets/img/scanning@2x.png" alt />
            </p>
            <p
              @click="notification"
              class="main-header-content-right-message"
              :class="messageStatus ? 'redRoud' : ''"
            >
              <img src="../../assets/img/prompt@2x.png" alt />
            </p>
          </div>
        </div>
      </div>
      <!-- 轮播图 -->
      <div class="main-swipe">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div class="main-swipe-USD">
                <div class="main-swipe-USD-box">
                  <div class="main-swipe-USD-box-left">
                    <p class="main-swipe-USD-box-left-title">USD</p>
                    <p class="main-swipe-USD-box-left-meney">{{ "$" + amount_usd }}</p>
                  </div>
                  <div class="main-swipe-USD-box-right">
                    <img src="../../assets/img/phone_login.png" alt />
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="main-swipe-KHR">
                <div class="main-swipe-KHR-box">
                  <div class="main-swipe-KHR-box-left">
                    <p class="main-swipe-KHR-box-left-title">KHR</p>
                    <p class="main-swipe-KHR-box-left-meney">{{ "៛" + amount_khr }}</p>
                  </div>
                  <div class="main-swipe-KHR-box-right">
                    <img src="../../assets/img/phone_login.png" alt />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination"></div>
        </div>
      </div>
      <div class="main-menu" touchmove.parent>
        <div class="main-menu-content">
          <div
            class="main-menu-content-li"
            v-for="(item, index) in list"
            @click="itemClick(index)"
            :key="index"
          >
            <!-- <router-link :to="item.path !"> -->
            <img :src="item.img" alt />
            <p>{{ $t(item.name) }}</p>
            <!-- </router-link> -->
          </div>
          <div
            class="main-menu-content-li"
            v-for="item in 4 - (list.length % 4)"
            :key="item + 'aa'"
          ></div>
        </div>
      </div>
    </div>
    <!-- 左弹框 -->
    <div class="popuoModel">
      <mt-popup v-model="popupVisible" position="left">
        <div class="popupwindows">
          <div class="popup-div">
            <img class="popup-div-img" @click="onMessage" :src="headSrc" alt />
            <div class="popup-div-head">
              <p class="popup-div-head-title">{{ username }}</p>
              <p class="popup-div-head-tips" @click="onMessage">{{ $t("编辑个人资料") }}</p>
            </div>
          </div>
          <div class="popup-menu">
            <div class="popup-menu-item" @click="coupon">
              <img class="popup-menu-item-img" src="../../assets/img/menuCoupon@2x.png" />
              <p class="popup-menu-item-title">{{ $t("优惠券") }}</p>
            </div>
            <div class="popup-menu-item" @click="setting">
              <img class="popup-menu-item-img" src="../../assets/img/menuSetting@2x.png" />
              <p class="popup-menu-item-title">{{ $t("设置") }}</p>
            </div>
            <div class="popup-menu-item" @click="server">
              <img class="popup-menu-item-img" src="../../assets/img/menuService@2x.png" />
              <p class="popup-menu-item-title">{{ $t("服务网点") }}</p>
            </div>
            <div class="popup-menu-item" @click="help">
              <img class="popup-menu-item-img" src="../../assets/img/menuHelp@2x.png" />
              <p class="popup-menu-item-title">{{ $t("帮助") }}</p>
            </div>
            <div class="popup-menu-item" @click="about">
              <img class="popup-menu-item-img" src="../../assets/img/menuAbout@2x.png" />
              <p class="popup-menu-item-title">{{ $t("关于我们") }}</p>
            </div>
            <div class="popup-menu-item" @click="switchLang">
              <img class="popup-menu-item-img" src="../../assets/img/menuLang@2x.png" />

              <p class="popup-menu-item-title">{{ $t("切换语言") }}</p>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import { apiMenu, apiremains, apiNotifications } from "@api/api"; // 导入我们的api接口
import storages from "@views/cache/cache";
import global from "@views/common/global";
import publicapi from "@js/publicapi";
import vNetwork from "@/components/network/network";
import Swiper from "swiper"; // 引入swiper
import numeral from "numeral";
import jPish from "@js/jpush";
export default {
  data() {
    return {
      headSrc: require("../../assets/img/headPhoto@2x.png"),
      list: [],
      cardList: [],
      drawer: false,
      imgHeight: 100,
      direction: "ltr",
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      amount_usd: "0.00",
      amount_khr: "0",
      username: "",
      exitAppTicker: 0,
      popupVisible: false,
      menuData: [
        {
          name: "转账",
          path: "/trans",
          img: require("../../assets/img/transfer@2x.png")
        },
        {
          name: "充值",
          path: "/recharge",
          img: require("../../assets/img/top-up@2x.png")
        },
        {
          name: "提现",
          path: "/takemoney",
          img: require("../../assets/img/withdrawal@2x.png")
        },
        {
          name: "收钱",
          path: "/receivables",
          img: require("../../assets/img/collection@2x.png")
        },
        {
          name: "付款",
          path: "/payment",
          img: require("../../assets/img/payment@2x.png")
        },
        {
          name: "账单",
          path: "/bill",
          img: require("../../assets/img/bill@2x.png")
        },
        {
          name: "兑换",
          path: "/exchange",
          img: require("../../assets/img/exchange@2x.png")
        }
      ],
      messageStatus: false
    };
  },
  mounted() {
    let self = this;
    let type = storages.get(global.USERINFO).account_type;
    let phone = storages.get(global.USERINFO).phone;
    let tag = type + "_" + phone;
    self.$loading();
    let startX = null,
      startY = null,
      moveEndX = null,
      moveEndY = null,
      X = null,
      Y = null;
    setTimeout(() => {
      jPish.setAlias(1, tag).then(d => {
        // console.log(d);
      });
    }, 30000);

    // 使用swiper
    new Swiper(".swiper-container", {
      autoplay: 6000,
      slidesPerView: 1.05,
      slidesPerGroup: 2,
      pagination: ".pagination",
      autoplayDisableOnInteraction: false
    });
    self.username = storages.get(global.USERINFO).username;
    self.list = storages.get(global.MAINLIST);
    self.amount_usd = storages.get(global.AMOUNT_USD) === "" || "0.00";
    self.amount_khr = storages.get(global.AMOUNT_KHR) === "" || "0";
    self.list = storages.get(global.MAINLIST);
    //获取菜单
    apiMenu({ application_type: "0" }).then(res => {
      storages.set(global.MAINLIST, res.data.data);
      self.list = res.data.data;
    });

    //获取余额
    apiremains({}).then(res => {
      if (typeof res.data.data.usd !== "undefined") {
        self.amount_usd = numeral(res.data.data.usd || 0)
          .divide(100)
          .format("0,0.00");
      }
      if (typeof res.data.data.khr !== "undefined") {
        self.amount_khr = res.data.data.khr;
      }
      storages.set(global.AMOUNT_USD, res.data.data.usd);
      storages.set(global.AMOUNT_KHR, res.data.data.khr);
      self.cardList.push({ amount: self.amount_usd, type: "USD" });
      self.cardList.push({ amount: self.amount_khr, type: "KHR" });

      self.$loading.close();
    });
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.fun, false); //false阻止默认事件
    }
    // 监听右滑
    self.$refs.home.addEventListener("touchstart", function(e) {
      startX = e.targetTouches[0].pageX;
      startY = e.targetTouches[0].pageY;
    });
    self.$refs.home.addEventListener("touchmove", function(e) {
      moveEndX = e.targetTouches[0].pageX;
      moveEndY = e.targetTouches[0].pageY;
      X = moveEndX - startX;
      Y = moveEndY - startY;
      if (Math.abs(X) > Math.abs(Y) && X > 50 && Math.abs(Y) < 10) {
        self.popupVisible = true;
      }
    });
    // 监听左滑
    self.$refs.home.addEventListener("touchstart", function(e) {
      startX = e.targetTouches[0].pageX;
      startY = e.targetTouches[0].pageY;
    });
    self.$refs.home.addEventListener("touchmove", function(e) {
      moveEndX = e.targetTouches[0].pageX;
      moveEndY = e.targetTouches[0].pageY;
      X = moveEndX - startX;
      Y = moveEndY - startY;
      if (Math.abs(X) > Math.abs(Y) && X > 50 && Math.abs(Y) < 10) {
        self.popupVisible = true;
      }
      if (X < -50 && Math.abs(Y) < 10) {
        self.popupVisible = false;
      }
    });
    // 消息列表接口
    self.initMessage();
    // 获取头像
    self.getHeader();
  },
  destroyed() {
    window.removeEventListener("popstate", this.fun, false); //false阻止默认事件
  },
  methods: {
    fun() {
      navigator.app.exitApp();
    },
    onBackKeyDown: function() {
      // console.log("back");
    },
    notification() {
      this.$router.push("/notification");
    },
    help() {
      this.drawer = false;
      this.$router.push("/help");
    },
    about() {
      this.drawer = false;
      this.$router.push("/about");
    },
    switchLang() {
      this.drawer = false;
      this.$router.replace("/selectlang");
    },
    coupon() {
      this.drawer = false;
      this.$router.push("/coupon");
    },
    setting() {
      this.drawer = false;
      this.$router.replace("/setting");
    },
    server() {
      this.drawer = false;
    },
    findUserInfo() {
      this.drawer = false;
    },
    handleClose(done) {
      done();
    },
    // 扫码
    scanTrans() {
      let self = this;
      // self.$router.replace({
      //         name: "ScanTakeMoney",
      //         query: {
      //           code: "S.dl3lMm1RLd5qO5RXR6zXgs1AKYiGrpJQ"
      //         }
      //       });
      this.$router.push("/scan");
    },
    onPerson() {
      this.popupVisible = true;
    },
    // 菜单跳转页面
    itemClick(index) {
      let that = this;
      if (
        that.list[index].target == "recharge" ||
        that.list[index].target == "takemoney"
      ) {
        that.$toast("该功能未开放");
      } else {
        that.$router.push("/" + that.list[index].target); //
      }
    },
    // 编辑个人资料
    onMessage() {
      this.$router.push("/persondata");
    },
    // initMessage: 获取消息列表，用来判断是否添加未读红点
    initMessage() {
      let that = this;
      apiNotifications({
        page: 1,
        page_size: 10
      }).then(res => {
        let d = res.data.data;
        if (d) {
          for (let i = 0; i < d.length; i++) {
            if (d[i].is_read == "0") {
              that.messageStatus = true;
            }
          }
        }
      });
    },
    // 更新头像
    getHeader() {
      if (storages.get(global.HEADPIC).length != 0) {
        this.headSrc = storages.get(global.HEADPIC);
      } else {
        let isImg = null;
        publicapi.refreshHead().then(d => {
          if (!d) {
            this.headSrc = storages.get(global.HEADPIC);
          }
        });
      }
    }
  },
  components: {
    vNetwork
  }
};
</script>
<style lang="scss" scoped>
@import "swiper/dist/css/swiper.css";
.home {
  position: relative;
  height: 100%;
  overflow: hidden;
  .popuoModel {
    background-color: #fff;
    .mint-popup-left {
      width: 80%;
      height: 100%;
    }
    .mint-popup {
      .popupwindows {
        width: 90%;
        height: 100%;
        background-color: #fff;
        display: block;
        padding-left: 40px;
        padding-top: 40px;
        .popup-menu {
          float: left;
          padding-top: 40px;
          &-item {
            display: flex;
            padding: 5px;
            align-items: center;
            &-img {
              width: 20px;
              padding: 15px;
              height: 20px;
            }
            &-title {
              font-size: 16px;
              padding: 5px;
              color: $font-color;
            }
          }
        }
        .popup-div {
          width: 100%;
          height: 10%;
          display: flex;
          margin-top: 20px;
          align-items: center;
          &-img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
          }
          &-head {
            padding-left: 20px;
            &-title {
              display: flex;
              color: $font-color;
              padding-bottom: 5px;
              font-size: 18px;
            }
            &-tips {
              display: flex;
              color: #2d88ed;
              font-size: 11px;
            }
          }
        }
      }
    }
  }

  .main {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(247, 248, 250, 1);
    .main-header {
      // width: 100%;
      height: 192px;
      background: url("../../assets/img/homeHead@2x.png") no-repeat;
      background-size: 100%;
      padding: 0 18px;
      &-content {
        display: flex;
        align-items: center;
        padding-top: 64px;
        position: relative;
        // div {
        //   flex: 1;
        // }
        &-left {
          position: absolute;
          width: 37px;
          height: 37px;
          img {
            width: 37px;
            height: 37px;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
          }
        }
        &-center {
          flex: 1;
          font-size: 23px;
          color: rgba(231, 246, 246, 1);
        }
        &-right {
          position: absolute;
          right: 0;
          display: flex;
          justify-content: flex-end;
          p {
            width: 28px;
            height: 28px;
            img {
              width: 28px;
              height: 28px;
            }
          }
          &-scanning {
            margin-right: 13px;
          }
          &-message {
            position: relative;
          }
          .redRoud {
            &::after {
              content: "";
              position: absolute;
              display: block;
              background-color: #ff1400;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              top: 0;
              right: 0;
            }
          }
        }
      }
    }
    .main-swipe {
      position: absolute;
      top: 130px;
      width: 100%;
      // height: 127px;
      .main-swipe-USD {
        width: 100%;
        height: 137px;
        // background-color: red;
        background: rgba(0, 0, 0, 0);
        float: right;
        &-box {
          display: flex;
          align-items: center;
          width: 95%;
          height: 117px;
          background-color: rgba(239, 246, 253, 1);
          float: right;
          // margin-right: 5px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
          &-left {
            flex: 3;
            text-align: left;
            &-title {
              font-size: 14px;
              color: $font-color;
              margin-left: 24px;
              font-weight: 400;
              // opacity: 0.5;
              margin-bottom: 8px;
            }
            &-meney {
              font-size: 36px;
              color: $font-color;
              font-weight: bold;
              margin-left: 24px;
            }
          }
          &-right {
            position: relative;
            flex: 1;
            height: 100%;
            img {
              position: absolute;
              width: 72px;
              bottom: 0;
              right: 0;
            }
          }
        }
      }
      .main-swipe-KHR {
        width: 100%;
        height: 137px;
        // background-color: yellow;
        background: rgba(0, 0, 0, 0);
        &-box {
          display: flex;
          align-items: center;
          width: 94%;
          height: 117px;
          background-color: rgba(253, 248, 239, 1);
          // float: right;
          margin-left: 5px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
          &-left {
            flex: 3;
            text-align: left;
            &-title {
              font-size: 14px;
              color: $font-color;
              margin-left: 24px;
              font-weight: 400;
              // opacity: 0.5;
              margin-bottom: 8px;
            }
            &-meney {
              font-size: 36px;
              color: $font-color;
              font-weight: bold;
              margin-left: 24px;
            }
          }
          &-right {
            position: relative;
            flex: 1;
            height: 100%;
            img {
              position: absolute;
              width: 72px;
              bottom: 0;
              right: 0;
            }
          }
        }
      }
    }
    &-menu {
      padding: 0 18px;
      margin-top: 110px;
      &-content {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
        opacity: 1;
        height: 170px;
        border-radius: 8px;
        padding: 0px 0 40px 0;
        &-li {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 0px 10px 0;
          // height: 40px;
          // margin: 17px 20px;
          img {
            width: 40px;
            height: 40px;
          }
          p {
            margin-top: 5px;
            color: #092058;
          }
        }
      }
    }
  }
  /deep/ .swiper-container {
    .pagination {
      display: flex;
      justify-content: center;
      span {
        display: block;
        width: 17px !important;
        height: 4px !important;
        background-color: rgba(36, 52, 90, 1);
        margin-left: 5px;
        opacity: 0.3;
      }
      .swiper-pagination-bullet-active {
        background-color: $btn-color;
        opacity: 1 !important;
      }
    }
  }
}
</style>
