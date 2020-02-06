<template>
  <!-- 账单 -->
  <div style="height:100%;">
    <v-header
      title="账单"
      :flxedS="flexS"
      :varietieRight="true"
      @changeUSD="tabClick"
    ></v-header>
    <div style="height:100%;overflow:hidden">
      <div class="bill wrapper" ref="wrapper">
        <div class="bill-content">
          <div class="header-height" v-if="flexS"></div>
          <div class="bill-content-time">
            <div class="bill-content-time-text">
              <div class="bill-content-time-text-year" @click="openModel">
                <span class="bill-content-time-text-year-left">{{
                  $t(yaerDay[0] + "年" + yaerDay[1] + "月")
                }}</span>
                <span class="bill-content-time-text-year-right"></span>
              </div>
              <div class="bill-content-time-text-money">
                <span class="bill-content-time-text-money-left">{{$t("支出")}}{{moneyType == "USD"?"$":"៛"}}{{payment}}</span>
                <span class="bill-content-time-text-money-right">{{$t("收入")}}{{moneyType == "USD"?"$":"៛"}}{{income}}</span>
              </div>
            </div>
          </div>
          <!-- 空数据组件 -->
          <div v-if="items.length == 0">
            <v-content></v-content>
          </div>
          <div class="bill-content-list" v-if="items.length !== 0">
            <div
              @click="onItemClick(index)"
              class="bill-content-list-box"
              v-for="(item, index) in items"
              :key="index"
            >
              <div class="bill-content-list-box-content">
                <div class="bill-content-list-box-content-left">
                  <img
                    src="../../assets/img/servicefee@2x.png"
                    v-if="item.reason == '6'"
                    alt=""
                  />
                  <img
                    src="../../assets/img/top-upicon@2x.png"
                    v-if="item.reason == '2'"
                    alt=""
                  />
                  <img
                    src="../../assets/img/collectionicon@2x.png"
                    v-if="item.reason == '5'"
                    alt=""
                  />
                  <img
                    src="../../assets/img/transfericon@2x.png"
                    v-if="item.reason == '4'"
                    alt=""
                  />
                  <img
                    src="../../assets/img/withdrawalicon@2x.png"
                    v-if="item.reason == '3' || item.reason == '7'"
                  />
                  <img
                    src="../../assets/img/msgExchang@2x.png"
                    v-if="item.reason == '1'"
                  />
                </div>
                <div class="bill-content-list-box-content-center">
                  <p class="bill-content-list-box-content-center-name">
                    {{ $t(statusArr[item.reason]) }}
                  </p>
                  <p class="bill-content-list-box-content-center-time">
                    {{ item.create_time }}
                  </p>
                </div>
                <div class="bill-content-list-box-content-right">
                  <p
                    v-if="item.op_type == 1"
                    class="bill-content-list-box-content-right-money"
                  >
                    +{{moneyType == "USD"?'$':'៛'}}{{ item.amount }}
                  </p>
                  <p
                    v-if="item.op_type == '2' || item.op_type == '3' "
                    class="bill-content-list-box-content-right-money"
                  >
                    {{ item.amount == "0" ? '':'-' }}{{moneyType == "USD"?'$':'៛'}}{{item.amount }}
                  </p>
                  <p class="bill-content-list-box-content-right-balance">
                    {{ $t("余额：")}}{{moneyType == "USD"?'$':'៛'}}{{ item.balance }}
                  </p>
                </div>
              </div>
            </div>
            <div class="no-content" v-if="moreDate">{{ $t("无更多内容") }}</div>
            <div class="loading" v-if="isLoading">
              <img src="../../assets/img/loading@2x.png" />
              <p>loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <mt-datetime-picker
      v-model="popupVisible"
      type="date"
      @confirm="handleConfirm"
      ref="picker"
      :startDate="startDate"
      :endDate="endDate"
    >
    </mt-datetime-picker>
  </div>
