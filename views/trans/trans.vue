<template>
  <div class="trans" ref="trans">
    <div class="trans-header">
      <v-header title="转账" :callBack="true"></v-header>
    </div>
    <div class="trans-content">
      <p class="trans-content-title">{{ $t("收款方") }}</p>
      <div
        class="trans-content-inp"
        :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'"
      >
        <div class="trans-content-inp-box">
          <p class="placeholder" @click="inputPsw" ref="input">
            {{ $t(inpPlaceholder) }}
          </p>
          <p
            class="simulation-inp"
            :class="inpShow == false ? '' : 'borderLfet'"
          >
            {{ message }}
          </p>
        </div>

        <p class="trans-content-inp-img" @click="onAddressBook">
          <img src="../../assets/img/addressBook@2x.png" alt="" />
        </p>
      </div>
      <p class="trans-content-prompt">
        {{ $t("钱将实时转入对方账户，无法退回") }}
      </p>
      <p class="trans-content-title">{{ $t("转账金额") }}</p>
      <div
        class="trans-content-inp"
        :class="inpShow1 == false ? 'bottomBorderC' : 'bottomBorderB'">
        <div class="trans-content-inp-drop" @click="closeFun">
          <span
            :style="{ 'font-size': currencyName == '$' ? '24px' : '30px' }"
            >{{ $t(currencyName) }}</span
          >
          <img src="../../assets/img/donw@2x.png" alt="" />
        </div>
        <div class="trans-content-inp-box">
          <p class="placeholder" @click="inputPsw1" ref="inp1">
            {{ $t(inpPlaceholder1) }}
          </p>
          <p
            class="simulation-inp"
            :class="inpShow1 == false ? '' : 'borderLfet'"
          >
            {{ moneyNuber }}
          </p>
        </div>
      </div>
      <v-currency
        :actions="currencyData"
        :sheetVisible="mobileFlag"
        @closeChange="transFun"
      ></v-currency>
    </div>
    <div class="trans-btn">
      <v-btn
        btnText="转账"
        :disabledVal="disableVal"
        type="primary"
        @btnSubmit="transSubmit"
      ></v-btn>
    </div>
    <!-- 输入金额键盘 -->
    <div class="trans-keyboard" ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @pas-end="pasEnd"
        :isPoint="isPoint"
        @close="isPay = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
      >
      </v-keyboard>
    </div>
    <!-- 输入手机号键盘 -->
    <div class="trans-keyboard" ref="keyboard1">
      <v-keyboard
        ref="pay"
        :is-pay="isPay1"
        @pas-end="pasEnd"
        @close="isPay1 = false"
        @changeKey="phoneFun"
        @deleFun="deletePhoneFun"
      >
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
    <!-- 设置密码 -->
    <v-settingPsw
      :popupPsw="settingPswFlag"
      @cancelFun="settingPswCancel"
      @settingFun="succeeFun"
    ></v-settingPsw>
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
import vInput from "@/components/input/input";
import vSettingPsw from "@/components/settingPsw/settingPsw";
import md5 from "md5";
import sha1 from "sha1";

