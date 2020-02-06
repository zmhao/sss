/** axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import Vue from "vue";
import axios from "axios";
// import { Message } from 'element-ui'
import { Toast } from "mint-ui";
import storages from "../../src/views/cache/cache";
import globals from "../../src/views/common/global";
import router from "../router/index";
let vm = new Vue(); //引入loading组件
// 环境的切换

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "http://ax1208.b1.luyouxia.net:40506/mobile/"
    : "http://localhost:8081/api";
// axios.defaults.baseURL = 'http://10.41.1.158:8080/mobile' // 后台接口ip地址
// axios.defaults.baseURL = 'http://10.41.1.241:8888/mobile' // 测试地址
// axios.defaults.baseURL = 'http://a13694293141.e1.luyouxia.net:29624/mobile' // 路由匣

// 请求超时时间
axios.defaults.timeout = 20000;

// post请求头
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// // 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = "Bearer " + storages.get(globals.TOKEN);
    token && (config.headers.Authorization = token);

    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status == 200) {
      // if (response.data.retcode === 0) {
      vm.$loading.close();
      return Promise.resolve(response);
      // } else {
      //   vm.$loading.close();
      //   const messageConf = {
      //     message: response.data.msg,
      //     position: "middle",
      //     duration: 2000
      //   };
      //   Toast(messageConf);
      //   return Promise.reject(response);
      // }
    } else if (response.status === 401) {
    
      vm.$loading.close();
      router.replace("/login");
    } else {
      vm.$loading.close();
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    vm.$loading.close();
    if (error.message.includes("timeout")) {
      // 判断请求异常信息中是否含有超时timeout字符串
      const messageConf = {
        message: "网络异常",
        position: "middle",
        duration: 2000
      };
      Toast(messageConf);
      return Promise.reject(error);
    } else if (error.response.status == 401) {
      router.replace({ path: "/login" });
    } else {
      const messageConf = {
        message: "网络异常",
        position: "middle",
        duration: 2000
      };
      Toast(messageConf);
      return Promise.reject(error.response);
    }
  }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
// export function post (url, params) {
//   return new Promise((resolve, reject) => {
//     cordova.plugins.encryption.rsaEncrypt([params, storages.get(globals.PRIVATE_KEY)], function (result) {
//       let data = JSON.parse(result)
//       if (data.code === 0) {
//         var dd = JSON.parse(JSON.stringify(data.data))
//         dd = JSON.parse(dd)
//         axios.post(url, JSON.stringify(dd))
//           .then(res => {
//             cordova.plugins.encryption.rsaDecrypt([res.data.data, storages.get(globals.PUBLIC_KEY), res.data.sing], function (result) {
//               if (data.code === 0) {
//                 let data = JSON.parse(result)
//                 resolve(data.data)
//               } else {
//                 reject(data.data)
//               }
//             })
//           })
//           .catch(err => {
//             reject(err.data)
//           })
//       } else {
//         reject(data)
//       }
//     })
//   })
// }
export function post(url, params) {
  // console.log(axios.defaults.baseURL + url)
  // console.log(JSON.stringify(params))
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
