<template>
  <div class="settingamount" ref="settingamount">
    <div class="settingamount-header">
      <v-header title="设置收款金额"></v-header>
      <div class="settingamount-inp">
        <!-- <div class="settingamount-inp-inp">
          <p class="settingamount-inp-inp-drop" @click="closeFun">
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
            :placeholder="$t('请输入收款金额')"
            v-model="moneyNuber"
          />
        </div> -->
      </div>
    </div>
    <div class="settingamount-content">
      <div class="settingamount-content-inp"
        :class="inpShow == false ? 'bottomBorderC' : 'bottomBorderB'">
        <div class="settingamount-content-inp-drop" @click="closeFun">
          <span
            :style="{ 'font-size': currencyName == '$' ? '24px' : '30px' }"
            >{{ $t(currencyName) }}</span
          >
          <img src="../../assets/img/donw@2x.png" alt="" />
        </div>
        <div class="settingamount-content-inp-box">
          <p class="placeholder" @click="inputPsw" ref="inp1">
            {{ $t(inpPlaceholder) }}
          </p>
          <p
            class="simulation-inp"
            :class="inpShow == false ? '' : 'borderLfet'"
          >
            {{ moneyNuber }}
          </p>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="settingamount-btn">
      <v-btn
        btnText="确认"
        :disabledVal="disableVal"
        type="primary"
        @btnSubmit="settingSubmit"
      ></v-btn>
    </div>
    <!-- 输入金额键盘 -->
    <div class="settingamount-keyboard" ref="keyboard1">
      <v-keyboard
        ref="pay"
        :is-pay="isPay1"
        @pas-end="pasEnd"
        @close="isPay1 = false"
        @changeKey="moneyFun"
        @deleFun="deleteFun"
        :isPoint="isPoint"
      >
      </v-keyboard>
    </div>
    <v-currency
      :actions="currencyData"
      :sheetVisible="mobileFlag"
      @closeChange="chooseFun"
    ></v-currency>
  </div>
</template>
<script>
import { apiSettingAmountRes } from "@api/api";
import data1 from "./data";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import vHeader from "@/components/header/header";
import vCurrency from "@/components/currency/currency";
import vBtn from "@/components/button/button";
import vKeyboard from "@/components/keyboard/keyboard";
let data = {};
Object.assign(data, data1);
export default {
  name: "settingAmount",
  provide() {
    return {
      noRequestSelectData: data
    };
  },
  data() {
    return {
      amount: "",
      qrCode: "",
      amountType: "USD",
      moneyNuber: "",//金额
      currencyName: "$", // 币种初始值
      currencyData: [
        { name: this.$t("币种"), method: "" },
        { name: "USD", method: this.currencyFun1 },
        { name: "KHR", method: this.currencyFun2 }
      ], // 弹框货币数据
      mobileFlag: false, // 控制弹框,
      disableVal: true, // 是否禁用按钮
      isPay1: false, // 控制金额键盘
      timer: null,
      inpPlaceholder: "请输入收款金额",
      inpShow: false,
      isPoint:'.'
    };
  },

  mounted() {
    let that = this;
    // 处理金额input输入框
    that.$refs.settingamount.addEventListener("click", function(e) {
      let ele = e.target;
      let inp = that.$refs.inp1;
      let keyboard = that.$refs.keyboard1;
      if (inp.contains(ele) || keyboard.contains(ele)) {
        that.inpShow = true;
        that.isPay1 = true;
        if (!that.moneyNuber) {
          that.inpPlaceholder = "请输入收款金额";
        }
      } else {
        that.inpShow = false;
        that.isPay1 = false;
        if (!that.moneyNuber) {
          that.inpPlaceholder = "请输入收款金额";
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
    closeFun() {
      let that = this;
      if (that.mobileFlag == false) {
        that.mobileFlag = true;
      } else {
        that.mobileFlag = false;
      }
    },
    openKey() {
      this.$refs.scanTextbox.setAttribute("readonly", "readonly");
      setTimeout(() => {
        this.$refs.scanTextbox.removeAttribute("readonly");
      }, 200);
      this.isPay1 = true;
    },
    chooseFun(d) {
      this.mobileFlag = d;
    },
    // currencyFun1:选择美元的函数
    currencyFun1() {
      if(this.amountType == "USD"){
        return
      }
      this.inpPlaceholder = "请输入收款金额"
      this.currencyName = "$";
      this.amountType = "usd";
      this.isPoint = "."
      this.moneyNuber = ''
    },
    // currencyFun2:选择其他币种
    currencyFun2() {
      if(this.amountType == "khr"){
        return
      }
      this.inpPlaceholder = "请输入收款金额"
      this.currencyName = "៛";
      this.amountType = "khr";
      this.isPoint = ""
      this.moneyNuber = ''
    },
    // settingSubmit: 按钮点击事件
    settingSubmit() {
      let amount = this.moneyNuber;
      if (this.amountType === "usd") {
        amount = amount * 100;
      }
      this.$loading();
      apiSettingAmountRes({
        money_type: this.amountType.toLocaleLowerCase(),
        amount: amount
      }).then(res => {
        this.$loading.close();
        let settamount = {
          money: this.moneyNuber,
          currencyName: this.currencyName,
          code: res.data.uid.code
        };
        storages.set(global.QRCODE_AMOUNT, settamount);
        this.$router.go(-1);
        // console.log(res);
        // this.$router.push({
        //   path: "/receivables",
        //   query: {
        //     money: this.moneyNuber,
        //     currencyName: this.currencyName,
        //     code: res.data.uid.code
        // }
        // });
      });
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
    // moneyFun: 输入金额
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
        if(that.moneyNuber.length < 14){
        that.moneyNuber += d.val;
        }
      }
      that.inpPlaceholder = "";
    },
    // deleteFun：删除金额
    deleteFun() {
      let that = this;
      if (that.moneyNuber) {
        that.moneyNuber = that.moneyNuber.substring(
          0,
          that.moneyNuber.length - 1
        );
      }
    },
    // pasEnd:加密
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
    inputPsw() {}
  },
  components: {
    vHeader,
    vCurrency,
    vBtn,
    vKeyboard
  }
};
</script>
<style lang="scss" scoped>
.settingamount {
  height: 100%;
  width: 100%;
  &-inp {
    padding: 0 18px;
    margin: 30px 0;
    &-inp {
      display: flex;
      height: 50px;
      width: 100%;
      margin: 0 auto;
      align-items: center;
      border-bottom: 0.026667rem solid #eae9e9;
      &-drop {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: $font-color;
        height: 28px;
        img {
          width: 14px;
          height: 14px;
          margin: 0 5px;
        }
      }
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
    }
  }
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
        background: rgba(0, 0, 0,0);
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
        padding: 0 5px 7px 5px;
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
  &-btn{
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
