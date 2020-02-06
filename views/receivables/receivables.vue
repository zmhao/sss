<template>
  <div class="receivables">
    <div class="receivables-header">
      <v-header
        title="我的收款码"
        :fontColor="false"
      ></v-header>
    </div>
    <div class="receivables-code">
      <div class="receivables-code-box">
        <div class="receivables-code-box-content">
          <div
            class="receivables-code-box-content-title"
            :style="{ visibility: price ? 'hidden' : 'visible' }"
          >
            <img src="../../assets/img/wallet@2x.png" alt="" />
            <span>{{ $t("二维收款码") }}</span>
          </div>
          <div class="receivables-code-box-content-code">
            <div class="receivables-code-box-content-code-header">
              <div
                class="receivables-code-box-content-code-header-title"
                :style="{ 'line-height': price ? '' : '50px' }"
              >
                {{ $t("扫一扫向我付款") }}
              </div>
              <div
                class="receivables-code-box-content-code-header-price"
                v-if="price ? true : false"
              >
                {{ $t(currencyName + price) }}
              </div>
            </div>
            <div
              class="receivables-code-box-content-code-div"
              id="qrCode"
              ref="qrCodeDiv"
            ></div>
            <!-- <img src="../../assets/img/addressBook@2x.png" alt="" /> -->
            <div class="receivables-code-box-content-code-setting">
              <p
                class="receivables-code-box-content-code-setting-money"
                @click="settingMoneyFun"
              >
                {{$t('设置金额')}}
              </p>
              <p @click="saveImg">{{$t('保存图片')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import storages from "@views/cache/cache";
import global from "@views/common/global";
import vHeader from "@/components/header/header";
export default {
  data() {
    return {
      // radio1: "USD",
      // input: "",
      // amount: "",
      qrCode: "A." + storages.get(global.USERINFO).gen_key,
      price: "",
      currencyName: "$",
      isBack: false
    };
  },
  watch: {},
  mounted: function() {
    if (storages.get(global.QRCODE_AMOUNT).length != 0) {
      this.qrCode = storages.get(global.QRCODE_AMOUNT).code;
      this.price = storages.get(global.QRCODE_AMOUNT).money;
      this.currencyName = storages.get(global.QRCODE_AMOUNT).currencyName;
    }
    storages.del(global.QRCODE_AMOUNT);
    this.$nextTick(function() {
      this.bindQRCode();
    });
    this.$nextTick(function() {
      this.queryCodeStatus();
    });
  },

  methods: {
    queryCodeStatus() {
      // window.setInterval(() => {
      //   setTimeout(fun, 0);
      // }, 2000);
    },
    // callBackClick() {
    //   this.$router.go(-1);
    // },
    // settingAmount() {
    //   this.$router.push("/settingamount");
    // },
    saveImg() {
      let that = this
      navigator.screenshot.save(
        function(error, res) {
          if (error) {
            that.$toast("保存失败");
          } else {
            console.log(res)
            that.$toast("图片保存成功");
            // that.$toast("图片地址:"+res.filePath);
          }
        },
        "jpg",
        50
      );
    },
    settingMoneyFun() {
      this.$router.push("/settingamount");
    },
    bindQRCode: function() {
      let self = this;
      new QRCode(this.$refs.qrCodeDiv, {
        text: self.qrCode,
        width: 170,
        height: 150,
        colorDark: "#333333", // 二维码颜色
        colorLight: "#ffffff", // 二维码背景色
        correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
      });
    }
    // settingMoneyFun: 跳转设置金额
  },
  components: {
    vHeader
  },
};
</script>
<style lang="scss" scoped>
.receivables {
  height: 100%;
  width: 100%;
  background-color: $btn-color;
  &-code {
    padding: 0 18px;
    margin-top: 35px;
    &-box {
      width: 100%;
      height: 360px;
      opacity: 1;
      border-radius: 6px;
      background-color: #fbfbfb;
      &-content {
        padding: 18px 18px;
        &-title {
          display: flex;
          align-items: center;
          color: $btn-color;
          font-size: 16px;
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        &-code {
          &-header {
            height: 50px;
            margin-bottom: 15px;
            &-title {
              font-size: 12px;
              color: #4d4d4d;
              // margin: 30px 0 20px 0;
              margin-bottom: 10px;
            }
            &-price {
              font-size: 24px;
              color: $font-color;
            }
          }

          &-div {
            margin: 0 auto;
            width: 178px;
            height: 178px;
            display: flex;
            justify-content: center;
          }
          &-setting {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 30px 0;
            &-money {
              position: relative;
              &::after {
                content: "";
                border-left: 0.026667rem solid #d6d6d6;
                text-align: right;
                position: absolute;
                height: 100%;
                right: 0;
              }
            }
            p {
              flex: 1;
              font-size: 13px;
              color: #20589a;
            }
          }
        }
      }
    }
  }
}
/* .radio {
  width: 100%;
  margin-left: 10px;
  padding-top: 20px;
}
.img-style {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
}
.bottom-label {
  padding: 15px;
  margin-top: 20px;
}
.btn {
  width: 80%;
  margin-top: 20px;
}
.top {
  padding-top: 5px;
  padding-left: 10px;
}
.title {
  width: 100%;
  margin-top: 20px;
  font-size: 18px;
  margin-left: 10px;
  color: #dcdcdc;
  display: inline-block;
} */
</style>
