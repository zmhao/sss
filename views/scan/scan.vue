<template>
  <div style="height:100%">
    <div class="scroll-container scan-container">
      <!-- 头部导航 -->
      <div class="scan-none-1">
        <div class="header">
          <div class="header-img" @click="backFun">
            <img class="img-style" src="../../assets/img/arrBlack@2x.png" />
          </div>
          <div class="header-title">{{ $t("扫一扫") }}</div>
        </div>
      </div>
      <div class="scan-box-container">
        <div class="scan-none-2"></div>
        <div class="scan-box">
          <div class="scan-box-area">
            <div class="top-left"></div>
            <div class="top-right"></div>
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
            <div class="light"></div>
          </div>
        </div>
        <div class="scan-none-2"></div>
      </div>
      <div class="scan-none-1 scan-bg">
        <div class="scan-guan" @click="onLightTrigger">
          <p
            class="scan-mobile-light-bg"
            :class="light == false ? 'offBg' : 'openBg'"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      light: false
    };
  },
  beforeCreate() {
    //将网页背景设置透明
    document.getElementById("app").style.backgroundColor = "transparent";
    document.querySelector("body").style.backgroundColor = "transparent";
  },
  beforeDestroy() {
    //恢复之前的背景
    document.getElementById("app").style.backgroundColor = "#fff";
    document.querySelector("body").style.backgroundColor = "#fff";
    try {
      QRScanner.hide(status => {
        // console.log("[Scan.vue] 关闭扫描" + JSON.stringify(status));
      });
      QRScanner.destroy(function(status) {
        // console.log("[Scan.vue] 销毁扫码" + JSON.stringify(status));
      });
    } catch (e) {
      // console.log("[Scan.vue]" + JSON.stringify(e));
    }
  },
  mounted() {
    this.onScan();
  },
  methods: {
    /**
     * 扫码
     */
    onScan() {
      let self = this;
      try {
        QRScanner.show(status => {
          // console.log("[Scan.vue onScan] 显示扫描" + JSON.stringify(status));
        });
        QRScanner.scan((err, contents) => {
          if (err) {
            console.log(JSON.stringify(e));
          } else {
            // 扫码提现;
            if (contents.startsWith("S.")) {
              self.$router.replace({
                name: "ScanTakeMoney",
                query: {
                  code: contents
                }
              });
              return;
            }
            // 扫码付款
            if (contents.startsWith("B.") || contents.startsWith("A.")) {
              self.$router.replace({
                name: "ScanPay",
                query: {
                  code: contents
                }
              });
            }else{
              self.$router.replace({
                name: "scanContent",
                query: {
                  code: contents
                }
              });
            }
          }
        });
      } catch (e) {
        // console.log("[Scan.vue：onScan] " + JSON.stringify(e));
      }
    },

    /**
     * 手电筒开关
     */
    onLightTrigger() {
      try {
        if (!this.light) {
          QRScanner.enableLight((err, status) => {
            err &&
              console.log(
                "[Scan.vue] 打开手电筒状态错误：" + JSON.stringify(err)
              );
            console.log("[Scan.vue] 打开手电筒状态：" + JSON.stringify(status));
          });
        } else {
          QRScanner.disableLight((err, status) => {
            err &&
              console.log(
                "[Scan.vue] 关闭手电筒状态错误：" + JSON.stringify(err)
              );
            // console.log("[Scan.vue] 关闭手电筒状态：" + JSON.stringify(status));
          });
        }
      } catch (e) {
        // console.log("[Scan.vue] " + JSON.stringify(e));
        return;
      }
      this.light = !this.light;
    },
    /*
     *backFun:后退事件
     */
    backFun() {
      this.$router.back();
    }
  }
};
</script>
<style scoped lang="scss">
//可滚动内容区域
.scroll-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}

.scan-container {
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  .scan-none-1 {
    flex: 1;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    // display: none;
    &:first-child {
      flex: 0.6;
    }
  }

  .scan-box-container {
    display: flex;

    .scan-none-2 {
      flex: 1;
      height: calc(6rem + 2px);
      background: rgba(0, 0, 0, 0.4);
    }

    .scan-box {
      width: 6rem;
      height: 6rem;
      background: rgba(0, 0, 0, 0);
      .scan-box-area {
        width: 6rem;
        height: 6rem;
        position: relative;
        .light {
          position: absolute;
          width: 100%;
          height: 5px;
          background: rgba(24, 124, 236, 0.9);
          border-radius: 3px;
          box-shadow: 1px 7px 15px 0px $btn-color;
          animation: borderAmi 3s linear infinite;
        }

        .top-left {
          position: absolute;
          top: -3px;
          left: -3px;
          width: 20px;
          height: 20px;
          border-top: 5px solid $btn-color;
          border-left: 5px solid $btn-color;
        }

        .top-right {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 20px;
          height: 20px;
          border-top: 5px solid $btn-color;
          border-right: 5px solid $btn-color;
        }

        .bottom-left {
          position: absolute;
          bottom: -3px;
          left: -3px;
          width: 20px;
          height: 20px;
          border-bottom: 5px solid $btn-color;
          border-left: 5px solid $btn-color;
        }

        .bottom-right {
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 20px;
          height: 20px;
          border-bottom: 5px solid $btn-color;
          border-right: 5px solid $btn-color;
        }
      }
    }
  }
}
@keyframes borderAmi {
  from {
    top: 0;
  }
  to {
    top: 6rem;
  }
}
.header {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 25px;
  &-img {
    display: flex;
    align-items: center;
    height: 30px;
    padding-left: 18px;
    img {
      width: 18px;
      height: 18px;
    }
  }
  &-title {
    margin-left: 15px;
    color: #fff;
  }
}
.scan-bg {
  display: flex;
  justify-content: center;
}
.scan-guan {
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 45px;
}
.openBg {
  width: 13px;
  height: 29px;
  background: url("../../assets/img/scan@2x.png") no-repeat;
  background-size: 100% 100%;
}
.offBg {
  width: 26px;
  height: 29px;
  background: url("../../assets/img/scanClose@2x.png") no-repeat;
  background-size: 100% 100%;
}
</style>
