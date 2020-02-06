<template>
  <div class="coupond">
    <div class="coupond-header">
      <v-header title="详情"></v-header>
    </div>
    <div class="content">
      <div
        :class="{
          'content-bg': status === 3,
          'content-bg1': status !== 3
        }"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from '@/components/header/header'
export default {
  components: {
    vHeader
  },
  data () {
    return {
      status: 0
    }
  },
  mounted () {
    this.status = this.$route.query.status
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.coupond {
  width: 100%;
  height: 100%;
  .content {
    height: 80%;
    padding: 0 18px;
    &-bg {
      height: 100%;
      margin-top: 20px;
      background: url("../../assets/img/conSuccess.png") no-repeat;
    }
    &-bg1 {
      height: 100%;
      margin-top: 20px;
      background: url("../../assets/img/conError.png") no-repeat;
    }
  }
}
</style>
