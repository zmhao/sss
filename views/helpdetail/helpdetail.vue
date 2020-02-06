<template>
  <div class="help">
    <div class="help-header">
      <v-header></v-header>
    </div>
    <div class="help-content">
      <div class="help-content-div">
        <p class="help-content-div-title">{{ title }}</p>
        <p class="help-content-div-content">{{ content }}</p>
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
      title: "",
      content: ""
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.content = this.$route.query.content;
  },
  methods: {
    transSubmit() {},
    onItemClick() {}
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
    display: flex;
    padding: 0 18px;
    margin-top: 30px;
    &-div {
      &-title {
        font-size: 25px;
        text-align: left;
        color: rgba(36, 52, 90, 1);
      }
      &-content {
        font-size: 16px;
        margin-top: 25px;
        text-align: left;
        color: rgba(68, 68, 68, 1);
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
