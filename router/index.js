import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: resolve=>(require(["@views/login/Login"],resolve))
    },
    {
      path: "/notpwd",
      name: "NotPwd",
      component: resolve=>(require(["@views/notpwd/notpwd"],resolve))
    },
    {
      path: "/",
      name: "Main",
      component: resolve=>(require(["@views/main/main"],resolve)),
      meta: {
        requireAuth: true,
        keepAlive: false
      },
      children: []
    },
    {
      path: "/register",
      name: "Register",
      component: resolve=>(require(["@views/register/register"],resolve))
    },
    {
      path: "/RegisterComplate",
      name: "RegisterComplate",
      component: resolve=>(require(["@views/register/registerComplete"],resolve))
    },
    {
      path: "/recharge",
      name: "Recharge",
      component: resolve=>(require(["@views/recharge/recharge"],resolve))
    },
    {
      path: "/bill",
      name: "Bill",
      component: resolve=>(require(["@views/bill/bill"],resolve))
    },
    {
      path: "/takemoney",
      name: "TakeMoney",
      component: resolve=>(require(["@views/takemoney/takemoney"],resolve))
    },
    {
      path: "/trans",
      name: "Trans",
      component: resolve=>(require(["@views/trans/trans"],resolve))
    },
    {
      path: "/selectlang",
      name: "SelectLang",
      component: resolve=>(require(["@views/selectlang/selectlang"],resolve))
    },
    {
      path: "/exchange",
      name: "Exchange",
      component: resolve=>(require(["@views/exchange/exchange"],resolve))
    },
    {
      path: "/receivables",
      name: "Receivables",
      component: resolve=>(require(["@views/receivables/receivables"],resolve)),
      meta: {
        isBack: false
      }
    },
    {
      path: "/settingamount",
      name: "SettingAmount",
      component: resolve=>(require(["@views/settingamount/settingamount"],resolve))
    },
    {
      path: "/payment",
      name: "Payment",
      component: resolve=>(require(["@views/payment/payment"],resolve))
    },
    {
      path: "/scanpay",
      name: "ScanPay",
      component: resolve=>(require(["@views/scanpay/scanpay"],resolve))
    },
    {
      path: "/messagelist",
      name: "MessageList",
      component: resolve=>(require(["@views/messagelist/messagelist"],resolve))
    },
    {
      path: "/coupondetail",
      name: "CouponDetail",
      component: resolve=>(require(["@views/coupondetail/coupondetail"],resolve))
    },
    {
      path: "/coupon",
      name: "Coupon",
      component: resolve=>(require(["@views/coupon/coupon"],resolve))
    },
    {
      path: "/setting",
      name: "Setting",
      component: resolve=>(require(["@views/setting/setting"],resolve))
    },
    {
      path: "/settinghead",
      name: "SettingHead",
      component: resolve=>(require(["@views/settinghead/settinghead"],resolve))
    },
    {
      path: "/accountsafe",
      name: "AccountSafe",
      component: resolve=>(require(["@views/accountSafe/accountSafe"],resolve))
    },
    {
      path: "/refreshphone",
      name: "RefreshPhone",
      component: resolve=>(require(["@views/refreshphone/refreshphone"],resolve))
    },
    {
      path: "/newphone",
      name: "NewPhone",
      component: resolve=>(require(["@views/refreshphone/newphone"],resolve))
    },
    {
      path: "/updateloginpwd",
      name: "UpdateLoginPwd",
      component: resolve=>(require(["@views/updateloginpwd/updateloginpwd"],resolve))
    },
    {
      path: "/updatepaymentpwd",
      name: "UpdatePaymentPwd",
      component: resolve=>(require(["@views/updatepaymentpwd/updatepaymentpwd"],resolve))
    },
    {
      path: "/inputpaymentpwd",
      name: "InputPaymentPwd",
      component: resolve=>(require(["@views/updatepaymentpwd/inputpaymentpwd"],resolve)),
      redirect: "/inputpaymentpwd/onecInput",
      children: [
        { path: "onecInput", name: "OnecInput", component: resolve=>(require(["@views/updatepaymentpwd/onecInput"],resolve)) },
        { path: "twoInput", name: "TwoInput", component: resolve=>(require(["@views/updatepaymentpwd/twoInput"],resolve)) }
      ]
    },
    {
      path: "/scantakemoney",
      name: "ScanTakeMoney",
      component: resolve=>(require(["@views/scantakemoney/scantakemoney"],resolve))
    },
    {
      path: "/persondata",
      name: "PersonData",
      component: resolve=>(require(["@views/persondata/persondata"],resolve))
    },
    {
      path: "/communication",
      name: "Communication",
      component: resolve=>(require(["@views/communication/communication"],resolve))
    },
    {
      path: "/about",
      name: "About",
      component: resolve=>(require(["@views/about/about"],resolve))
    },
    {
      path: "/notification",
      name: "Notification",
      component: resolve=>(require(["@views/notification/notification"],resolve))
    },
    {
      path: "/help",
      name: "Help",
      component: resolve=>(require(["@views/help/help"],resolve))
    },
    {
      path: "/helpdetail",
      name: "HelpDetail",
      component: resolve=>(require(["@views/helpdetail/helpdetail"],resolve))
    },
    {
      path: "/scan",
      name: "scan",
      component: resolve=>(require(["@views/scan/scan"],resolve))
    },
    {
      path: "/scanContent",
      name: "scanContent",
      component: resolve=>(require(["@views/scanContent/scanContent"],resolve))
    },
    {
      path: "/transSucc",
      name: "transSucc",
      component: resolve=>(require(["@views/transSucc/transSucc"],resolve))
    },
  ],
  mode: 'hash',
});
