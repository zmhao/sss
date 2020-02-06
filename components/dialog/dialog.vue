<template>
  <div class="dialog" v-if="closeModelAll">
    <!-- 支付密码框 -->
    <div class="dialog-box" v-if="pswModel == true">
      <div class="dialog-box-content">
        <div class="dialog-box-content-header">
          <div class="dialog-box-content-header-close" @click="closeModelFun">
            <img src="../../assets/img/x@2x.png" alt="" />
          </div>
          <div class="dialog-box-content-header-title">
            {{ $t("请输入支付密码") }}
          </div>
        </div>
        <div class="dialog-box-content-money">
          <p class="dialog-box-content-money-account">
            {{ $t("向") }}{{ account }}{{ $t("转账") }}
          </p>
          <p class="dialog-box-content-money-nubmer">
            {{ $t(currency == "usd" ? "$" : "៛") }} {{ $t(price) }}
          </p>
        </div>
        <div class="dialog-box-content-list">
          <div
            class="dialog-box-content-list-li"
            v-for="item in list"
            :key="item.name"
          >
            <div class="dialog-box-content-list-li-left">
              {{ $t(item.name) }}：
            </div>
            <div class="dialog-box-content-list-li-right">{{ item.price }}</div>
          </div>
        </div>
        <!-- 输入密码 -->
        <div class="pas-box v-1px" v-show="keyShow">
          <div
            v-for="(pas, i) in pasDigits"
            :key="i"
            :class="{ 'v-1px-l': i > 0 }"
          >
            <input type="password" :value="val[i]" disabled />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-pswBox" v-if="pswModel == false">
      <div class="dialog-pswBox-header">
        <div class="dialog-pswBox-header-left">
          <div class="dialog-pswBox-header-left-box" @click="closeModelFun">
            <img src="../../assets/img/x@2x.png" alt="" />
          </div>
        </div>
        <div class="dialog-pswBox-header-center">
          {{ $t("请输入支付密码") }}
        </div>
        <div class="dialog-pswBox-header-right" @click="tabNotpwd">
          {{ $t("忘记密码") }}
        </div>
      </div>
      <!-- 输入密码 -->
      <div class="dialog-pswBox-box">
        <div class="pas-box v-1px" v-show="keyShow">
          <div
            v-for="(pas, i) in pasDigits"
            :key="i"
            :class="{ 'v-1px-l': i > 0 }"
          >
            <input type="password" :value="val[i]" disabled />
          </div>
        </div>
      </div>
      <div class="dialog-pswBox-security">
        {{ $t("安全支付环境，请放心使用!") }}
      </div>
    </div>
    <div class="trans-keyboard" ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @close="isPay = false"
        @changeKey="enterPswFun"
        @deleFun="delPwdFun"
      >
      </v-keyboard>
    </div>
  </div>
