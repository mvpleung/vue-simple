<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$router.currentRoute.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$router.currentRoute.meta.keepAlive" />
    <div class="app_footer"
      v-show="isShowTab">
      <router-link to="/homePage">
        <i class="iconfont icon-shouye" />
        <p>首页</p>
      </router-link>
      <router-link to="/vehicle/input">
        <i class="iconfont icon-tabproducticon" />
        <p>车牌号</p>
      </router-link>
      <router-link to="/minePage">
        <i class="iconfont icon-wode" />
        <p>我的</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'app',
  data() {
    return {
      search: ''
    };
  },
  computed: {
    /**
     * 是否显示底部tab
     */
    isShowTab() {
      return /vehicle|homePage|minePage/.test(this.$route.path);
    },
    ...mapState({
      pageDirection: state => state.global.pageDirection
    })
  },
  created() {
    //解决微信 title 设置异常问题
    document.setTitle = title => {
      document.title = title;
      if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        var i = document.createElement('iframe');
        i.src = '../favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
          setTimeout(function() {
            i.remove();
          }, 9);
        };
        document.body.appendChild(i);
      }
    };
  },
  beforeCreate() {}
};
</script>

<style lang="scss">
.PB-48 {
  padding-bottom: 56px;
}

.app_footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  a {
    display: block;
    flex: 1;
    text-align: center;
    text-decoration: none;
    font-size: 12px;
    color: grey;
    i {
      font-size: 30px;
    }
  }
  .router-link-exact-active,
  .router-link-active {
    i {
      color: red;
    }
    p {
      color: red;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.child-view {
  position: relative;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>