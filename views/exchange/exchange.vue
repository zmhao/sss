<template>
  <div class="exchange" ref="exchange">
    <v-header title="兑换"></v-header>
    <div class="exchange-content">
      <p class="sysbol">{{ $t("兑换类型") }}</p>
      <div class="exchange-content-sysbol">
        <div
          class="exchange-content-sysbol-left"
          @click="clickStyle"
          :class="checkD == 1 ? 'checkStyle' : ''">
          <span>USD</span>
          <img
            src="../../assets/img/arrow-b@2x.png"
            v-if="checkD == 1"
            alt=""
          />
          <img src="../../assets/img/arrow@2x.png" v-else alt="" />
          <span>KHR</span>
        </div>
        <div
          class="exchange-content-sysbol-right"
          @click="clickStyle"
          :class="checkD == 2 ? 'checkStyle' : ''"
        >
          <span>KHR</span>
          <img src="../../assets/img/arrow@2x.png" alt="" v-if="checkD == 1" />
          <img src="../../assets/img/arrow-b@2x.png" alt="" v-else />
          <span>USD</span>
        </div>
      </div>
      <div class="exchange-content-text">
        <span>{{ $t("汇率") }}</span>
        <span class="exchange-content-text-wenb" v-if="checkD == 1">{{
          "1USD=" + usd_to_khr + "KHR"
        }}</span>
        <span class="exchange-content-text-wenb" v-else>{{
          khr_to_usd + "KHR=1USD"
        }}</span>
      </div>
      <div class="exchange-content-inpTitle">{{ $t("兑换金额") }}</div>
      <div
        class="exchange-content-inp"
        :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'"
      >
        <p class="placeholder" @click="inputPsw" ref="input">
          {{ $t(inpPlaceholder) }}
        </p>
        <p class="simulation-inp" :class="inpShow == false ? '' : 'borderLfet'">
          {{ moneyNumber }}
        </p>
      </div>
      <div class="exchange-content-btn">
        <v-button
          btnText="确定"
          :disabledVal="disableVal"
          type="primary"
          @btnSubmit="exchangeSubmit"
        ></v-button>
      </div>
    </div>
    <!-- 金额输入键盘 -->
    <div ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @close="isPay = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
        :isPoint="isPoint"
      >
        <!-- 自定义支付动画 -->
        <div slot="loading-ani">
          <svg></svg>
        </div>
      </v-keyboard>
    </div>
    <!-- 支付框 -->
    <div class="exchange-payModal">
      <v-dialog
        :closeModel="modelVisible"
        :price="payMoney"
        :currency="currencyType"
        :list="transFer"
        :pswModel="false"
        @modelState="changeMedelFun"
        @enterPswFun="enterPswFun"
        :isVal="isVal"
      ></v-dialog>
    </div>
    <!-- 设置密码 -->
    <v-settingPsw
      :popupPsw="settingPswFlag"
      @cancelFun="settingPswCancel"
      @settingFun="succeeFun"
    ></v-settingPsw>
  </div>