export default {
  data() {
    return {
      radio1: "USD",
      input: "",
      amount: "0.00",
      message: "", // 转账账户
      moneyNuber: "", // 金额
      transFer: [],
      currencyData: [
        { name: this.$t("币种"), method: "" },
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
      modelVisible: false, // 控制转账界面
      inpShow: false, //是否显示提示语
      inpShow1: false, //是否显示提示语
      inpPlaceholder: "请输入收款方手机号", // inpu提示语
      inpPlaceholder1: "请输入转账金额",
      isPoint: ".",
      psd: 0,
      settingPswFlag: false,
    };
  },
  created() {
    if (storages.get(global.TRANS_HISTORY).length != 0) {
      this.message = storages.get(global.TRANS_HISTORY);
      this.inpPlaceholder = "";
    }
    storages.set(global.TRANS_HISTORY);
  },
  mounted() {
    let that = this;
    // 处理电话号码input输入框
    that.$refs.trans.addEventListener("click", function(e) {
      let ele = e.target;
      let inp = that.$refs.input;
      let keyboard = that.$refs.keyboard1;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow = true;
        that.isPay1 = true;
        if (!that.message) {
          that.inpPlaceholder = "请输入收款方手机号";
        }
      } else {
        that.inpShow = false;
        that.isPay1 = false;
        if (!that.message) {
          that.inpPlaceholder = "请输入收款方手机号";
        }
      }
    });
    // 处理金额input输入框
    that.$refs.trans.addEventListener("click", function(e) {
      let ele = e.target;
      let inp = that.$refs.inp1;
      let keyboard = that.$refs.keyboard;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow1 = true;
        that.isPay = true;
        if (!that.moneyNuber) {
          that.inpPlaceholder1 = "请输入转账金额";
        }
      } else {
        that.inpShow1 = false;
        that.isPay = false;
        if (!that.moneyNuber) {
          that.inpPlaceholder1 = "请输入转账金额";
        }
      }
    });
  },
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
      if (this.currencyType == "usd") {
        return;
      }
      this.currencyName = "$";
      this.currencyType = "usd";
      this.moneyNuber = "";
      this.inpPlaceholder1 = "请输入转账金额";
      this.isPoint = ".";
    },
    // currencyFun2:选择其他币种
    currencyFun2() {
      if (this.currencyType == "khr") {
        return;
      }
      this.currencyName = "៛";
      this.currencyType = "khr";
      this.inpPlaceholder1 = "请输入转账金额";
      this.moneyNuber = "";
      this.isPoint = "";
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
      that.inpPlaceholder1 = "";
    },
    // phoneFun:输入手机号码
    phoneFun(d) {
      let that = this;
      if (that.message.length < 12) {
        that.message += d.val;
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
    // deletePhoneFun：删除电话号码
    deletePhoneFun() {
      let that = this;
      if (that.message) {
        that.message = that.message.substring(0, that.message.length - 1);
      }
    },
    // transSubmit:转账事件
    transSubmit() {
      let that = this
      if (that.message === "") {
        that.$toast("请输入转账账号");
        return;
      }
      if (that.moneyNuber === "") {
        that.$toast("请输入转账金额");
        return;
      }
      let money = "";
      let type = "";
      if (that.currencyType === "usd") {
        money = that.moneyNuber * 100;
        type = 2;
      } else {
        money = that.moneyNuber;
        type = 7;
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
          that.transFer = dialogData;
          that.modelVisible = true;
        }else{
          that.settingPswFlag = true
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
      let money = this.moneyNuber;
      if (this.currencyType === "usd") {
        money = this.moneyNuber * 100;
      }
      this.$loading();
      apiTransfer({
        money_type: this.currencyType.toLocaleLowerCase(),
        to_phone: this.message,
        amount: money,
        exchange_type: 1,
        password: md5(
          md5(
            sha1(pwd).toLocaleLowerCase() + PASSWORDSIGN
          ).toLocaleLowerCase() + noStr
        ).toLocaleLowerCase(),
        non_str: noStr,
        bill_no: "t" + storages.get(global.USERINFO).gen_key + getTime()
      }).then(res => {
        this.$loading.close();
        if (res.status == 200) {
          this.modelVisible = false;
          that.$router.replace({
            path:'/transSucc',
            query: {
              title: '转账',
              text:"转账成功"
            }
          })
        } else {
          that.$toast(res.msg);
          that.psd++;
        }
      });
    },
    // inputPsw: 输入电话号码
    inputPsw() {
      this.inpShow = true;
    },
    // inputPsw1:金额输入
    inputPsw1() {
      this.inpShow1 = true;
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
    vInput,
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
      margin: 35px 0 10px 0;
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