</template>
<script>
import vKeyboard from "@/components/keyboard/keyboard";
export default {
  name: "v-dialog",
  // props: ["closeModel", "account", "currency", "list", "price"], // closeModel:控制整个模态框
  props: {
    closeModel: {//控制模态框
      type: Boolean
    },
    account: {//账户
      type: String
    },
    currency: {//币种
      type: String
    },
    list: {//列表
      type: Array
    },
    price: {//价格
      type: String
    },
    pswModel: {//是否显示输入密码框
      type: Boolean,
      default: true
    },
    isVal:{//是否清空密码框
      type:Number,
    }
  },
  data() {
    return {
      isPay: true, // 控制键盘
      // list: [
      //   { name: '提现手续费', price: '22' },
      //   { name: '费率', price: '1%' }
      // ], // 账单收费列表
      pasDigits: 6, // 几个密码框
      keyShow: true, // 控制密码框状态
      val: [], // 密码
      closeModelAll: null // 控制整个模态框
    };
  },
  watch: {
    closeModel() {
      let that = this;
      that.closeModelAll = that.closeModel;
    },
    isVal(){
      this.val = []
    }
  },
  mounted() {
    console.log(this.isVal)
    this.closeModelAll = this.closeModel;
  },
  methods: {
    //   closeModelFun：关闭模态框
    closeModelFun() {
      let that = this;
      that.closeModelAll = false;
      that.$emit("modelState", this.closeModelAll);
      that.val = [];
    },
    // enterPswFun:输入密码
    enterPswFun(d) {
      let that = this;
      if (that.val.length < 6) {
        that.val.push(d.val);
      }
      if (that.val.length === 6) {
        that.$emit("enterPswFun", that.val);
      }
    },
    delPwdFun() {
      this.val.pop();
    },
    tabNotpwd(){
      this.$router.replace('/notpwd')
    }
  },
  components: {
    vKeyboard
  }
};
</script>
<style lang="scss" scoped>
.dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  &-box {
    width: 80%;
    height: 307px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    border-radius: 14px;
    margin-top: 30%;
    animation: dialogchange 0.2s ease;
    &-content {
      padding: 0 20px;
      &-header {
        display: flex;
        align-items: center;
        height: 40px;
        position: relative;
        &-close {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          position: absolute;
          img {
            width: 14px;
            height: 14px;
          }
        }
        &-title {
          flex: 1;
          font-weight: 400;
          color: rgba(0, 16, 38, 1);
          opacity: 1;
          font-size: 13px;
        }
      }
      &-money {
        &-account {
          font-size: 16px;
          font-weight: 500;
          color: $font-color;
          opacity: 1;
          margin: 10px 0 5px 0;
        }
        &-nubmer {
          font-size: 20px;
          font-weight: 500;
          color: rgba(24, 124, 236, 1);
          opacity: 1;
          margin-top: 10px;
          &::after {
            content: "";
            margin-top: 20px;
            display: block;
            width: 100%;
            border-bottom: 1px solid $font-color;
            height: 1px;
            opacity: 0.1;
            transform-origin: 0 100%;
            transform: scaleY(0.5);
          }
        }
      }
      &-list {
        margin-top: 10px;
        &-li {
          display: flex;
          height: 30px;
          align-items: center;
          font-size: 14px;
          &-left {
            flex: 1;
            text-align: left;
            color: #bbbbbb;
          }
          &-right {
            color: $font-color;
          }
        }
      }
    }
  }
  .pas-box {
    width: 100%;
    height: 45px;
    display: flex;
    margin: 20px auto;
    line-height: 45px;
    text-align: center;
    border-radius: 4px;
    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      > input {
        width: 100%;
        font-size: 18px;
        text-align: center;
        height: 100%;
        display: block;
      }
    }
  }
  .v-1px-l,
  .v-1px-b,
  .v-1px {
    position: relative;
    input {
      background-color: #fff;
    }
  }
  .v-1px-b:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #abb1be;
    color: #c7c7c7;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }

  .v-1px-t:before {
    z-index: 112;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    content: "";
    border-top: 1px solid #abb1be;
    transform: scaleY(0.5);
    color: #c7c7c7;
    transform-origin: 0 0;
  }

  .v-1px-l:before {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    content: "";
    border-left: 1px solid #abb1be;
    transform: scaleX(0.5);
    color: #c7c7c7;
    transform-origin: 0 0;
  }

  .v-1px:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    content: "";
    border: 1px solid #abb1be;
    transform: scale(0.5);
    color: #c7c7c7;
    transform-origin: left top;
    z-index: 1000;
    border-radius: 8px;
  }
  @keyframes dialogchange {
    from {
      width: 60%;
      height: 250px;
    }
    to {
      width: 80%;
      height: 307px;
    }
  }
  &-pswBox {
    position: fixed;
    bottom: 217px;
    width: 100%;
    height: 190px;
    background-color: #fff;
    &-header {
      position: relative;
      height: 42px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #001026;
      &-left {
        flex: 1;
        &-box {
          display: flex;
          align-items: center;
          width: 20px;
          height: 28px;
          img {
            width: 13px;
          }
        }
      }
      &-center {
        flex: 1;
      }
      &-right {
        flex: 1;
        text-align: right;
      }
      &::after {
        content: "";
        display: block;
        @include div-borderBottom;
      }
    }
    &-box {
      padding: 0 40px;
    }
    &-security {
      font-size: 12px;
      color: #20589a;
    }
  }
}
</style>
