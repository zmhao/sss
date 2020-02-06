<template>
  <div class="payment">
    <div class="payment-content">
      <div class="payment-content-header">
        <v-header title="向商家付款" :fontColor="false"></v-header>
      </div>
      <!-- <div class="payment-content-code"></div> -->
      <div class="payment-content-box">
        <div class="payment-content-box-box">
          <div class="payment-content-box-box-content">
            <div class="payment-content-box-box-content-title">
              <img src="../../assets/img/wallet@2x.png" alt="" />
              <span>{{ $t("向商家付款") }}</span>
            </div>
            <div class="payment-content-box-box-content-code">
              <div id="qrCode" ref="qrCodeDiv"></div>
              <!-- <img src="../../assets/img/addressBook@2x.png" alt="" /> -->
            </div>
            <div
              class="payment-content-box-box-content-list"
              @click="openClick"
            >
              <div class="payment-content-box-box-content-list-left">
                <img :src="imgUrl" alt="" />
              </div>
              <div class="payment-content-box-box-content-list-center">
                <p>{{payType == 'usd_balance'?'USD':'KHR'}}</p>
                <p>{{ $t("优先使用此付款方式") }}</p>
              </div>
              <div class="payment-content-box-box-content-list-right">
                <img src="../../assets/img/settingIcon@2x.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="popup-box">
        <div class="popup-box-header">
          <p class="popup-box-header-close" @click="clickOff">
            <img src="../../assets/img/x@2x.png" alt="" />
          </p>
          <div class="popup-box-header-title">{{ $t("选择付款类型") }}</div>
          <div class="popup-box-header-right"></div>
        </div>
        <div ref="wrapper" class="wrapper">
          <div class="popup-box-centent">
            <div class="popup-box-centent-list" @click="clickUSD">
              <div class="popup-box-centent-list-img">
                <img src="../../assets/img/transfericon@2x.png" alt="" />
                <!-- <img src="../../assets/img/khr_logo@2x.png" alt="" /> -->
              </div>
              <div class="popup-box-centent-list-center">USD{{'（$'+USDmoney+"）"}}</div>
              <div class="popup-box-centent-list-right"><p :class="payType == 'usd_balance'?'bgImg':''"></p></div>
            </div>
            <div class="popup-box-centent-list" @click="clickKHR">
              <div class="popup-box-centent-list-img">
                <!-- <img src="../../assets/img/transfericon@2x.png" alt="" /> -->
                <img src="../../assets/img/khr_logo@2x.png" alt="" />
              </div>
              <div class="popup-box-centent-list-center">KHR（៛{{KHRmoney}}）</div>
              <div class="popup-box-centent-list-right"><p :class="payType == 'khr_balance'?'bgImg':''"></p></div>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import vHeader from "@/components/header/header";

import BScroll from "better-scroll";
import { apiGetCard,apiDefaultCard } from "@api/api"; // 导入我们的api接口
export default {
  data() {
    return {
      qrCode: storages.get(global.USERINFO).account_uid,
      popupVisible: false,
      payType:'',//付款方式
      cardList:[],
      KHRmoney:0,
      USDmoney:0,
      imgUrl:require('../../assets/img/symbol@2x.png')
    };
  },
  mounted() {
    let that = this;
    this.$nextTick(function() {
      this.bindQRCode();
    });
    // 处理滚动条
    that.$nextTick(() => {
      that.scroll = new BScroll(that.$refs.wrapper, {
        pullUpLoad: { threshold: -40 }, //上拉40px时加载数据
        click: true,
        probeType: 3,
        listenScroll: false,
        pullUpLoad: true,
        bounce: true
      });
      that.scroll.on("scroll", pos => {
        if (pos.y < -50) {
          that.flexS = true;
        } else {
          that.flexS = false;
        }
      });
    });
    that.getCardList()
  },
  methods: {
    bindQRCode: function() {
      let self = this;
      new QRCode(this.$refs.qrCodeDiv, {
        text: self.qrCode,
        width: 170,
        height: 150,
        colorDark: "#333333", // 二维码颜色
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.H // 容错率，L/M/H
      });
    },
    // clickOff:关闭弹框
    clickOff() {
      let that = this;
      that.popupVisible = false;
    },
    // openClick：打开弹框
    openClick() {
      let that = this;
      that.popupVisible = true;
    },
    // getCardList:获取付款方式
    getCardList(){
      let that = this
      this.$loading()
      apiGetCard().then(res=>{
        if(res.data.def_pay_no){
          that.payType = res.data.def_pay_no
          that.KHRmoney = res.data.data.khr_balance
          that.USDmoney = res.data.data.usd_balance
        }
        that.$loading.close()
      })
    },
    // apiDefaultCard:修改默认卡接口
    getCard(){
      apiDefaultCard({def_pay_no: this.payType}).then(res=>{})
    },
    // clickUSD：点击usd
    clickUSD(){
      this.payType = 'usd_balance'
      this.getCard()
      this.imgUrl = require("../../assets/img/symbol@2x.png")
      this.popupVisible = false
    },
    clickKHR(){
      this.payType = 'khr_balance'
      this.getCard()
      this.imgUrl = require("../../assets/img/khr_logo@2x.png")
      this.popupVisible = false
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss" scoped>
.payment {
  width: 100%;
  min-height: 100%;
  background-color: $btn-color;
  &-content {
    &-box {
      padding: 0 18px;
      margin-top: 35px;
      &-box {
        width: 100%;
        height: 360px;
        opacity: 1;
        border-radius: 6px;
        background-color: #fbfbfb;
        &-content {
          padding: 18px 18px;
          &-title {
            display: flex;
            align-items: center;
            color: $btn-color;
            font-size: 16px;
            img {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            }
          }
          &-code {
            &::after {
              content: "";
              display: block;
              width: 100%;
              border-bottom: 1px solid #24345a;
              opacity: 0.1;
              @include menu-borderBottom;
              margin-top: 40px;
            }
            div {
              margin: 40px auto 0 auto;
              width: 178px;
              height: 178px;
              display: flex;
              justify-content: center;
            }
          }
          &-list {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            &-left {
              width: 30px;
              height: 100%;
              img {
                width: 22px;
                height: 22px;
                margin-top: 5px;
              }
              p{
                width: 22px;
                height: 22px;
                margin-top: 5px;
                background: url()
              }
            }
            &-center {
              flex: 1;
              text-align: left;
            }
            &-right {
              img {
                width: 14px;
                height: 14px;
              }
            }
          }
        }
      }
    }
  }
}
.mint-popup {
  width: 100%;
}
.popup-box {
  // height: 250px;
  padding: 0 18px;
  &-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    &-close {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
    }
    &-title {
      font-size: 13px;
      color: #001026;
      flex: 1;
    }
    &-right {
      width: 30px;
      height: 30px;
    }
  }
  &-centent {
    &-list {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 55px;
      &-img {
        width: 30px;
        img {
          width: 24px;
          height: 24px;
        }
      }
      &-right {
        width: 30px;
        p {
          width: 22px;
          height: 22px;
          
        }
        .bgImg{
          background: url("../../assets/img/choose-card@2x.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      &-center {
        flex: 1;
        text-align: left;
        font-size: 16px;
        color: $font-color;
        // padding-left: 5px;
      }
      &::after {
        content: "";
        @include div-borderBottom;
      }
    }
  }
  .wrapper {
    height: 210px;
    overflow: hidden;
  }
}
</style>
