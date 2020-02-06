<template>
  <div class="msg" style="height:100%;">
    <!-- 消息中心 -->
    <div class="msg-header">
      <v-header title="消息中心" :flxedS="flexS"></v-header>
    </div>
    <div class="wrapper1" ref="wrapper1">
      <div>
        <div class="header-height" v-if="flexS"></div>
        <div class="msg-content ">
          <div class="msg-content-pull" v-if="notifiData.length !== 0">
            <div
              class="msg-content-pull-item"
              v-for="(item, index) in notifiData"
              :key="index"
              @click="viewClick(index)"
            >
              <div class="msg-content-pull-item-title">
                <div class="msg-content-pull-item-title-left">
                  <!--兑换 -->
                  <img
                    v-if="item.order_type == 1"
                    src="../../assets/img/msgExchang@2x.png"
                  />
                  <!--充值 -->
                  <img
                    v-if="item.order_type == 2"
                    src="../../assets/img/top-upicon@2x.png"
                  />
                  <!--提现 -->
                  <img
                    v-if="item.order_type == 3"
                    src="../../assets/img/withdrawalicon@2x.png"
                  />
                  <!--转账 -->
                  <img
                    v-if="item.order_type == 4"
                    src="../../assets/img/transfericon@2x.png"
                  />
                  <!--收款 -->
                  <img
                    v-if="item.order_type == 5"
                    src="../../assets/img/collectionicon@2x.png"
                  />
                </div>
                <div class="msg-content-pull-item-title-center">
                  <div
                    v-if="
                      item.order_type == 2 &&
                        (item.order_status == 1 || item.order_status == 2)
                    "
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("充值中") }}
                  </div>
                  <div
                    v-if="item.order_type == 2 && item.order_status == 3"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("充值成功") }}
                  </div>
                  <div
                    v-if="item.order_type == 2 && item.order_status == 4"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("充值失败") }}
                  </div>

                  <div
                    v-if="
                      item.order_type == 1 &&
                        (item.order_status == 1 || item.order_status == 2)
                    "
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("兑换中") }}
                  </div>
                  <div
                    v-if="item.order_type == 1 && item.order_status == 3"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("兑换成功") }}
                  </div>
                  <div
                    v-if="item.order_type == 1 && item.order_status == 4"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("兑换失败") }}
                  </div>

                  <div
                    v-if="
                      item.order_type == 3 &&
                        (item.order_status == 1 || item.order_status == 2)
                    "
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("提现中") }}
                  </div>
                  <div
                    v-if="item.order_type == 3 && item.order_status == 3"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("提现成功") }}
                  </div>
                  <div
                    v-if="item.order_type == 3 && item.order_status == 4"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("提现失败") }}
                  </div>

                  <div
                    v-if="
                      item.order_type == 4 &&
                        (item.order_status == 1 || item.order_status == 2)
                    "
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("转账中") }}
                  </div>
                  <div
                    v-if="item.order_type == 4 && item.order_status == 3"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("转账成功") }}
                  </div>
                  <div
                    v-if="item.order_type == 4 && item.order_status == 4"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("转账失败") }}
                  </div>

                  <div
                    v-if="
                      item.order_type == 5 &&
                        (item.order_status == 1 || item.order_status == 2)
                    "
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("收款中") }}
                  </div>
                  <div
                    v-if="item.order_type == 5 && item.order_status == 3"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("收款成功") }}
                  </div>
                  <div
                    v-if="item.order_type == 5 && item.order_status == 4"
                    class="msg-content-pull-item-title-center-status"
                  >
                    {{ $t("收款失败") }}
                  </div>
                  <!-- <div class="msg-content-pull-item-title-center-status">提现中</div>
              <div class="msg-content-pull-item-title-center-status">转账成功</div>
              <div class="msg-content-pull-item-title-center-status">收款到账</div> -->
                  <div class="msg-content-pull-item-title-center-time">
                    {{ item.create_time }}
                  </div>
                  <div class="msg-content-pull-item-title-center-way">
                    <span class="msg-content-pull-item-title-center-way-left"
                      >{{ $t("交易方式") }}：</span
                    >
                    <span
                      v-if="item.payment_type == 0"
                      class="msg-content-pull-item-title-center-way"
                      >{{ $t("线下充值") }}</span
                    >
                    <span
                      v-if="item.payment_type == 1"
                      class="msg-content-pull-item-title-center-way"
                      >{{ $t("现金") }}</span
                    >
                    <span
                      v-if="item.payment_type == 2"
                      class="msg-content-pull-item-title-center-way"
                      >{{ $t("余额") }}</span
                    >
                  </div>
                  <div class="msg-content-pull-item-title-center-type">
                    <span class="msg-content-pull-item-title-center-type-left"
                      >{{ $t("交易类型") }}：</span
                    ><span
                      class="msg-content-pull-item-title-center-type-right"
                      >{{ $t(item.order_type_name) }}</span
                    >
                  </div>
                </div>
                <p class="msg-content-pull-item-title-right">
                  {{ item.amount }}
                </p>
              </div>
              <div class="msg-content-pull-item-bottom">
                <div class="msg-content-pull-item-bottom-left">
                  {{ $t("查看详情") }}
                </div>
                <div class="msg-content-pull-item-bottom-right">
                  <img src="../../assets/img/settingIcon@2x.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <!-- 无内容时的组件 -->
          <div v-else>
            <v-content></v-content>
          </div>
          <div class="loading" v-if="isLoading">
            <img src="../../assets/img/loading@2x.png" />
            <p>loading...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import { apiNotifications,apiUnread } from "@api/api";
import numeral from "numeral";
import util from "@js/util";
import vContent from "@/components/noContent/noContent";
import BScroll from "better-scroll";

