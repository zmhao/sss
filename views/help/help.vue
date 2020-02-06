<template>
  <div class="help">
    <div class="help-header">
      <v-header title="帮助"></v-header>
    </div>
    <div class="help-content">
      <p class="help-content-title">{{ $t("常见问题") }}</p>
      <div class="help-content-list">
        <div
          class="help-content-list-item"
          @click="onItemClick(index)"
          v-for="(x, index) in list"
          :key="index"
        >
          <div class="help-content-list-item-content">
            <p class="help-content-list-item-content-text">
              {{ index + 1 + "、" + x.name }}
            </p>
            <div
              v-if="index !== 3"
              class="help-content-list-item-content-lin"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="help-btn">
      <v-btn
        btnText="咨询客服"
        :disabledVal="false"
        type="primary"
        @btnSubmit="transSubmit"
      ></v-btn>
    </div>
  </div>
</template>
<script>
import vHeader from "@/components/header/header";
import vBtn from "@/components/button/button";
export default {
  data() {
    return {
      list: [
        { name: "什么是ModentPay?" },
        { name: "充值冲错号码怎么办?" },
        { name: "手机换了如何修改绑定手机？" },
        { name: "账户里被自动扣款了是什么情况？" }
      ],
      listSize: 0
    };
  },
  mounted() {
    this.listSize = this.list.length;
  },
  methods: {
    transSubmit() {},
    onItemClick(index) {
      this.$router.push({
        name: "HelpDetail",
        query: {
          title: this.list[index].name,
          content: this.list[index].name
        }
      });
    }
  },
  components: {
    vHeader,
    vBtn
  }
};
</script>
<style lang="scss" scoped>
.help {
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
      margin-top: 20px;
      border: 1px solid #eae9e9;
      border-radius: 10px;
      width: 100%;
      &-item {
        width: 100%;
        padding-bottom: 5px;
        margin: 20px;
        display: flex;
        justify-items: center;
        align-items: center;
        &-content {
          width: 100%;
          &-text {
            text-align: left;
            font-size: 16px;
            color: rgba(68, 68, 68, 1);
            // border-bottom: 1px solid #eae9e9;
          }
          &-lin {
            margin-top: 15px;
            width: 90%;
            border-bottom: 1px solid #eae9e9;
          }
        }
      }
    }
  }
  &-btn {
    position: fixed;
    width: 100%;
    margin-bottom: 30px;
    bottom: 0;
  }
}
</style>
