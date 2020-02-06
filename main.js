// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

import ElementUI from "element-ui";
import Mint from "mint-ui";
import "element-ui/lib/theme-chalk/index.css";
import "mint-ui/lib/style.css";
import vuex from "vuex";
import "../src/views/toast/toast.css";
import "../src/components/loading/loading.css";
import Loading from "../src/components/loading/index";
import Toast from "../src/views/toast/index";
import i18n from "./lang"; // 多语言
import noRequestSelect from "@components/noRequestSelect";
import "lib-flexible/flexible.js";
import jpush from "./assets/js/jpush";
import global, { PASSWORDSIGN } from "@views/common/global";
import storages from "@views/cache/cache";

import Vconsole from "vconsole";
import Calendar from "vue2-datepick";

const vConsole = new Vconsole();
Vue.use(vConsole);
Vue.prototype.jpush = jpush;
// 注册element-ui
Vue.use(ElementUI);
Vue.use(Mint);
Vue.use(vuex);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Calendar);
Vue.config.productionTip = false;

Vue.component(noRequestSelect.name, noRequestSelect); // 没有请求的select

Vue.config.productionTip = false;

// 注册一个全局守卫，作用是在路由跳转前，对路由进行判断，防止未登录的用户跳转到其他需要登录的页面去
router.beforeEach((to, from, next) => {
  let token = storages.get(global.TOKEN);
  // 如果已经登录，那我不干涉你，让你随便访问
  if (to.meta.requireAuth) {
    if (token && token != "") {
      next();
    } else {
      // 如果没有登录，但你访问其他需要登录的页面，那我就让你跳到登录页面去
      if (to.path !== "/login") {
        router.replace({ path: "/login" });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  render: h => h(App),
  components: { App },
  template: "<App/>"
});

// document.addEventListener(
//   "deviceready",
//   function() {
//     new Vue({
//       el: "#app",
//       router,
//       i18n,
//       render: h => h(App),
//       components: { App },
//       template: "<App/>"
//     }).$mount("#app");
//     document.addEventListener(
//       "jpush.receiveRegistrationId",
//       function(event) {
//         // alert('receiveRegistrationId' + JSON.stringify(event))
//         console.log("receiveRegistrationId" + JSON.stringify(event));
//       },
//       false
//     );
//     initiateUI();
//   },
//   false
// );

function initiateUI() {
  try {
    window.JPush.setDebugMode(true);
    window.JPush.init();
    window.setTimeout(getRegistrationID, 10000);

    if (device.platform !== "Android") {
      window.JPush.setApplicationIconBadgeNumber(0);
    }
  } catch (exception) {
    // alert('An exception has been occured when init JPush plugin.' + exception)
    console.log(
      "An exception has been occured when init JPush plugin." + exception
    );
  }
}

function getRegistrationID() {
  window.JPush.getRegistrationID(onGetRegistrationID);
}

function onGetRegistrationID(data) {
  try {
    if (data.length === 0) {
      // alert("id is null");
      console.log("id is null");
      var t1 = window.setTimeout(getRegistrationID, 5000);
    } else {
      // alert(data)
      console.log('onGetRegistrationID'+data);
    }
  } catch (exception) {
    console.log('onGetRegistrationID'+exception);
  }
}
