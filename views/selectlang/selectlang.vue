<template>
  <div class="lang">
    <div class="lang-header">
      <v-header></v-header>
    </div>
    <div class="lang-content">
      <p class="lang-content-title">{{ $t("切换语言") }}</p>
      <div class="lang-content-list">
        <div
          class="lang-content-list-item"
          @click="onItemClick(index)"
          v-for="(x, index) in list"
          :key="index"
        >
          <div class="lang-content-list-item-content">
            <p class="lang-content-list-item-content-text">{{ x.name }}</p>
          </div>
          <img
            v-if="x.isSelect === true"
            src="../../assets/img/langIcon@2x.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storages from "@views/cache/cache";
import global from "@views/common/global";
import vHeader from "@/components/header/header";

export default {
  data() {
    return {
      list: [
        { id: 1, name: "中文", isSelect: false },
        { id: 2, name: "English", isSelect: false },
        { id: 3, name: "ខ្មែរ", isSelect: false }
      ],
      lang: storages.get(global.LANG) || "zh-CN"
    };
  },
  mounted() {
    this.lang = storages.get(global.LANG) || "zh-CN";
    switch (this.lang) {
      case "en":
        this.list[1].isSelect = true;
        break;
      case "km":
        this.list[2].isSelect = true;
        break;
      default:
        this.list[0].isSelect = true;
        break;
    }
    if (this.lang == "zh-CN") {
    }
  },
  methods: {
    onItemClick(index) {
      switch (this.list[index].id) {
        case 1:
          this.$i18n.locale = "zh-CN";
          storages.set(global.LANG, "zh-CN");
          break;
        case 2:
          this.$i18n.locale = "en";
          storages.set(global.LANG, "en");
          break;
        case 3:
          this.$i18n.locale = "km";
          storages.set(global.LANG, "km");
          break;
      }
      this.$router.back();
    },
    goBack() {
      this.$router.back();
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss" scoped>
.lang {
  width: 100%;
  height: 100%;
  &-content {
    padding: 0 18px;
    margin-top: 30px;
    &-title {
      font-size: 24px;
      text-align: left;
      color: rgba(36, 52, 90, 1);
    }
    &-list {
      width: 100%;
      &-item {
        width: 100%;
        padding-top: 30px;
        padding-bottom: 5px;
        display: flex;
        justify-items: center;
        align-items: center;
        border-bottom: 1px solid #eae9e9;
        &-content {
          width: 100%;
          &-text {
            font-size: 16px;
            text-align: left;
            color: rgba(68, 68, 68, 1);
            margin-bottom: 5px;
          }
        }
        img {
          float: right;
          width: 22px;
          height: 16px;
        }
      }
    }
  }
}
</style>
