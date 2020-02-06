<template>
  <!-- 提现界面 -->
  <div class="recharge" @click="downKey">
    <div class="recharge-header">
      <v-header
        title="提现"
      ></v-header>
    </div>
    <div class="recharge-content">
      <p class="recharge-content-title">{{ $t("提现金额") }}</p>
      <div class="recharge-content-inp">
        <p class="recharge-content-inp-drop" @click="closeFun">
          <span
            :style="{ 'font-size': currencyName == '$' ? '24px' : '30px' }"
            >{{ $t(currencyName) }}</span
          >
          <img src="../../assets/img/donw@2x.png" alt="" />
        </p>
        <input
          type="text"
          maxlength="11"
          class="input__inner"
          minlength="9"
          ref="scanTextbox"
          @focus="openKey"
          oninput="value=value.replace(/[^\d]/g,'')"
          :placeholder="$t('请输入金额')"
          v-model="moneyNuber"
        />
      </div>
      <v-currency
        :actions="currencyData"
        :sheetVisible="mobileFlag"
        @closeChange="rechargeFun"
      ></v-currency>
    </div>
    <div class="recharge-type">
      <div class="recharge-type-box">
        <div class="recharge-type-box-title">{{ $t("提现方式") }}</div>
        <div class="recharge-type-box-way">{{ $t("线下网点圈存") }}</div>
      </div>
      <div class="recharge-type-way">
        <div class="recharge-type-way-text">{{$t('单笔限额$10000.00')}}</div>
      </div>
    </div>
    <div class="recharge-btn">
      <v-btn
        btnText="充值"
        :disabledVal="disableVal"
        type="primary"
        @btnSubmit="rechargeSubmit"
      ></v-btn>
    </div>
    <!-- 输入金额键盘 -->
    <div class="recharge-keyboard" ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @pas-end="pasEnd"
        @close="isPay = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
      >
        <!-- 自定义支付动画 -->
        <div slot="loading-ani">
          <svg></svg>
        </div>
      </v-keyboard>
    </div>
    <!-- 支付模态框 -->
    <div class="recharge-payModal">
      <v-dialog
        :closeModel="modelVisible"
        :price="moneyNuber"
        :currency="currencyType"
        :list="transFer"
        @modelState="changeMedelFun"
        @enterPswFun="enterPswFun"
      ></v-dialog>
    </div>
  </div>
</template>
<script>
import { apiTransfer, apiFindTradeRate } from "@api/api";
import storages from "@views/cache/cache";
import global, { PASSWORDSIGN } from "@views/common/global";
import { getTime, randomStr } from "@js/util";
import vHeader from "@/components/header/header";
import vCurrency from "@/components/currency/currency";
import vBtn from "@/components/button/button";
import vKeyboard from "@/components/keyboard/keyboard";
import vDialog from "@/components/dialog/dialog";
import md5 from "md5";
import sha1 from "sha1";

