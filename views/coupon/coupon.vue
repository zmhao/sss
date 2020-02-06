<template>

  <div class="coupon">
    <div class="coupon-header">
      <v-header title="优惠券"></v-header>
    </div>
    <div class="coupon-pull">
      <!-- <pull-to
        class="coupon-pull-view"
        :top-load-method="refresh"
        :bottom-load-method="loadData"
      > -->
      <div
        @click="onItemClick(index)"
        v-for="(item, index) in dataList"
        :class="{
          'coupon-pull-item': item.status === 3,
          'coupon-pull-item1': item.status !== 3
        }"
        :key="index"
      >
        <div class="coupon-pull-item-div">
          <div class="coupon-pull-item-div-icon">
            <img
              class="coupon-pull-item-div-icon-img"
              v-if="item.status === 2"
              src="../../assets/img/expier.png"
            />
            <img
              class="coupon-pull-item-div-icon-img"
              v-if="item.status === 1"
              src="../../assets/img/coutponUse.png"
            />
          </div>

          <div class="coupon-pull-item-div-top">
            <div class="coupon-pull-item-div-top-left">
              <p class="coupon-pull-item-div-top-left-amount">100</p>
              <p class="coupon-pull-item-div-top-left-tag">元</p>
            </div>
            <div class="coupon-pull-item-div-top-right">
              <p class="coupon-pull-item-div-top-right-name">100{{$t('元直减券')}}</p>
              <p class="coupon-pull-item-div-top-right-date">
                2019.11.1-2019.12.15
              </p>
            </div>
          </div>
          <div class="coupon-pull-item-div-bottom">
            <p
              :class="{
                'coupon-pull-item-div-bottom-title': item.status === 3,
                'coupon-pull-item-div-bottom-title1': item.status !== 3
              }"
            >
              {{$t('全场通用：限时购、特价等优惠商品及详...')}}
            </p>
          </div>
        </div>
      </div>
      <!-- </pull-to> -->
    </div>
  </div>
</template>

<script>
import vHeader from "@/components/header/header";
import PullTo from "vue-pull-to";
export default {
  components: {
    PullTo,
    vHeader
  },
  data() {
    return {
      dataList: [{ status: 1 }, { status: 2 }, { status: 3 }]
    };
  },
  mounted() {},
  methods: {
    onItemClick(index) {
      let status = this.dataList[index].status;
      this.$router.push({
        name: "CouponDetail",
        query: {
          status: status
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    refresh(loaded) {},
    loadData(loaded) {}
  }
};
</script>
<style lang="scss" scoped>
.coupon {
  &-pull {
    margin-top: 40px;
    padding: 0 18px;
    &-item1 {
      padding: 1px 1px;
      margin-bottom: 10px;
      border-radius: 10px 10px 10px 10px;
      background: rgba(205, 205, 205, 1);
    }
    &-item {
      border-radius: 10px 10px 10px 10px;
      background: linear-gradient(
        90deg,
        rgba(120, 194, 255, 1) 0%,
        rgba(57, 149, 255, 1) 100%
      );
      &-div {
        &-icon {
          position: absolute;
          right: 2px;
          top: 2px;
          &-img {
            width: 40px;
            height: 40px;
          }
        }
        position: relative;
        display: flexbox;
        &-top {
          position: relative;
          display: flex;
          width: 100%;
          height: 100px;
          align-items: center;
          justify-items: center;
          &-left {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40%;
            height: 100px;
            border: 1px;
            border-left-color: #fff;
            &-amount {
              font-size: 33px;
              line-height: 40px;
              color: rgba(255, 255, 255, 1);
            }
            &-tag {
              margin-top: 10px;
              font-size: 13px;
              color: rgba(255, 255, 255, 1);
            }
          }
          &-right {
            display: inline;
            align-items: center;
            &-name {
              display: flex;
              font-size: 18px;
              color: rgba(255, 255, 255, 1);
            }
            &-date {
              display: flex;
              font-size: 14px;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
        &-bottom {
          width: 100%;
          position: relative;
          height: 41px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 1);
          // border: 1px solid rgba(204, 209, 223, 1);
          border-radius: 0px 0px 10px 10px;
          overflow: hidden;
          &-title {
            font-size: 14px;
            color: rgba(37, 53, 90, 1);
            opacity: 1;
            margin-left: 20px;
          }
          &-title1 {
            font-size: 14px;
            margin-left: 20px;
            color: rgba(205, 205, 205, 1);
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
