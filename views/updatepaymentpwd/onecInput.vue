<template>
  <div class="modify-children" @click="clickTarget">
    <section class="modify-children-content">
      <p class="modify-children-content-title">
        {{ $t("请设置支付密码，用于支付验证") }}
      </p>
      <div
        class="modify-children-content-pswbox"
        @click.prevent="openKetboard"
        ref="pswBox"
      >
        <div
          v-for="(item, index) in 6"
          :key="index"
          :class="
            psw[index] == 'a'
              ? isPay == false
                ? 'bottomBorderC'
                : 'bottomBorderB'
              : 'bottomBorderC'
          "
        >
          <p :class="psw[index] == 'a' ? 'borderLfet' : ''" v-if="isPay"></p>
          <input
            type="password"
            readonly
            v-model="psw[index]"
            v-if="psw[index] != 'a'"
          />
        </div>
      </div>
    </section>
    <footer class="modify-children-next">
      <v-button
        btnText="下一步"
        :disabledVal="disableVal"
        type="primary"
        @btnSubmit="motifySubmit"
      ></v-button>
    </footer>
    <!-- 第一次输入的键盘 -->
    <div ref="keyboard">
      <v-keyboard
        ref="pay"
        :is-pay="isPay"
        @close="isPay = false"
        @changeKey="phoneFun"
        @deleFun="deletePhoneFun"
      >
      </v-keyboard>
    </div>
  </div>
</template>
<script>
import vKeyboard from "@/components/keyboard/keyboard";
import vButton from "@/components/button/button";
import md5 from "md5";
import sha1 from "sha1";
import storages from "@views/cache/cache";
import global, { PASSWORDSIGN } from "@views/common/global";
import { randomStr } from "@js/util";
export default {
  data() {
    return {
      psw: ["a"], //第一次支付密码数组形式不能直接用，不要去掉里面的a
      isPay: false, //控制键盘显示隐藏
      disableVal: true, //禁用下一步按钮
      pswStr: "", //密码，可以直接用，字符串,第一次的输入的密码
      verifyCode: "",
      nostr1:''
    };
  },
  mounted() {
    let that = this;
  },
  methods: {
    // deletePhoneFun:删除
    deletePhoneFun() {
      let that = this;
      if (that.psw.length > 1) {
        that.psw.splice(that.psw.length - 2, 1);
        let arr = "";
        for (let i = 0; i < that.psw.length - 1; i++) {
          arr += that.psw[i];
        }
        that.pswStr = arr;
        if (that.pswStr.length !== 6) {
          that.disableVal = true;
        }
      }
    },
    // phoneFun:密码
    phoneFun(d) {
      let that = this;
      let uuuid = "1111";
      if (that.psw.length < 7) {
        that.psw.splice(that.psw.length - 1, 0, d.val);
        let arr = "";
        for (let i = 0; i < that.psw.length - 1; i++) {
          arr += that.psw[i];
        }
        that.pswStr = arr;
        if (that.pswStr.length == 6) {
          that.nostr1 = randomStr(16, false);
          that.pswStr = md5(md5(sha1(arr).toLocaleLowerCase() + PASSWORDSIGN).toLocaleLowerCase() + that.nostr1).toLocaleLowerCase()
          storages.set(global.ONEPSW, that.pswStr);
          that.isPay = false;
          that.disableVal = false;
        }
      }
    },
    // openKetboard:打开键盘
    openKetboard() {
      this.isPay = true;
    },
    // clickTarget: 获取点击时的目标元素，隐藏键盘
    clickTarget(event) {
      let ele = event.target;
      this.inputHide(ele);
    },
    // 关闭键盘函数
    inputHide(ele) {
      let that = this;
      let inp = that.$refs.pswBox;
      let keyboard = that.$refs.keyboard;
      if (inp || keyboard) {
        if (inp.contains(ele) || keyboard.contains(ele)) {
          that.isPay = true;
        } else {
          that.isPay = false;
        }
      }
    },
    // motifySubmit:下一步按钮事件
    motifySubmit() {
      let that = this;
      that.$router.push({
        path: "twoInput",
        query: {
          verifyCode: that.nostr1
        }
      });
    }
  },
  components: {
    vKeyboard,
    vButton
  }
};
</script>
<style lang="scss" scoped>
.modify-children {
  padding-top: 80px;
  height: 100%;
  &-content {
    padding: 0 18px;
    &-title {
      font-size: 16px;
      color: $font-color;
    }
    &-pswbox {
      display: flex;
      margin: 20px 0;
      div {
        position: relative;
        flex: 1;
        // border: 1px solid #ccc;
        height: 50px;
        display: flex;
        justify-content: center;
        margin: 0 5px;
        input {
          width: 9px;
          font-size: 20px;
          outline: none;
        }
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
      bottom: 0;
      @include menu-borderBottom;
    }
  }
  .bottomBorderB {
    &::after {
      content: "";
      display: block;
      position: absolute;
      border-bottom: 2px solid $btn-color;
      margin-top: 5px;
      width: 100%;
      bottom: 0;
      @include menu-borderBottom;
    }
  }
  .borderLfet {
    display: flex;
    align-items: center;
    &::after {
      content: "";
      display: block;
      height: 20px;
      // border-left: 1px solid $btn-color;
      position: absolute;
      left: 22px;
      width: 2px;
      animation: dong 0.5s infinite 0s ease-in-out alternate;
    }
    // &:first-child{
    //   display: block;
    // }
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
  &-next {
    margin-top: 50px;
    padding: 0 18px;
  }
}
</style>