</template>
<script>
import { apiExChang, apiExChangRate, apiFindTradeRate } from "@api/api"; // 导入我们的api接口
import vHeader from "@/components/header/header";
import vButton from "@/components/button/button";
import vKeyboard from "@/components/keyboard/keyboard";
import vSettingPsw from "@/components/settingPsw/settingPsw";
import vDialog from "@/components/dialog/dialog";
import md5 from "md5";
import sha1 from "sha1";
import global, { PASSWORDSIGN } from "@views/common/global";
import { getTime, randomStr } from "@js/util";
export default {
  data() {
    return {
      radio1: "USD→KHR",
      input: "",
      amount: "",
      rate: "0",
      balance: "",
      rateType: [],
      khr_to_usd: "",
      usd_to_khr: "",
      checkD: 1, // 切换货币按钮样式，控制颜色
      disableVal: true, //是否禁用按钮
      moneyNumber: "", //输入的金额
      inpPlaceholder: "请输入兑换金额", // inpu提示语
      inpShow: false, //是否显示提示语
      isPay: false, // 控制键盘隐藏
      modelVisible: false, // 控制转账界面
      payMoney: "", //金额
      currencyType: "usd", //币种
      transFer: [],
      isPoint: ".", //键盘小数点
      settingPswFlag: false, //控制是否显示设置密码框
      isVal: 0
    };
  },
  mounted() {
    let that = this;
    apiExChangRate({}).then(res => {
      this.khr_to_usd = res.data.data.khr_to_usd;
      this.usd_to_khr = res.data.data.usd_to_khr;
    });

    that.$refs.exchange.addEventListener("click", function(e) {
      let ele = e.target;
      let inp = that.$refs.input;
      let keyboard = that.$refs.keyboard;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow = true;
        that.isPay = true;
        if (!that.moneyNumber) {
          that.inpPlaceholder = "请输入兑换金额";
        }
      } else {
        that.inpShow = false;
        that.isPay = false;
        if (!that.moneyNumber) {
          that.inpPlaceholder = "请输入兑换金额";
        }
      }
    });
  },
  methods: {
    // clickStyle :切换样式
    clickStyle() {
      if (this.checkD == 1) {
        this.checkD = 2;
        this.isPoint = "";
        this.moneyNumber = "";
      } else {
        this.checkD = 1;
        this.isPoint = ".";
        this.moneyNumber = "";
      }
    },
    // exchangeSubmit:按钮点击事件
    exchangeSubmit() {
      if (this.moneyNumber == "") {
        this.$toast("请输入兑换金额");
        return;
      }
      let amount = "";
      let type = "";
      let that = this;
      if (this.checkD == 1) {
        amount = this.moneyNumber * 100;
        type = 12;
      } else {
        amount = this.moneyNumber;
        type = 13;
      }
      this.$loading();
      apiFindTradeRate({
        amount: amount,
        type: type
      }).then(res => {
        console.log(res);
        if (res.status == 200) {
          let rate = res.data.data.rate / 10000;
          let fer = res.data.data.fees / 100;
          if (this.currencyType === "khr") {
            fer = res.data.data.fees;
          }
          let dialogData = [
            { name: "兑换手续费", price: fer },
            { name: "费率", price: rate + "%" }
          ];
          that.transFer = dialogData;
          that.modelVisible = true;
          that.$loading.close();
        } else {
          if (res.retcode == "AA300086" && res.status == 500) {
            that.settingPswFlag = true;
          }else{
            that.$toast(res.msg)
          }
        }
      });
    },
    // inputPsw: 输入金额
    inputPsw() {
      this.inpShow = true;
    },
    // 键盘输入金额
    moneyFun(d) {
      let that = this;
      // that.moneyNumber += d.val;
      if (that.moneyNumber.length == "" && d.val == ".") {
        that.moneyNumber = "0.";
      }
      if (that.moneyNumber.indexOf(".") != -1) {
        if (d.val == ".") {
        } else {
          that.moneyNumber += d.val;
        }
      } else {
        that.moneyNumber += d.val;
      }
      if (that.moneyNumber) {
        that.disableVal = false;
      }
      that.inpPlaceholder = "";
    },
    // 删除金额
    deleteFun() {
      let that = this;
      if (that.moneyNumber) {
        that.moneyNumber = that.moneyNumber.substring(
          0,
          that.moneyNumber.length - 1
        );
      }
      if (!that.moneyNumber) {
        that.disableVal = true;
      }
    },
    // changeMedelFun:接收回传状态
    changeMedelFun(d) {
      this.modelVisible = d;
      // this.closeModel = d
    },
    // enterPswFun:输入密码
    enterPswFun(d) {
      let pwd = "";
      let inType = "";
      let outType = "";
      let that = this
      for (let i = 0; i < d.length; i++) {
        pwd = pwd + "" + d[i];
      }
      let noStr = randomStr(16, false);
      let money = "";
      if (that.checkD === 1) {
        money = this.moneyNumber * 100;
        inType = "usd";
        outType = "khr";
      } else {
        money = this.moneyNumber;
        inType = "khr";
        outType = "usd";
      }
      that.$loading();
      apiExChang({
        in_type: inType,
        out_type: outType,
        amount: money,
        password: md5(
          md5(
            sha1(pwd).toLocaleLowerCase() + PASSWORDSIGN
          ).toLocaleLowerCase() + noStr
        ).toLocaleLowerCase(),
        non_str: noStr
      }).then(res => {
        if(res.status == 200){
          that.modelVisible = false;
          that.$router.replace({
            path:'/transSucc',
            query: {
              title: '兑换',
              text: "兑换成功"
            }
          })
        }else{
          that.isVal++
          that.$toast(res.msg)
        }
        that.$loading.close();
      });
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
    vButton,
    vKeyboard,
    vDialog,
    vSettingPsw
  },
  beforeDestroy(){
     this.$refs.exchange.removeEventListener('click',function(){
     },false)
  },

};
</script>
<style lang="scss" scoped>
.exchange {
  height: 100%;
  &-content {
    padding: 0 18px;
    .sysbol {
      font-size: 16px;
      color: $font-color;
      text-align: left;
      margin: 30px 0 20px 0;
    }
    &-sysbol {
      display: flex;
      div {
        width: 124px;
        border-radius: 4px;
        height: 30px;
        // background-color: #bbbbbb;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #bbbbbb;
        border: 1px solid rgba(187, 187, 187, 1);
        img {
          width: 13px;
          height: 10px;
          margin: 0 5px;
        }
      }
      &-left {
        margin-right: 0.32rem;
      }
      &-right {
        // background-color: #bbbbbb;
      }
      .checkStyle {
        background: #ec9018;
        color: #fff;
        border: none;
        height: 32px;
      }
    }
    &-text {
      font-size: 16px;
      color: $font-color;
      margin: 24px 0;
      text-align: left;
      &-wenb {
        font-weight: bold;
        margin-left: 10px;
      }
    }
    &-inpTitle {
      font-size: 16px;
      color: $font-color;
      text-align: left;
      font-weight: 400;
      margin-bottom: 24px;
    }
    &-inp {
      position: relative;
      text-align: left;
      input {
        width: 100%;
        outline: none;
        font-size: 20px;
      }

      .placeholder {
        height: 30px;
        margin: 0;
        font-size: 20px;
        color: #bbbbbb;
        background: rgba(0, 0, 0, 0);
      }
      .simulation-inp {
        position: absolute;
        top: 3px;
        margin: 0;
        font-size: 20px;
        min-width: 1px;
        min-height: 23px;
        color: $btn-color;
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
    }
    .bottomBorderC {
      &::after {
        content: "";
        display: block;
        position: absolute;
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
        display: block;
        border-bottom: 2px solid $btn-color;
        margin-top: 5px;
        width: 100%;
        bottom: 0;
        @include menu-borderBottom;
      }
    }
    &-btn {
      margin-top: 50px;
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
  }
}
</style>
