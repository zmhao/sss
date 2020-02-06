<template>
  <el-container>
    <el-header>
      <div class="top-title">
        <el-page-header class="top" @back="goBack" title="" content="消息中心">
          <div class="title">
            消息中心
          </div>
        </el-page-header>
      </div>
    </el-header>
    <el-main>
      <div style=" display: inline-block;">$100.00</div>
      <br />
      <div style=" display: inline-block;">充值中</div>
      <div class="div-hen">
        <span class="class_lift">付款方式</span>
        <span class="class_right">现金</span>
      </div>
      <br />
      <div class="div-hen">
        <span class="class_lift">交易类型</span>
        <span class="class_right">充值</span>
      </div>
      <br />
      <div class="div-hen">
        <span class="class_lift">创建时间</span>
        <span style="float:right">2019-11-09 22：02：33</span>
      </div>
      <br />
      <div class="div-hen">
        <span class="class_lift">订单号</span>
        <span class="class_right">164616546846464361846</span>
      </div>
      <el-image style="width: 100px; height: 100px" :src="url"></el-image>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.top {
  padding-top: 5px;
}
.title {
  width: 100%;
  float: left;
  display: flex;
  margin-top: 20px;
  font-size: 28px;
}
.top-title {
  position: absolute;
}
.class_lift {
  float: left;
}
.class_right {
  float: right;
}
.div-hen {
  width: 100%;
  display: flex;
}
</style>
