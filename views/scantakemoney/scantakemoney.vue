<template>
  <div class="trans" ref="trans">
    <div class="trans-header">
      <v-header title="提现"></v-header>
    </div>
    <div class="trans-content">
      <p class="trans-content-title">{{ $t("提现金额") }}</p>
      <div class="trans-content-inp" :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'">
        <div class="trans-content-inp-drop" @click="closeFun">
          <span
            :style="{ 'font-size': currencyName == '$' ? '24px' : '30px' }"
          >{{ $t(currencyName) }}</span>
          <img src="../../assets/img/donw@2x.png" alt />
        </div>
        <div class="trans-content-inp-box">
          <p class="placeholder" @click="inputPsw" ref="inp">{{ $t(inpPlaceholder) }}</p>
          <p class="simulation-inp" :class="inpShow == false ? '' : 'borderLfet'">{{ moneyNuber }}</p>
        </div>
      </div>
      <div class="trans-content-amount" @click="allTake()">
        <p class="trans-content-amount-balance">{{ $t("当前余额:") + balance + ", " }}</p>
        <p class="trans-content-amount-take">&nbsp{{ $t("全部提现") }}</p>
      </div>
    </div>

    <div class="trans-btn">
      <v-btn btnText="确定" :disabledVal="disableVal" type="primary" @btnSubmit="transSubmit"></v-btn>
    </div>
    <!-- 输入金额键盘 -->
    <div class="trans-keyboard" ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @pas-end="pasEnd"
        @close="isPay = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
        :isPoint="isPoint"
      >
        <!-- 自定义支付动画 -->
        <div slot="loading-ani">
          <svg />
        </div>
      </v-keyboard>
    </div>
    <!-- 支付模态框 -->
    <div class="trans-payModal">
      <v-dialog
        :closeModel="modelVisible"
        :account="message"
        :price="moneyNuber"
        :currency="currencyType"
        :list="transFer"
        @modelState="changeMedelFun"
        @enterPswFun="enterPswFun"
        :isVal="psd"
      ></v-dialog>
    </div>
    <!-- 币种弹框 -->
    <v-currency :actions="currencyData" :sheetVisible="mobileFlag" @closeChange="transFun"></v-currency>
    <!-- 设置密码 -->
    <v-settingPsw :popupPsw="settingPswFlag" @cancelFun="settingPswCancel" @settingFun="succeeFun"></v-settingPsw>
  </div>
</template>
<script>
import {
  apiScanTrans,
  apiFindTradeRate,
  apiScanTakeMoney,
  apiModifyScanCode,
  apiremains,
  apiTransfer
} from "@api/api";
import storages from "@views/cache/cache";
import global, { PASSWORDSIGN } from "@views/common/global";
import { getTime, randomStr } from "@js/util";
import vHeader from "@/components/header/header";
import vCurrency from "@/components/currency/currency";
import vBtn from "@/components/button/button";
import vKeyboard from "@/components/keyboard/keyboard";
import vDialog from "@/components/dialog/dialog";
import vSettingPsw from "@/components/settingPsw/settingPsw";
import md5 from "md5";
import sha1 from "sha1";
import numeral from "numeral";