export default {
  data() {
    return {
      page: 1,
      page_size: 10,
      notifiData: [],
      flexS: false,
      isLoading: false
    };
  },
  mounted() {
    let that = this;
    that.$loading();
    that.initDatas();
    that.$nextTick(() => {
      that.scroll = new BScroll(that.$refs.wrapper1, {
        pullUpLoad: { threshold: -40 }, //上拉40px时加载数据
        click: true,
        probeType: 3,
        listenScroll: false,
        pullUpLoad: true,
        bounce: false
      });
      // bounce: false
      that.scroll.on("scroll", pos => {
        if (pos.y < -50) {
          that.flexS = true;
        } else {
          that.flexS = false;
        }
      });
      that.scroll.on("pullingUp", function() {
        let len = that.notifiData.length / that.page_size;
        if (Number.isInteger(len)) {
          that.isLoading = true;
          that.page++;
          that.initDatas();
        }

        that.scroll.finishPullUp(); //可以多次执行上拉
        setTimeout(() => {
          that.scroll.refresh();
        }, 500);
      });
    });
  },
  methods: {
    // viewClick：跳到详情
    viewClick(i) {
      //i是索引
      this.$router.push({
        path: "MessageList",
        query: {
          logNo: this.notifiData[i].log_no,
          order_type: this.notifiData[i].order_type,
          orderNo: this.notifiData[i].order_no
        }
      });
    },
    initDatas() {
      let that = this;
      new Promise((resolve, reject) => {
        apiNotifications({
          page: this.page,
          page_size: this.page_size
        }).then(res => {
          that.$loading.close();
          let list = res.data.data;
          if (res.status == 200) {
            if (list) {
              for (let i = 0; i < list.length; i++) {
                list[i].create_time = util.formatDate(
                  list[i].create_time,
                  "yyyy-MM-dd hh:mm:ss"
                );
                list[i].order_type_name = this.getTransType(list[i].order_type);
                if (list[i].balance_type == "usd") {
                  list[i].amount =
                    "$" +
                    numeral(list[i].amount || 0)
                      .divide(100)
                      .format("0,0.00");
                } else {
                  list[i].amount = "៛" + list[i].amount;
                }
              }
              this.isLoading = false;
              that.notifiData = that.notifiData.concat(list);
              resolve(that.notifiData)
            }
          } else {
            resolve(that.notifiData)
            that.$toast(res.msg);
          }
        });
      }).then(d => {
        if(d){
          let arr = []
          for(let i =0;i<d.length;i++){
            if(d[i].is_read = '0'){
              arr.push(d[i].log_no)
            }
          }
          if(arr.length != 0){
            // 修改未读信息状态
            apiUnread({log_nos: arr.join()}).then(res=>{
              // console.log(res)
            })
          }
        }
      })
    },
    getTransType(type) {
      let name = "";
      switch (type) {
        case "1":
          name = "兑换";
          break;
        case "2":
          name = "充值";
          break;
        case "3":
          name = "提现";
          break;
        case "4":
          name = "转账";
          break;
        case "5":
          name = "收款";
          break;
      }
      return name;
    }
  },
  components: {
    vHeader,
    vContent
  },
  destroyed() {
    this.flexS = false;
  }
};
</script>
<style lang="scss" scoped>
.msg {
  width: 100%;
  height: 100%;
  &-content {
    padding: 20px 18px;
    &-pull {
      // margin-top: 28px;
      &-item {
        position: relative;
        // display: flex;
        // padding: 0 18px;
        // height: 198px;
        margin-bottom: 12px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        flex-direction: column;
        // border: 1px solid rgba(204, 209, 223, 1);
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid #ccd1df;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 200%;
          height: 200%;
          -webkit-transform: scale(0.5);
          transform: scale(0.5);
          -webkit-transform-origin: left top;
          transform-origin: left top;
          border-radius: 20px;
        }
        &-right {
          font-size: 19px;
          color: rgba(24, 124, 236, 1);
        }
        &-title {
          display: flex;
          // height: 140px;
          padding: 20px 20px;
          flex: 1;
          &-left {
            &-text {
              font-size: 19px;
              color: rgba(24, 124, 236, 1);
            }
            img {
              width: 22px;
              height: 22px;
            }
          }
          &-center {
            flex: 1;
            text-align: left;
            padding-left: 5px;
            &-status {
              font-size: 16px;
              color: $font-color;
            }
            &-time {
              font-size: 14px;
              color: #bbbbbb;
              margin: 3px 0;
            }
            &-way {
              font-size: 14px;
              margin-top: 10px;
              &-left {
                color: #999999;
              }
              &-right {
                color: $font-color;
              }
            }
            &-type {
              font-size: 14px;
              margin-top: 6px;
              &-left {
                color: #999999;
              }
              &-right {
                color: $font-color;
              }
            }
          }
          &-right {
            color: $btn-color;
            font-size: 19px;
          }
        }
        &-bottom {
          position: relative;
          height: 50px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            border-bottom: 1px solid $font-color;
            transform-origin: 0 100%;
            transform: scaleY(0.5);
            opacity: 0.1;
          }
          &-left {
            flex: 1;
            text-align: left;
            font-size: 14px;
            color: $font-color;
          }
          &-right {
            flex: 1;
            img {
              width: 14px;
              height: 14px;
              float: right;
            }
          }
        }
      }
    }
  }
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 55px;
  img {
    width: 25px;
    animation: rowup 0.7s linear infinite normal;
  }
  p {
    color: $btn-color;
  }
}
@keyframes rowup {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.header-height {
  height: 50px;
  width: 100%;
}
.wrapper1 {
  height: 100%;
  overflow: hidden;
}
</style>
