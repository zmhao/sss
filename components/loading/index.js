let _LOADING = {
  show: false, // Boolean loading显示状态
  component: null // Object loading组件
};
export default {
  install(Vue) {
    /*
            text: String
            type: String
        */
    Vue.prototype.$loading = function(text = "loading...", type) {
      if (type == "close") {
        if (!_LOADING.show) {
          return;
        }
        _LOADING.component.show = _LOADING.show = false;
      } else {
        if (_LOADING.show) {
          return;
        }
        let LoadingCompoent = Vue.extend({
          data: function() {
            return {
              show: _LOADING.show,
              imgSrc: require("../../assets/img/loading@2x.png")
            };
          },
          template: `<div v-show="show" class="zh-load-mark">
                                    <div class="zh-load-box">
                                        <div class="zh-loading">
                                          <img :src="imgSrc" class="zh-load-img" />
                                        </div>
                                        <div class="zh-load-content">${text}</div>
                                    </div>
                                </div>`
        });
        _LOADING.component = new LoadingCompoent();
        let element = _LOADING.component.$mount().$el;
        document.body.appendChild(element);
        _LOADING.component.show = _LOADING.show = true;
      }
    };
    // 打开/关闭
    ["open", "close"].forEach(function(type) {
      Vue.prototype.$loading[type] = function(text) {
        return Vue.prototype.$loading(text, type);
      };
    });
  }
};
