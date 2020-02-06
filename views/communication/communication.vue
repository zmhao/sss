<template>
  <div class="trans">
    <v-header title="选择朋友"></v-header>
    <div class="trans-history">
      <div
        @click="itemClick(index)"
        class="trans-history-list"
        v-for="(item, index) in historyList"
        :key="index"
      >
        <div class="trans-history-list-item">
          <img :src="imgSrc" />
          <div class="trans-history-list-item-text">
            <p class="trans-history-list-item-text-phone">
              {{ item.collect_phone }}
            </p>
            <p class="trans-history-list-item-text-nickname">
              {{ item.nickname }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import { apiGetTakeHistory } from "@api/api";
import storages from "@views/cache/cache";
import global from "@views/common/global";
export default {
  data() {
    return {
      historyList: [],
      imgSrc: require("../../assets/img/headPhoto@2x.png"),
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.getDatas();
  },
  methods: {
    itemClick(i) {
      storages.set(global.TRANS_HISTORY, this.historyList[i].collect_phone);
      this.$router.back();
    },
    getDatas() {
      this.$loading();
      apiGetTakeHistory({
        page: this.page,
        page_size: this.page_size
      }).then(res => {
        this.$loading.close();
        this.historyList = res.data.data;
      });
    }
  },
  components: {
    vHeader
  }
};
</script>
<style lang="scss">
.trans {
  width: 100%;
  height: 100%;
  &-history {
    margin-top: 12px;
    &-list {
      &::after {
        content: "";
        display: block;
        border-bottom: 1px solid $font-color;
        opacity: 0.1;
        @include menu-borderBottom;
      }
      &-item {
        height: 73px;
        display: flex;
        align-items: center;
        padding: 0 18px;
        img {
          width: 37px;
          height: 37px;
        }
        &-text {
          padding: 2px 20px 0px 10px;
          &-phone {
            font-size: 16px;
            text-align: left;
            color: rgba(36, 52, 90, 1);
            opacity: 1;
          }
          &-nickname {
            font-size: 10px;
            text-align: left;
            color: rgba(187, 187, 187, 1);
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
