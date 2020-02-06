<template>
  <div id="app">
    <!-- <transition :name="animateName">
    </transition> -->
    <!-- <keep-alive>
          <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      animateName: "slide-left",
      pathList: [
        "/main",
        "/notpwd",
        "/register",
        "/RegisterComplate",
        "/recharge",
        "/bill",
        "/takemoney",
        "/trans",
        "/selectlang",
        "/exchange",
        "/receivables",
        "/settingamount",
        "/payment",
        "/scanpay",
        "/messagelist",
        "/coupondetail",
        "/coupon",
        "/setting",
        "/settinghead",
        "/accountsafe",
        "/refreshphone",
        "/newphone",
        "/updateloginpwd",
        "/updatepaymentpwd",
        "/inputpaymentpwd",
        "/scantakemoney",
        "/persondata",
        "/communication",
        "/about",
        "/notification",
        "/help",
        "/helpdetail"
      ],
      exitAppTicker: 0
    };
  },
  mounted() {
    this.backbutton();
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener(
      "hashchange",
      () => {
        let currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath);
        }
      },
      false
    );
  },
  watch: {
    // $route(to, from) {
    //   const prevPath = from.path;
    //   const nextPath = to.path;
    //   const prevIndex = this.pathList.findIndex(val => prevPath === val); //前一个路由的索引
    //   const nextIndex = this.pathList.findIndex(val => nextPath === val); //当前点击路由的索引
    //   if (prevIndex > nextIndex) {
    //     this.animateName = "slide-left";
    //   } else {
    //     this.animateName = "slide-right";
    //   }
    // }
  },
  methods: {
    //点击返回按键
    backbutton() {
      let that = this;
      document.addEventListener(
        "deviceready",
        function() {
          document.addEventListener(
            "backbutton",
            function() {
              if (that.isHomePage()) {
                if (that.exitAppTicker == 0) {
                  that.exitAppTicker++;
                  that.$toast("再点一次退出");
                  setTimeout(function() {
                    that.exitAppTicker = 0;
                  }, 2000);
                } else if (that.exitAppTicker == 1) {
                  navigator.app.exitApp(); //退出app
                }
              } else {
                history.back();
              }
            },
            false
          );
        },
        false
      );
    },

    //自己判断为首页的方法
    isHomePage() {
      let path = this.$route.path;
      if (path == "/") {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener("backbutton", this.onBackKeyDown, false); // 注销返回键
    document.removeEventListener("backbutton", this.exitApp, false);
  }
};
</script>
<style>
@import "./assets/css/public.css"; /*修改元素默认样式样式 */
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50; */
  text-align: center;
  width: 100%;
  height: 100%;
}
/* .view {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
} */
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}
</style>