export default {
  data() {
    return {
      radio1: "USD",
      input: "",
      amount: "0.00",
      message: "", // 转账账户
      moneyNuber: "", // 金额
      balance: "0.00", //当前显示的余额
      amount_usd: "0.00", //usd余额
      amount_khr: "0", //khr余额
      transFer: [],
      qrCode: "",
      currencyData: [
        { name: this.$t("币种"), method: "" },
        { name: "USD", method: this.currencyFun1 },
        { name: "KHR", method: this.currencyFun2 }
      ], // 弹框数据
      currencyName: "$", // 币种初始值
      currencyType: "usd",
      takeType: 1,
      mobileFlag: false, // 控制弹框
      disableVal: true, // 是否禁用按钮
      isPay1: false, // 控制手机号码键盘
      isPay: false, // 控制金额键盘显示与隐藏
      timer: null, // 清定时器
      modelVisible: false, // 控制转账界面
      diasabledInput: false, //输入框是否可选
      popdiasabke: false, //币种是否可选
      inpShow: false, //切换样式
      inpPlaceholder: "请输入金额",
      settingPswFlag: false,
      psd: 0,
      isPoint: "."
    };
  },
  created() {
    let slef = this;
    if (slef.$route.query.code) {
      slef.$route.query.code = slef.$route.query.code;
      this.$loading();
      apiModifyScanCode({
        gen_key: slef.qrCode,
        status: 2
      }).then(res => {
        this.$loading.close();
        // slef.message = res.data.data.recv_phone;
      });
    }
    // if (slef.$route.query.code) {
    //   slef.qrCode = slef.$route.query.code;
    //   this.$loading();
    //   apiScanTrans({
    //     code: slef.qrCode
    //   }).then(res => {
    //     console.log(res);
    //     slef.$loading.close();
    //     slef.message = res.data.data.recv_phone;
    //   });
    // }
  },
  mounted() {
    let slef = this;
    slef.oninput();
    slef.getBalance();
  },
  watch: {
    moneyNuber() {
      this.changeDisabled();
    }
  },
  methods: {
    getBalance() {
      let self = this;
      //获取余额
      apiremains({ id: 11 }).then(res => {
        if (typeof res.data.data.usd !== "undefined") {
          self.amount_usd = numeral(res.data.data.usd || 0)
            .divide(100)
            .format("00.00");
        }
        if (typeof res.data.data.khr !== "undefined") {
          self.amount_khr = res.data.data.khr;
        }
        self.balance = self.amount_usd;
      });
    },
    // 键盘显示与关闭
    oninput() {
      let that = this;
      that.$refs.trans.addEventListener("click", function(e) {
        let ele = e.target;
        let inp = that.$refs.inp;
        let keyboard = that.$refs.keyboard;
        if (inp.contains(ele) || keyboard.contains(ele)) {
          that.inpShow = true;
          that.isPay = true;
          if (!that.moneyNuber) {
            that.inpPlaceholder = "请输入金额";
          }
        } else {
          that.inpShow = false;
          that.isPay = false;
          if (!that.moneyNuber) {
            that.inpPlaceholder = "请输入金额";
          }
        }
      });
    },
    transBtn() {},
    // closeFun:关闭弹框
    closeFun() {
      if (this.popdiasabke) {
        return;
      }
      let that = this;
      if (that.mobileFlag == false) {
        that.mobileFlag = true;
      } else {
        that.mobileFlag = false;
      }
    },
    // currencyFun1:选择美元的函数
    currencyFun1() {
      if (this.currencyType == "usd") {
        return;
      }
      this.currencyName = "$";
      this.currencyType = "usd";
      this.moneyNuber = "";
      this.inpPlaceholder = "请输入金额";
      this.isPoint = ".";
      this.balance = this.amount_usd;
    },
    // currencyFun2:选择其他币种
    currencyFun2() {
      if (this.currencyType == "khr") {
        return;
      }
      this.currencyName = "៛";
      this.currencyType = "khr";
      this.inpPlaceholder = "请输入金额";
      this.moneyNuber = "";
      this.isPoint = "";
      this.balance = this.amount_khr;
    },
    // transFun:通知父组件状态函数
    transFun(d) {
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
    allTake() {
      this.moneyNuber = this.balance;
      this.takeType = 2;
      this.inpPlaceholder = "";
      // this.getReat();
    },
    // onAddressBook:打开通讯录
    onAddressBook() {
      this.$router.push("/communication");
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
    // moneyFun:输入金额
    moneyFun(d) {
      let that = this;
      if (that.moneyNuber.length == "" && d.val == ".") {
        that.moneyNuber = "0.";
      }
      if (that.moneyNuber.indexOf(".") != -1 && that.moneyNuber.length < 14) {
        if (d.val == ".") {
        } else {
          that.moneyNuber += d.val;
        }
      } else {
        if (that.moneyNuber.length < 14) {
          that.moneyNuber += d.val;
        }
      }
      that.inpPlaceholder = "";
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
    },
    // transSubmit:转账事件
    transSubmit() {
      var x = String(this.moneyNuber).indexOf(".") + 1; //小数点的位置
      var y = String(this.moneyNuber).length - x; //小数的位数
      if (y > 2) {
        this.$toast("请输入正确的取款金额");
        return;
      }
      this.getReat();
    },
    getReat() {
      let that = this;
      if (that.moneyNuber == "") {
        that.$toast("请输入提现金额");
        return;
      }
      let money = "";
      let type = "";
      if (that.currencyType === "usd") {
        money = this.moneyNuber * 100;
        type = 6;
      } else {
        money = that.moneyNuber;
        type = 11;
      }
      that.$loading();
      apiFindTradeRate({
        amount: money,
        type: type
      }).then(res => {
        that.$loading.close();
        if (res.status == 200) {
          let rate = res.data.data.rate / 10000;
          let fer = res.data.data.fees / 100;
          if (that.currencyType === "khr") {
            fer = res.data.data.fees;
          }
          let dialogData = [
            { name: "转账手续费", price: fer },
            { name: "费率", price: rate + "%" }
          ];
          that.modelVisible = true;
          that.transFer = dialogData;
        } else {
          that.settingPswFlag = true;
        }
      });
    },
    // changeMedelFun:接收回传状态
    changeMedelFun(d) {
      this.modelVisible = d;
    },
    // 密码输入完毕
    enterPswFun(d) {
      let pwd = "";
      let that = this;
      for (let i = 0; i < d.length; i++) {
        pwd = pwd + "" + d[i];
      }
      let noStr = randomStr(16, false);
      let money = that.moneyNuber;
      if (that.currencyType === "usd") {
        money = money.toString().replace(".", "");
      }
      if (this.balance != this.moneyNuber) {
        this.takeType = 1;
      }
      that.$loading();
      apiScanTakeMoney({
        money_type: that.currencyType.toLocaleLowerCase(),
        gen_code: that.$route.query.code,
        amount: money,
        swithdraw_type: that.takeType,
        password: md5(
          md5(
            sha1(pwd).toLocaleLowerCase() + PASSWORDSIGN
          ).toLocaleLowerCase() + noStr
        ).toLocaleLowerCase(),
        non_str: noStr
      }).then(res => {
        that.$loading.close();
        if (res.status == 200) {
          that.modelVisible = false;
          that.$router.replace({
            path: "/transSucc",
            query: {
              title: "提现",
              text: "提现申请提交成功"
            }
          });
        } else {
          that.$toast(res.msg);
          that.psd++;
        }
      });
    },
    // 点击输入框
    inputPsw() {
      let that = this;
      that.inpShow = true;
    },
    // settingPswCancel:设置密码组件回传值
    settingPswCancel() {
      this.settingPswFlag = false;
    },
    // succeeFun：设置密码组件点击前往设置
    succeeFun() {
      this.$router.replace("/updatepaymentpwd");
    }
  },
  components: {
    vHeader,
    vCurrency,
    vBtn,
    vKeyboard,
    vDialog,
    vSettingPsw
  }
};
</script>
<style lang="scss" scoped>
.trans {
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
    &-amount {
      padding: 5px 0;
      display: flex;
      align-items: center;
      &-balance {
        font-size: 13px;
        color: rgba(153, 153, 153, 1);
      }
      &-take {
        font-size: 13px;
        color: rgba(24, 124, 236, 1);
      }
    }
    &-in {
      margin-top: 20px;
      display: flex;
      align-items: left;
      justify-items: center;
      &-title {
        font-size: 16px;
        color: $font-color;
        font-weight: 400;
        text-align: left;
        margin: 35px 20px 5px 0;
      }
      &-account {
        font-size: 18px;
        color: #444444;
        font-weight: 400;
        text-align: left;
        margin: 35px 0 5px 0;
      }
    }
    &-inp {
      position: relative;
      text-align: left;
      display: flex;
      height: 35px;
      &-box {
        flex: 1;
      }
      .placeholder {
        height: 30px;
        margin: 0;
        font-size: 20px;
        color: #bbbbbb;
        background: rgba(0, 0, 0, 0);
        display: flex;
        align-items: center;
      }
      .simulation-inp {
        position: absolute;
        top: 3px;
        margin: 0;
        font-size: 20px;
        // z-index: 9999999;
        min-width: 1px;
        min-height: 23px;
        color: $btn-color;
      }
      &-drop {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: $font-color;
        height: 28px;
        padding: 0 5px;
        img {
          width: 14px;
          height: 14px;
          margin: 0 5px;
        }
      }
      .borderLfet {
        &::after {
          content: "";
          display: block;
          height: 100%;
          // border-left: 1px solid $btn-color;
          position: absolute;
          top: 0;
          right: -2px;
          width: 2px;
          animation: dong 0.5s infinite 0s ease-in-out alternate;
        }
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
}
.bottomBorderC {
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    border-bottom: 1px solid $font-color;
    opacity: 0.1;
    margin-top: 5px;
    width: 100%;
    @include menu-borderBottom;
  }
}
.bottomBorderB {
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    display: block;
    border-bottom: 2px solid $btn-color;
    margin-top: 5px;
    width: 100%;
    @include menu-borderBottom;
  }
}
@keyframes dong {
  0% {
    background-color: #fff;
  }
  100% {
    background-color: $btn-color;
    border-radius: 1px;
  }
}
</style>
