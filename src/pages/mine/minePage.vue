/*
 * 个人中心
 * @Author: liangzc 
 * @Date: 2018-01-27 14:26:16 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-02-27 14:42:04
 */
<template>
  <div class="minepage">
    <div class="mine-infor">
      <div class="mine-head-img">
        <img :src="headImg">
      </div>
      <div class="mine-nick-name">
        <span>测试</span>
      </div>
      <div class="mine-link-desc">
        <span>已绑定1305887284</span>
      </div>
    </div>
    <div>
      <swipe class="mt-30"
        :items="bannerData" />
      <grid-view class="mt-30"
        :items="items" />
      <swipe class="mt-30"
        :items="bannerData" />
    </div>
  </div>
</template>

<script>
import { GridView, Swipe } from '@/components';
export default {
  data() {
    return {
      userInfo: {
        balance: 0,
        integral: 66,
        coupon: 5,
        accountInfo: null //会员信息
      },
      items: [
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        },
        {
          label: '测试1',
          icon: require('@/assets/icon_tabbar.png')
        }
      ],
      bannerData: [
        {
          imgUrl: require('@/assets/banner.png')
        },
        {
          imgUrl: require('@/assets/banner1.png')
        }
      ]
    };
  },
  computed: {
    headImg() {
      return (
        this.$store.getters.user.wxHeadimg ||
        require('@/assets/integral-img.png')
      );
    }
  },
  components: {
    GridView,
    Swipe
  }
};
</script>

<style lang="scss" scoped>
.minepage {
  .mine-infor {
    height: 180px;
    padding-top: 8%;
    text-align: center;
    background: url(../../assets/mine-bg.png) top center no-repeat;
    .mine-head-img {
      width: 80px;
      margin: 0 auto;
      img {
        width: 100%;
        border-radius: 50px;
      }
    }
    .mine-nick-name {
      color: rgba(255, 255, 255, 0.829);
      font-size: 14px;
      margin-top: 10px;
    }
    .mine-link-desc {
      color: rgba(255, 255, 255, 0.705);
      font-size: 12px;
      margin-top: 20px;
    }
  }
  .mt-30 {
    margin-top: 30px;
  }
}
</style>