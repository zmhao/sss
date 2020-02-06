<template>
  <div>
    <div class="billDetails">
      <div class="billDetails-header">
        <v-header title="账单详情"></v-header>
      </div>
      <div class="billDetails-content">
        <div class="billDetails-content-money">{{ bill.amount }}</div>
        <div class="billDetails-content-status">
          <p>
            <!-- 兑换 -->
            <img
              v-if="transType == 1"
              src="../../assets/img/msgExchang@2x.png"
            />
            <img
              v-if="transType == 2"
              src="../../assets/img/top-upicon@2x.png"
            />
            <!--提现 -->
            <img
              v-if="transType == 3"
              src="../../assets/img/withdrawalicon@2x.png"
            />
            <!--转账 -->
            <img
              v-if="transType == 4"
              src="../../assets/img/transfericon@2x.png"
            />
            <!--收款 -->
            <img
              v-if="transType == 5"
              src="../../assets/img/collectionicon@2x.png"
            />
          </p>
          <div>
            {{ $t(`${order[bill.order_status]}`) }}
          </div>
        </div>
      </div>
      <div class="billDetails-list">
        <div class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("付款方式") }}</div>
          <div class="billDetails-list-li-right">
            {{ payType[bill.payment_type] }}
          </div>
        </div>
        <div v-if="transType == 4" class="billDetails-list-li">
          <div class="billDetails-list-li-left">
            {{ op_type == "1" ? $t("收款方") : $t("付款方") }}
          </div>
          <div class="billDetails-list-li-right">
            {{ op_type == "1" ? bill.to_phone : bill.from_phone }}
          </div>
        </div>
        <div v-if="transType == 1" class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("兑换类型") }}</div>
          <div class="billDetails-list-li-right">
            {{ bill.in_type + "→" + bill.out_type }}
          </div>
        </div>
        <div v-if="transType == 1" class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("兑换金额") }}</div>
          <div class="billDetails-list-li-right">
            {{ bill.amount }}
          </div>
        </div>
        <div v-if="transType == 1" class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("到账金额") }}</div>
          <div class="billDetails-list-li-right">
            {{ bill.trans_amount }}
          </div>
        </div>
        <div class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("服务费") }}</div>
          <div class="billDetails-list-li-right">{{ bill.fees }}</div>
        </div>
        <div class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("交易类型") }}</div>
          <div class="billDetails-list-li-right">
            {{ orderType[transType] }}
          </div>
        </div>
        <div class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("创建时间") }}</div>
          <div class="billDetails-list-li-right">
            {{ bill.create_time }}
          </div>
        </div>
        <div class="billDetails-list-li">
          <div class="billDetails-list-li-left">{{ $t("订单号") }}</div>
          <div class="billDetails-list-li-right">
            {{ orderNo }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/header/header";
import { apiGetBillDetail } from "@api/api";
import numeral from "numeral";
import util from "@js/util";
export default {
  data() {
    return {
      loginNo: "",
      payType: ["未知", "现金", "余额"],
      orderType: ["未知", "兑换", "充值", "提现", "转账", "收款"],
      order: [
        "",
        "交易中",
        "交易中",
        "交易成功",
        "交易失败",
        "交易中",
        "交易失败"
      ],
      bill: "",
      transType: 0,
      orderNo: 0,
      op_type: ""
    };
  },
  mounted() {
    let log_no = this.$route.query.logNo;
    // let
    this.orderNo = this.$route.query.orderNo;
    this.transType = this.$route.query.order_type;
    this.op_type = this.$route.query.symbolStatus;
    if (this.transType == "7") {
      this.transType = "3";
    }
    this.getData(this.orderNo, this.transType, log_no);
  },
  methods: {
    getData(order_no, type, logNo) {
      this.$loading();
      apiGetBillDetail({
        log_no: logNo,
        order_type: type,
        order_no: order_no
      }).then(res => {
        this.$loading.close();
        let order = res.data.data;
        if (res.status == 200 && order) {
          if (order.balance_type == "usd") {
            order.create_time = util.formatDate(
              order.create_time,
              "yyyy-MM-dd hh:mm:ss"
            );
            order.fees =
              "$" +
              numeral(order.fees || 0)
                .divide(100)
                .format("0,0.00");
            order.amount =
              "$" +
              numeral(order.amount || 0)
                .divide(100)
                .format("0,0.00");
          } else {
            order.amount = "៛" + order.amount;
            order.create_time = util.formatDate(
              order.create_time,
              "yyyy-MM-dd hh:mm:ss"
            );
            console.log(order.amount);
            order.fees = "៛" + order.fees;
          }
          if (order.out_type == "usd") {
            order.trans_amount =
              "$" +
              numeral(order.trans_amount || 0)
                .divide(100)
                .format("0,0.00");
          } else {
            order.trans_amount = "៛" + order.trans_amount;
          }
          this.bill = order;
        }else{
          this.$toast(res.msg)
        }
      });
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss" scoped>
.billDetails {
  height: 100%;
  width: 100%;
  &-content {
    margin: 30px 0 50px 0;
    &-money {
      color: $font-color;
      font-size: 36px;
      font-weight: bold;
    }
    &-status {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: $font-color;
      margin: 10px 0;
      p {
        img {
          width: 24px;
          height: 24px;
        }
      }
      span {
        opacity: 0.75;
        margin-left: 7px;
      }
    }
  }
  &-list {
    padding: 0 18px;
    &-li {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      height: 40px;
      &-left {
        color: #999999;
        text-align: left;
        min-width: 80px;
      }
      &-right {
        flex: 1;
        color: $font-color;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