export default {
  data() {
    return {
      radio1: "USD",
      input: "",
      amount: "0.00",
      moneyNuber: "", // 金额
      transFer: [],
      currencyData: [
        { name: "币种", method: "" },
        { name: "USD", method: this.currencyFun1 },
        { name: "KHR", method: this.currencyFun2 }
      ], // 弹框数据
      currencyName: "$", // 币种初始值
      currencyType: "usd",
      mobileFlag: false, // 控制弹框
      disableVal: true, // 是否禁用按钮
      isPay1: false, // 控制手机号码键盘
      isPay: false, // 控制金额键盘显示与隐藏
      timer: null, // 清定时器
      modelVisible: false // 控制转账界面
    };
  },
  created() {
    storages.set(global.TRANS_HISTORY);
  },
  mounted() {},
  watch: {
    moneyNuber() {
      this.changeDisabled();
    }
  },
  methods: {
    transBtn() {},
    // closeFun:关闭弹框
    closeFun() {
      let that = this;
      if (that.mobileFlag == false) {
        that.mobileFlag = true;
      } else {
        that.mobileFlag = false;
      }
    },
    // currencyFun1:选择美元的函数
    currencyFun1() {
      this.currencyName = "$";
      this.currencyType = "usd";
    },
    // currencyFun2:选择其他币种
    currencyFun2() {
      this.currencyName = "៛";
      this.currencyType = "khr";
    },
    // rechargeFun:通知父组件状态函数
    rechargeFun(d) {
      this.mobileFlag = d;
    },
    // changeDisabled：是否禁用按钮
    changeDisabled() {
      let that = this;
      if (that.moneyNuber) {
        that.disableVal = false;
      } else {
        that.disableVal = true;
      }
    },
    pasEnd(val) {
      // console.log(val); //得到密码 可能会进行一些加密动作
      setTimeout(() => {
        // 模拟请求接口验证密码中 ..
        if (val === "111111") {
          // 密码正确
          this.$refs.pay.$payStatus(true); // 拿到子组件的事件
        } else {
          this.$refs.pay.$payStatus(false);
        }
      }, 1000);
    },
    // downKey: 关闭键盘
    downKey(e) {
      let that = this;
      let ele = e.target;
      let elementKey = that.$refs.keyboard;
      let inp = that.$refs.scanTextbox;
      let elementKey1 = that.$refs.keyboard1;
      let inp1 = that.$refs.scanTextbox1;
      // 关闭金额键盘
      if (that.isPay == true) {
        if (inp.contains(ele) || elementKey.contains(ele)) {
        } else {
          that.isPay = false;
        }
      }

      // 关闭手机键盘
      if (that.isPay1 == true) {
        if (inp1.contains(ele) || elementKey1.contains(ele)) {
        } else {
          that.isPay1 = false;
        }
      }
    },
    // moneyFun:输入金额
    moneyFun(d) {
      let that = this;
      if (that.moneyNuber.length == "" && d.val == ".") {
        that.moneyNuber = "0.";
      }
      if (that.moneyNuber.indexOf(".") != -1) {
        if (d.val == ".") {
        } else {
          that.moneyNuber += d.val;
        }
      } else {
        that.moneyNuber += d.val;
      }
      that.$nextTick(() => {
        if (that.timer) {
          clearTimeout(that.timer);
        }
        setTimeout(() => {
          that.$refs.scanTextbox.focus();
        }, 200);
      });
    },
    pasEnd() {},
    // deleteFun：删除金额输入
    deleteFun() {
      let that = this;
      if (that.moneyNuber) {
        that.moneyNuber = that.moneyNuber.substring(
          0,
          that.moneyNuber.length - 1
        );
      }
      that.$nextTick(() => {
        if (that.timer) {
          clearTimeout(that.timer);
        }
        setTimeout(() => {
          that.$refs.scanTextbox.focus();
        }, 200);
      });
    },
    // openKek: 打开金额键盘
    openKey() {
      // document.activeElement.blur()
      this.$refs.scanTextbox.setAttribute("readonly", "readonly");
      setTimeout(() => {
        this.$refs.scanTextbox.removeAttribute("readonly");
      }, 200);
      this.isPay = true;
    },
    // rechargeSubmit:转账事件
    rechargeSubmit() {
      if (this.moneyNuber === "") {
        this.$toast("请输入转账金额");
        return;
      }
      let money = "";
      let type = "";
      if (this.currencyType === "usd") {
        money = this.moneyNuber * 100;
        type = 2;
      } else {
        money = this.moneyNuber;
        type = 7;
      }
      this.$loading();
      apiFindTradeRate({
        amount: money,
        type: type
      }).then(res => {
        this.$loading.close();
        let rate = res.data.data.rate / 10000;
        let fer = res.data.data.fees / 100;
        if (this.currencyType === "khr") {
          fer = res.data.data.fees;
        }
        let dialogData = [
          { name: "转账手续费", price: fer },
          { name: "费率", price: rate + "%" }
        ];
        this.transFer = dialogData;
        this.modelVisible = true;
      });
    },
    // changeMedelFun:接收回传状态
    changeMedelFun(d) {
      this.modelVisible = d;
    },
    // 密码输入完毕
    enterPswFun(d) {
      let pwd = "";
      for (let i = 0; i < d.length; i++) {
        pwd = pwd + "" + d[i];
      }
      let noStr = randomStr(16, false);
      let money = this.moneyNuber;
      if (this.currencyType === "usd") {
        money = this.moneyNuber * 100;
      }
      this.$loading();
      // apiTransfer({
      //   money_type: this.currencyType.toLocaleLowerCase(),
      //   to_phone: this.message,
      //   amount: money,
      //   exchange_type: 1,
      //   password: md5(
      //     md5(
      //       sha1(pwd).toLocaleLowerCase() + PASSWORDSIGN
      //     ).toLocaleLowerCase() + noStr
      //   ).toLocaleLowerCase(),
      //   non_str: noStr,
      //   bill_no: "t" + storages.get(global.USERINFO).gen_key + getTime()
      // }).then(res => {
      //   this.$loading.close();
      //   console.log(res);
      //   this.modelVisible = false;
      //   this.$router.go(-1);
      // });
    },
    callBackClick() {
      this.$router.go(-1);
    }
  },
  components: {
    vHeader,
    vCurrency,
    vBtn,
    vKeyboard,
    vDialog
  }
};
</script>
<style lang="scss" scoped>
.recharge {
  height: 100%;
  &-content {
    padding: 0 18px;
    &-title {
      font-size: 16px;
      color: $font-color;
      font-weight: 400;
      text-align: left;
      margin: 35px 0 5px 0;
    }
    &-inp {
      display: flex;
      height: 50px;
      width: 100%;
      margin: 0 auto;
      // justify-content: center;
      align-items: center;
      border-bottom: 1px solid #eae9e9;
      .input__inner {
        color: $font-color;
        width: 60%;
        font-size: 20px;
        outline: none;
        flex: 1;
      }
      &-img {
        width: 50px;
        text-align: right;
        img {
          width: 24px;
          height: 26px;
          float: right;
          margin-right: 10px;
        }
      }
      &-drop {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: $font-color;
        img {
          width: 14px;
          height: 14px;
          margin: 0 5px;
        }
      }
    }
    &-prompt {
      font-size: 15px;
      font-weight: 400;
      color: #666666;
      line-height: 21px;
      margin-top: 7px;
      text-align: left;
    }
  }
  &-btn {
    margin-top: 50px;
  }
  &-type {
    padding: 0 18px;
    &-box {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: $font-color;
      margin: 20px 0;
      &-title {
        width: 78px;
        text-align: left;
      }
    }
    &-way{
      padding-left: 78px;
      text-align: left;
      font-size: 15px;
      color: #bbbbbb;
    }
  }
}
</style>
