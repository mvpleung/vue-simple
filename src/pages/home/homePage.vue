<template>
  <div class="homePage">
    <h3>路由为动态扫描，路径为目录路径，路由手动配置 router/config.json</h3>
    <p>
      <router-link to="/verify">校验组件</router-link>
    </p>
    <p>
      <router-link to="/pay">支付组件（此路由为动态扫描）</router-link>
    </p>
    <p>
      <router-link to="/login">登录组件</router-link>
    </p>
    <p>
      其他请参考 src/components
    </p>
    <p v-if="$store.getters.isLogin">
      {{ JSON.stringify($store.getters.user) }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'home-page',
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style scoped="scoped" lang="scss">
.homePage {
  text-align: center;
  margin-top: 50px;
  p {
    margin-top: 25px;
  }
}
</style>