</template>
<script>
import numeral from "numeral";
import { apiGetBill } from "@api/api"; // 导入我们的api接口
import vHeader from "@/components/header/header";
import vContent from "@/components/noContent/noContent";
import vNetwork from "@/components/network/network";
import { Toast } from "mint-ui";
import util from "@js/util";
import BScroll from "better-scroll";
export default {
  data() {
    return {
      items: [],
      page: 1,
      date: "2018-3-31",
      moneyType: "USD", //币种
      isShow: false, //是否显示
      page_size: 10, //分页数据
      startDate: new Date("2020-01"), //日期最小值
      endDate: new Date(), //日期最大值
      popupVisible: new Date("2020-01"), //绑定日期
      income: "0.00", //收入
      payment: "0.00", //支出
      timeAll: util.formatDate(new Date(), "yyyy-MM"), //需要传的日期格式
      yaerDay: [
        util.formatDate(new Date(), "yyyy"),
        util.formatDate(new Date(), "MM")
      ], //要显示的日期格式
      allLoaded: false,
      a: null,
      flexS: false,
      isLoading: false,
      total: 0,
      statusArr: {
        "1": "兑换",
        "2": "充值",
        "3": "提现",
        "4": "转账",
        "5": "收款",
        "6": "手续费",
        "7": "提现失败"
      },
      moreDate: false
    };
  },
  mounted() {
    let that = this;
    that.getBills();
    that.$nextTick(() => {
      that.scroll = new BScroll(that.$refs.wrapper, {
        pullUpLoad: { threshold: -40 }, //上拉40px时加载数据
        click: true,
        probeType: 3,
        listenScroll: false,
        pullUpLoad: true,
        bounce: false,
        scrollEnd: true
      });
      that.scroll.on("scroll", pos => {
        if (pos.y < -50) {
          that.flexS = true;
        } else {
          that.flexS = false;
        }
      });
      // 上拉加载
      that.scroll.on("scrollEnd", () => {
        // that.$loading.close();
        that.isLoading = false;
        if (that.items.length < that.total) {
          that.isLoading = true;
          that.page++;
          that.getBills();
        } else {
          that.moreDate = true;
        }
      });
    });
  },
  methods: {
    getBills() {
      let that = this;
      if (that.page == 1) {
        that.$loading();
      }
      apiGetBill({
        query_time: that.timeAll,
        currency_type: that.moneyType.toLocaleLowerCase(),
        page: that.page,
        page_size: that.page_size
      }).then(res => {
        that.$loading.close();
        let list = res.data.data.datas;
        that.total = res.data.total;
        if (res.data.data.incom_sum == "" || res.data.data.incom_sum == "0") {
          that.income = "0";
        } else {
          that.income = res.data.data.incom_sum;
        }
        if (
          res.data.data.spending_sum == "" ||
          res.data.data.spending_sum == "0"
        ) {
          that.payment = "0";
        } else {
          that.payment = res.data.data.spending_sum;
        }
        if (list) {
          if (this.moneyType == "USD") {
            this.income = numeral(this.income || 0)
              .divide(100)
              .format("0,0.00");
            this.payment = numeral(this.payment || 0)
              .divide(100)
              .format("0,0.00");
          }
          for (let i = 0; i < list.length; i++) {
            list[i].create_time = util.formatDate(
              list[i].create_time,
              "yyyy-MM-dd hh:mm:ss"
            );
            if (list[i].currency_type === "usd") {
              list[i].amount = numeral(list[i].amount || 0)
                .divide(100)
                .format("0,0.00");
              list[i].balance = numeral(list[i].balance || 0)
                .divide(100)
                .format("0,0.00");
            }
            //        list[i].title = this.getTransType(list[i].reason);
          }
          if (that.page == 1) {
            that.items = list;
          } else {
            that.items = that.items.concat(list);
          }
        } else {
          that.isLoading = false;
        }
        // console.log(that.items)
      });
    },
    // tabClick: 切换币种
    tabClick(d) {
      this.moneyType = d;
      this.items = []
      this.page = 1;
      this.getBills();
    },
    // openModel:打开模态框
    openModel() {
      let that = this;
      that.$refs.picker.open();
      that.$nextTick(() => {
        that.$refs.picker.$el.getElementsByClassName(
          "picker-slot"
        )[2].style.display = "none";
      });
    },
    onItemClick(i) {
      // if (this.items[i].reason == "6") {
      //   this.$toast('手续费没有详情哦~')
      //   return;
        
      // }
      this.$router.push({
        path: "MessageList",
        query: { orderNo: this.items[i].order_no, log_no: this.items[i].log_no,symbolStatus: this.items[i].op_type,order_type:this.items[i].order_type}
      });
    },
    // 日期选择
    handleConfirm() {
      let that = this;
      that.yaerDay = [
        util.formatDate(this.popupVisible, "yyyy"),
        util.formatDate(this.popupVisible, "MM")
      ];
      that.timeAll = util.formatDate(this.popupVisible, "yyyy-MM");
      that.page = 1;
      that.items = [];
      that.moreDate = false;
      that.getBills();
    }
  },
  components: {
    vHeader,
    vContent,
    vNetwork
  },
  destroyed(){
    // this.flexS = false
  }
};
</script>
<style lang="scss" scoped>
body {
  // overflow:hidden
}
.bill {
  width: 100%;
  height: 100%;
  &-content {
    &-time {
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0 18px;
      height: 100px;
      background-color: #f7f8fa;
      // margin-top: 5px;
      &-text {
        &-year {
          width: 100px;
          &-left {
            color: $font-color;
            font-size: 14px;
            font-weight: 400;
          }
          &-right {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../assets/img/donw@2x.png") no-repeat;
            background-size: 100% 100%;
            margin-top: 5px;
          }
        }
        &-money {
          font-size: 14px;
          color: #444444;
          margin-top: 10px;
          &-left {
            margin-right: 10px;
          }
        }
      }
    }
    &-list {
      width: 100%;
      &-box {
        &::after {
          content: "";
          display: block;
          border-bottom: 1px solid $font-color;
          opacity: 0.1;
          @include menu-borderBottom;
        }
        &-content {
          display: flex;
          height: 70px;
          padding: 0 18px;
          align-items: center;
          // width: 100%;
          &-left {
            img {
              width: 26px;
              height: 26px;
            }
          }
          &-center {
            flex: 1;
            padding-left: 12px;
            text-align: left;
            &-name {
              font-size: 16px;
              color: $font-color;
              margin-bottom: 3px;
            }
            &-time {
              font-size: 10px;
              color: #bbbbbb;
            }
          }
          &-right {
            text-align: left;
            &-money {
              text-align: right;
              font-size: 16px;
              color: $btn-color;
              margin-bottom: 3px;
            }
            &-balance {
              font-size: 10px;
              color: $font-color;
              opacity: 0.75;
            }
          }
        }
      }
    }
  }
}
.mint-popup {
  width: 100%;
  .model-box {
    width: 100%;
    height: 330px;
    &-header {
      display: flex;
      align-items: center;
      height: 70px;
      div {
        flex: 1;
      }
      &-cancel {
        font-size: 14px;
        color: #333333;
        p {
          width: 50px;
          margin-left: 30px;
          padding: 10px 0;
        }
      }
      &-determine {
        font-size: 14px;
        font-weight: 400;
        color: $btn-color;
        p {
          width: 50px;
          margin-left: 30px;
          float: right;
          margin-right: 30px;
          padding: 10px 0;
        }
      }
    }
    &::after {
      content: "";
      display: block;
      width: 100%;
      border-bottom: 1px solid $font-color;
      opacity: 0.1;
      @include menu-borderBottom;
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
.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbbbbb;
  height: 40px;
  font-size: 16px;
}
</style>
