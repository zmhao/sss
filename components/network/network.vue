<template>
  <div class="network" v-if="state">
    <div class="network-box">
      <img src="../../assets/img/netword@2x.png" />
      <p class="network-box-title">
        {{ $t("当前网络不可用，请检查您的网络设置。") }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      state: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.checkConnection();
    }, 500);
    document.addEventListener("offline", this.onOffline, false);
    document.addEventListener("online", this.callbackfunction, false);
  },
  methods: {
    checkConnection() {
      let networkState = navigator.connection.type;
      let states = {};
      if (networkState) {
        states[Connection.UNKNOWN] = "Unknown connection";
        states[Connection.ETHERNET] = "Ethernet connection";
        states[Connection.WIFI] = "WiFi connection";
        states[Connection.CELL_2G] = "Cell 2G connection";
        states[Connection.CELL_3G] = "Cell 3G connection";
        states[Connection.CELL_4G] = "Cell 4G connection";
        states[Connection.CELL] = "Cell generic connection";
        states[Connection.NONE] = "No network connection";
        if (networkState == Connection.NONE) {
          this.state = true;
        } else {
          this.state = false;
        }
      }
    },
    // 监听无网络
    onOffline() {
      let networkState = navigator.connection.type;
      if (networkState) {
        if (networkState === Connection.NONE) {
          this.state = true;
        }
      }
    },
    // 监听有网络
    callbackfunction() {
      this.state = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.network {
  // width: 100%;
  height: 34px;
  background-color: #ffe9d0;
  padding: 0 18px;
  &-box {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
    &-title {
      color: #d41f10;
    }
  }
}
</style>
