<template>
  <div class="modify">
    <header class="modify-header">
      <v-header title="修改支付密码"></v-header>
    </header>
    <router-view />
  </div>
</template>

<script>
import { apiUpdatePaymentPwd } from "@api/api";
import vHeader from "@/components/header/header";
import vKeyboard from "@/components/keyboard/keyboard";
import vButton from "@/components/button/button";
import sha1 from "sha1";
export default {
  data() {
    return {
      // verify: "",
      // textHit: "请设置支付密码，用于支付验证",
      // inputshow: true,
      // ketboardshwo: true,
      // loadingShow: false,
      // nextBtnShow: true,
      // commitShow: false,
      // paySuc: false,
      // password: [],
      // keyList: [
      //   [1, 2, 3],
      //   [4, 5, 6],
      //   [7, 8, 9]
      // ],
      // payStatus: false,
      // payStatusText: "",
      // payPwd: "",
      // newPayPwd: "",
      // psw: ["a"], //第一次支付密码数组形式不能直接用，不要去掉里面的a
      // isPay: false, //控制键盘显示隐藏
      // disableVal: true, //禁用下一步按钮
      // pswStr: "", //密码，可以直接用，字符串,第一次的输入的密码
    };
  },
  create() {
    // this.verify = this.$router.query.verifyCode;
  },
  methods: {
    // commitBtn() {
    //   this.newPayPwd = this.payStatusText;
    //   let code =this.$route.query.verifyCode
    //   console.log(this.payPwd);
    //   console.log(this.newPayPwd);
    //   if (this.payPwd != this.newPayPwd) {
    //     this.$toast("两次输入的密码不一致");
    //     return;
    //   }
    //   apiUpdatePaymentPwd({
    //     sms: code,
    //     password: sha1(this.newPayPwd).toLocaleLowerCase(),
    //     account_type:4
    //   }).then(res => {
    //     console.log(res);
    //     this.$router.go(-2);
    //   });
    // },
    // goBack() {
    //   if (this.nextBtnShow) {
    //     this.$router.go(-1);
    //     return;
    //   }
    //   if (this.commitShow) {
    //     this.nextBtnShow = true;
    //     this.commitShow = false;
    //     this.payPwd = "";
    //     this.newPayPwd = "";
    //     this.payStatusText = "";
    //     this.textHit = "请设置支付密码，用于支付验证";
    //     this.password = [];
    //   }
    // },
    // nextBtn() {
    //   if (this.payStatusText === "") {
    //     this.$toast("请输入支付密码");
    //     return;
    //   }
    //   if (this.payStatusText.length !== 6) {
    //     this.$toast("支付密码长度不正确");
    //     return;
    //   }
    //   this.nextBtnShow = false;
    //   this.commitShow = true;
    //   this.textHit = "请再次输入以确认";
    //   this.payPwd = this.payStatusText;
    //   this.payStatusText = "";
    //   this.password = [];
    // },
    // inputStart(val, e) {
    //   if (this.password.length < this.pasDigits) {
    //     this.password.push(val);
    //     this.payStatusText = this.payStatusText + val;
    //     if (this.password.length === this.pasDigits) {
    //       this.$emit("pas-end", this.password.join("") - 0);
    //       // this.keyShow = false;
    //       this.loadingShow = true;
    //       //   this.password = [];
    //     }
    //   } else {
    //     this.$emit("pas-end", this.password.join("") - 0);
    //   }
    //   this.highLight(e.currentTarget);
    // },
    // inputEnd(e, d) {
    //   this.unhighLight(e.currentTarget, d);
    // },
    // highLight(ele) {
    //   ele.style.backgroundColor = this.highlightColor;
    // },
    // unhighLight(ele, d) {
    //   if (d) {
    //     ele.style.backgroundColor = "#e8e8e8";
    //   } else {
    //     ele.style.backgroundColor = "#fff";
    //   }
    // },
    // del() {
    //   if (this.password.length > 0) {
    //     this.password.pop();
    //     this.payStatusText = this.payStatusText.substr(
    //       0,
    //       this.payStatusText.length - 1
    //     );
    //   }
    // },
    // close() {
    //   this.$emit("close");
    // },
    // closeKey() {
    //   this.ketboardshwo = false;
    //   this.password = [];
    //   this.payStatusText = "";
    // },
    // showKey() {
    //   this.ketboardshwo = true;
    // },
    // $payStatus(flag, payStatusText) {
    //   if (typeof flag != "boolean") return;
    //   this.payStatus = flag;
    //   this.payStatusText = payStatusText;
    //   this.loadingShow = false;
    //   this.paySuc = true;
    //   setTimeout(() => {
    //     if (flag) {
    //       this.$emit("close");
    //     }
    //     this.keyShow = true;
    //     this.paySuc = false;
    //     this.$refs.loading.classList.remove("loading-ani");
    //   }, 800);
    // }
  },
  components: {
    vHeader,
    vKeyboard,
    vButton
  }
};
</script>
<style lang="scss" scoped>
.modify {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
